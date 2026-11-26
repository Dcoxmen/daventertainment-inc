"use client";

// The headshot on /about, which turns into a live LemonSlice video avatar of David
// when a visitor asks for it. Daily (the call SDK) loads only on that click.
// Sessions end on hang-up, idle, the time cap, or leaving the page, so billing stops.

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { DailyCall } from "@daily-co/daily-js";
import { usePlayer } from "@/components/player/PlayerProvider";

const CONNECT_TIMEOUT_MS = 150_000; // a cold start can take up to 2.5 minutes
const MAX_CALL_MS = 5 * 60_000;

type Status = "idle" | "connecting" | "live" | "ended" | "error";

export default function AvatarChat({ headshot }: { headshot: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [caption, setCaption] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [text, setText] = useState("");
  const call = useRef<DailyCall | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const video = useRef<HTMLVideoElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const player = usePlayer();

  const end = useCallback(async (next: Status = "ended", message = "") => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const current = call.current;
    call.current = null;
    if (current) {
      try {
        current.sendAppMessage({ event: "force-end" }, "*"); // stops the avatar and its billing
        await current.leave();
      } catch {}
      current.destroy().catch(() => {});
    }
    setError(message);
    setStatus(next);
  }, []);

  const start = useCallback(async () => {
    setStatus("connecting");
    setError("");
    setCaption("");
    setMicOn(true);
    if (player.status !== "off") player.toggle(); // pause the radio while David talks

    try {
      const res = await fetch("/api/avatar/session", { method: "POST" });
      const data = await res.json();
      if (!res.ok) return end("error", data.error ?? "The avatar is not available right now.");

      const Daily = (await import("@daily-co/daily-js")).default;
      const c = Daily.createCallObject({ audioSource: true, videoSource: false });
      call.current = c;

      c.on("track-started", (ev) => {
        if (!ev.participant || ev.participant.local) return; // the avatar is the only other participant
        const el = ev.type === "video" ? video.current : ev.type === "audio" ? audio.current : null;
        if (el) el.srcObject = new MediaStream([ev.track]);
      });
      c.on("participant-left", (ev) => {
        if (!ev.participant.local) end();
      });
      c.on("app-message", (ev) => {
        const msg = ev.data;
        if (msg?.type === "agent_transcription") setCaption(msg.transcription);
        if (msg?.type === "idle_timeout") end();
        if (msg?.type === "daily_error" && msg.fatal) end("error", "The call dropped. Please try again.");
        if (msg?.type === "video_generation_error") end("error", "The avatar hit a problem. Please try again.");
      });
      c.on("error", () => end("error", "The call dropped. Please try again."));

      timers.current.push(
        setTimeout(() => end("error", "The avatar took too long to connect. Please try again."), CONNECT_TIMEOUT_MS)
      );
      await c.join({ url: data.roomUrl, token: data.token, startVideoOff: true });
    } catch {
      end("error", "The avatar could not connect. Please try again.");
    }
  }, [end, player]);

  // The first video frame means the avatar is on screen.
  const onPlaying = useCallback(() => {
    if (!call.current || status === "live") return;
    timers.current.forEach(clearTimeout);
    timers.current = [setTimeout(() => end(), MAX_CALL_MS)];
    setStatus("live");
  }, [end, status]);

  // Leaving the page or tab ends the call too.
  useEffect(() => {
    const leave = () => {
      if (call.current) void end();
    };
    window.addEventListener("pagehide", leave);
    return () => {
      window.removeEventListener("pagehide", leave);
      leave();
    };
  }, [end]);

  const toggleMic = () => {
    const next = !micOn;
    call.current?.setLocalAudio(next);
    setMicOn(next);
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const message = text.trim();
    if (!message || !call.current) return;
    call.current.sendAppMessage({ event: "chat-msg", message, name: "User" }, "*");
    setText("");
  };

  const inCall = status === "connecting" || status === "live";

  return (
    <div className="mx-auto w-64 md:w-80">
      <div
        className={`relative mx-auto overflow-hidden border-2 border-primary transition-[border-radius,aspect-ratio] duration-500 ${
          inCall ? "aspect-[2/3] rounded-2xl" : "aspect-square rounded-full"
        }`}
      >
        <Image
          src={headshot}
          alt="David Cox"
          fill
          sizes="320px"
          className={`object-cover ${inCall ? "object-center" : "object-[50%_15%]"}`}
        />
        {inCall && (
          <video
            ref={video}
            autoPlay
            playsInline
            muted
            onPlaying={onPlaying}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              status === "live" ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        {status === "connecting" && (
          <div className="absolute inset-0 flex items-end justify-center bg-background/50 p-4">
            <p className="animate-pulse font-code-label text-[13px] text-primary" role="status">
              Connecting to David&apos;s avatar…
            </p>
          </div>
        )}
        {status === "live" && caption && (
          <p className="absolute inset-x-0 bottom-0 bg-background/75 px-3 py-2 text-[13px] leading-snug" aria-live="polite">
            {caption}
          </p>
        )}
      </div>
      <audio ref={audio} autoPlay />

      <div className="mt-4 space-y-3 text-center">
        {inCall ? (
          <>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={toggleMic}
                aria-pressed={!micOn}
                className="rounded-lg border border-outline px-4 py-2 font-code-label text-[13px] hover:border-primary hover:text-primary"
              >
                {micOn ? "Mute mic" : "Unmute mic"}
              </button>
              <button
                type="button"
                onClick={() => end()}
                className="rounded-lg bg-tertiary px-4 py-2 font-code-label text-[13px] text-on-tertiary hover:opacity-85"
              >
                End call
              </button>
            </div>
            <form onSubmit={send} className="flex gap-2">
              <label htmlFor="avatar-question" className="sr-only">
                Type a question
              </label>
              <input
                id="avatar-question"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Or type a question"
                maxLength={300}
                disabled={status !== "live"}
                className="glass-input min-w-0 flex-1 rounded-lg px-3 py-2 text-[14px]"
              />
              <button
                type="submit"
                disabled={status !== "live" || !text.trim()}
                className="rounded-lg border border-outline px-3 py-2 font-code-label text-[13px] hover:border-primary hover:text-primary disabled:opacity-40"
              >
                Ask
              </button>
            </form>
          </>
        ) : (
          <button
            type="button"
            onClick={start}
            className="rounded-lg border border-primary px-5 py-2.5 font-button text-button text-primary hover:bg-primary hover:text-on-primary"
          >
            {status === "ended" ? "Talk again" : "Ask my AI avatar"}
          </button>
        )}
        {error && (
          <p className="text-[13px] text-tertiary" role="alert">
            {error}
          </p>
        )}
        <p className="text-[12px] leading-snug text-on-surface-variant">
          An AI avatar of me that answers from my public portfolio. Calls use your microphone, last up to 5
          minutes, and are processed by LemonSlice. Please don&apos;t share personal information.
        </p>
      </div>
    </div>
  );
}
