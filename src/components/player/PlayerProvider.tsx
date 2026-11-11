"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { STATIONS } from "@/content/stations";

// One site-wide radio. It lives in the root layout, so the music keeps playing
// while visitors move between pages. The home story and the /music dial both drive it.

export type PlayerStatus = "off" | "loading" | "on";

type Playing = { source: AudioBufferSourceNode; gain: GainNode };

type Engine = {
  context: AudioContext;
  filter: BiquadFilterNode;
  master: GainNode;
  analyser: AnalyserNode;
  hiss: GainNode;
  playing: Playing | null;
};

type Player = {
  status: PlayerStatus;
  station: number;
  /** True once the visitor has started the radio on this visit. */
  started: boolean;
  toggle: () => void;
  tune: (index: number) => void;
  /** Call inside a click or key handler before a delayed tune, so browsers allow audio. */
  unlock: () => void;
  /** Home story: 0 = muffled, 1 = fully open. null removes the effect. */
  setFilter: (progress: number | null) => void;
  analyser: () => AnalyserNode | null;
};

const VOLUME = 0.8;
const HISS = 0.07;
const PRIMING = 1105 / 48000; // encoder delay at the start of each station MP3
const cutoff = (progress: number | null) => (progress === null ? 20000 : Math.min(20000, 320 * Math.pow(2, progress * 6)));
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const PlayerContext = createContext<Player | null>(null);

export function usePlayer() {
  const player = useContext(PlayerContext);
  if (!player) throw new Error("usePlayer must be used inside PlayerProvider");
  return player;
}

