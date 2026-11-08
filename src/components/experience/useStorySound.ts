"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SoundStatus = "off" | "loading" | "on";

type Engine = { context: AudioContext; gain: GainNode; filter: BiquadFilterNode };

const VOLUME = 0.7;

// The track starts muffled and opens up as the story moves forward.
const cutoff = (progress: number) => 320 * Math.pow(2, progress * 6);

export function useStorySound(src: string) {
  const [status, setStatus] = useState<SoundStatus>("off");
  const engine = useRef<Engine | null>(null);
  const progress = useRef(0);

  const setProgress = useCallback((value: number) => {
    progress.current = value;
    const current = engine.current;
    if (!current) return;
    current.filter.frequency.setTargetAtTime(cutoff(value), current.context.currentTime, 0.25);
  }, []);

  const toggle = useCallback(async () => {
    const current = engine.current;
    if (status === "loading") return;

    if (status === "on" && current) {
      current.gain.gain.setTargetAtTime(0, current.context.currentTime, 0.15);
      setStatus("off");
      return;
    }

    if (current) {
      await current.context.resume();
      current.gain.gain.setTargetAtTime(VOLUME, current.context.currentTime, 0.4);
      setStatus("on");
      return;
    }

    // Created inside the click so browsers allow audio to start.
    const context = new AudioContext();
    setStatus("loading");
    try {
      const response = await fetch(src);
      if (!response.ok) throw new Error(`Could not load ${src}`);
      const buffer = await context.decodeAudioData(await response.arrayBuffer());

      const filter = context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = cutoff(progress.current);
      const gain = context.createGain();
      gain.gain.value = 0;
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(filter).connect(gain).connect(context.destination);
      source.start();
      gain.gain.setTargetAtTime(VOLUME, context.currentTime, 0.4);

      engine.current = { context, gain, filter };
      setStatus("on");
    } catch {
      context.close();
      setStatus("off");
    }
  }, [src, status]);

  // Stop the music when leaving the home page.
  useEffect(() => {
    const current = engine;
    return () => {
      current.current?.context.close();
    };
  }, []);

  return { status, toggle, setProgress };
}