export default function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatusState] = useState<PlayerStatus>("off");
  const [station, setStationState] = useState(0);
  const [started, setStarted] = useState(false);
  const engine = useRef<Engine | null>(null);
  const buffers = useRef(new Map<string, Promise<AudioBuffer>>());
  const filterProgress = useRef<number | null>(null);
  const tuneId = useRef(0);
  const suspendTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // Refs mirror the state so callbacks always see the latest values.
  const statusRef = useRef<PlayerStatus>("off");
  const stationRef = useRef(0);
  const setStatus = useCallback((next: PlayerStatus) => {
    statusRef.current = next;
    setStatusState(next);
  }, []);
  const setStation = useCallback((next: number) => {
    stationRef.current = next;
    setStationState(next);
  }, []);

  const ensureEngine = useCallback(() => {
    if (engine.current) return engine.current;
    const context = new AudioContext();
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.Q.value = Math.SQRT1_2;
    filter.frequency.value = cutoff(filterProgress.current);
    const master = context.createGain();
    master.gain.value = VOLUME;
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    filter.connect(master).connect(analyser).connect(context.destination);

    // Radio static between stations: looping noise through a band-pass, silent until tuning.
    const noise = context.createBuffer(1, context.sampleRate, context.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const hissSource = context.createBufferSource();
    hissSource.buffer = noise;
    hissSource.loop = true;
    const band = context.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 2200;
    band.Q.value = 0.7;
    const hiss = context.createGain();
    hiss.gain.value = 0;
    hissSource.connect(band).connect(hiss).connect(master);
    hissSource.start();

    engine.current = { context, filter, master, analyser, hiss, playing: null };
    return engine.current;
  }, []);

  const unlock = useCallback(() => {
    clearTimeout(suspendTimer.current);
    const current = ensureEngine();
    current.context.resume();
    current.master.gain.setTargetAtTime(VOLUME, current.context.currentTime, 0.05);
  }, [ensureEngine]);

  const load = useCallback((context: AudioContext, src: string) => {
    let buffer = buffers.current.get(src);
    if (!buffer) {
      buffer = fetch(src)
        .then((response) => {
          if (!response.ok) throw new Error(`Could not load ${src}`);
          return response.arrayBuffer();
        })
        .then((bytes) => context.decodeAudioData(bytes));
      buffer.catch(() => buffers.current.delete(src));
      buffers.current.set(src, buffer);
    }
    return buffer;
  }, []);

  const tune = useCallback(
    async (index: number) => {
      const id = ++tuneId.current;
      const target = STATIONS[(index + STATIONS.length) % STATIONS.length];
      const targetIndex = STATIONS.indexOf(target);
      setStation(targetIndex);
      setStarted(true);
      setStatus("loading");
      unlock();
      const current = engine.current!;
      const { context } = current;
      const now = context.currentTime;

      current.hiss.gain.setTargetAtTime(HISS, now, 0.03);
      const old = current.playing;
      if (old) {
        old.gain.gain.setTargetAtTime(0, now, 0.12);
        old.source.stop(now + 1);
        current.playing = null;
      }

      let buffer: AudioBuffer;
      try {
        [buffer] = await Promise.all([load(context, target.src), wait(350)]);
      } catch {
        if (id !== tuneId.current) return;
        current.hiss.gain.setTargetAtTime(0, context.currentTime, 0.1);
        setStatus("off");
        return;
      }
      if (id !== tuneId.current) return; // a newer tune or a stop happened meanwhile

      const source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      // Browsers differ on trimming the MP3 encoder delay, so set the loop region explicitly.
      const offset = buffer.duration - target.seconds > 0.01 ? PRIMING : 0;
      source.loopStart = offset;
      source.loopEnd = offset + target.seconds;
      const gain = context.createGain();
      gain.gain.value = 0;
      source.connect(gain).connect(current.filter);
      const at = context.currentTime;
      source.start(at, offset);
      gain.gain.setTargetAtTime(1, at, 0.25);
      current.hiss.gain.setTargetAtTime(0, at, 0.15);
      current.playing = { source, gain };
      setStatus("on");
    },
    [load, unlock, setStatus, setStation]
  );

  const stop = useCallback(() => {
    const current = engine.current;
    tuneId.current++;
    setStatus("off");
    if (!current) return;
    const now = current.context.currentTime;
    current.hiss.gain.setTargetAtTime(0, now, 0.05);
    current.master.gain.setTargetAtTime(0, now, 0.1);
    clearTimeout(suspendTimer.current);
    suspendTimer.current = setTimeout(() => current.context.suspend(), 600);
  }, [setStatus]);

  const toggle = useCallback(() => {
    if (statusRef.current !== "off") return stop();
    const current = engine.current;
    if (current?.playing) {
      unlock();
      setStatus("on");
      return;
    }
    tune(stationRef.current);
  }, [stop, tune, unlock, setStatus]);

  const setFilter = useCallback((progress: number | null) => {
    filterProgress.current = progress;
    const current = engine.current;
    if (current) current.filter.frequency.setTargetAtTime(cutoff(progress), current.context.currentTime, 0.25);
  }, []);

  const analyser = useCallback(() => engine.current?.analyser ?? null, []);

  // Lock-screen and media-key controls where the browser supports them.
  useEffect(() => {
    if (!("mediaSession" in navigator) || !started) return;
    const session = navigator.mediaSession;
    session.metadata = new MediaMetadata({
      title: STATIONS[station].title,
      artist: "Daventertainment Inc",
      album: "Daventertainment Radio",
      artwork: [{ src: "/Daventertainment-logo.png", sizes: "1024x1024", type: "image/png" }],
    });
    session.playbackState = status === "off" ? "paused" : "playing";
    session.setActionHandler("play", () => statusRef.current === "off" && toggle());
    session.setActionHandler("pause", () => statusRef.current !== "off" && toggle());
    session.setActionHandler("nexttrack", () => tune(stationRef.current + 1));
    session.setActionHandler("previoustrack", () => tune(stationRef.current - 1));
  }, [started, station, status, toggle, tune]);

  const value = useMemo(
    () => ({ status, station, started, toggle, tune, unlock, setFilter, analyser }),
    [status, station, started, toggle, tune, unlock, setFilter, analyser]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
