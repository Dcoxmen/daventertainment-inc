"use client";

import { useEffect, useRef, useState } from "react";
import { STATIONS } from "@/content/stations";
import { usePlayer } from "@/components/player/PlayerProvider";
import { NextIcon, PauseIcon, PlayIcon, PrevIcon } from "@/components/player/icons";

// The Dial: 12 stations around a knob like hours on a clock. Drag the knob,
// tap a number, or use the arrow keys. Tuning plays a moment of static.

const COUNT = STATIONS.length;
const STEP = 360 / COUNT;
const SIZE = 400;
const C = SIZE / 2;
const KNOB_R = 112;
const BARS_IN = 122;
const BARS_OUT = 152;
const LABEL_R = 182;
const BAR_COUNT = 72;
const pad = (n: number) => String(n + 1).padStart(2, "0");
const wrap = (i: number) => ((i % COUNT) + COUNT) % COUNT;

function polar(radius: number, degrees: number) {
  const rad = ((degrees - 90) * Math.PI) / 180;
  return { x: C + radius * Math.cos(rad), y: C + radius * Math.sin(rad) };
}

// Turn the knob the short way round, so 12 → 1 doesn't spin backwards.
function nearestTurn(current: number, degrees: number) {
  const delta = ((((degrees - current) % 360) + 540) % 360) - 180;
  return current + delta;
}

export default function RadioDial() {
  const { status, station, toggle, tune, unlock, analyser } = usePlayer();
  const [preview, setPreview] = useState<number | null>(null);
  const [turn, setTurn] = useState(station * STEP);
  const [dragging, setDragging] = useState(false);
  const dial = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const keyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const shown = preview ?? station;
  const playing = status !== "off";

  // Follow station changes made elsewhere (media keys, the next button).
  const [followed, setFollowed] = useState(station);
  if (station !== followed) {
    setFollowed(station);
    if (preview === null && !dragging) setTurn(nearestTurn(turn, station * STEP));
  }

  useEffect(() => () => clearTimeout(keyTimer.current), []);

  function select(index: number) {
    setPreview(null);
    setTurn((t) => nearestTurn(t, index * STEP));
    tune(index);
  }

  function angleAt(event: React.PointerEvent) {
    const box = dial.current!.getBoundingClientRect();
    const x = event.clientX - box.left - box.width / 2;
    const y = event.clientY - box.top - box.height / 2;
    return ((Math.atan2(x, -y) * 180) / Math.PI + 360) % 360;
  }

  function onPointerDown(event: React.PointerEvent) {
    if (event.button !== 0) return;
    unlock();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    const degrees = angleAt(event);
    setTurn((t) => nearestTurn(t, degrees));
    setPreview(wrap(Math.round(degrees / STEP)));
  }

  function onPointerMove(event: React.PointerEvent) {
    if (!dragging) return;
    const degrees = angleAt(event);
    setTurn((t) => nearestTurn(t, degrees));
    setPreview(wrap(Math.round(degrees / STEP)));
  }

  function onPointerUp() {
    if (!dragging) return;
    setDragging(false);
    if (preview !== null) select(preview);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    const from = preview ?? station;
    const next =
      event.key === "ArrowRight" || event.key === "ArrowUp" ? from + 1
      : event.key === "ArrowLeft" || event.key === "ArrowDown" ? from - 1
      : event.key === "Home" ? 0
      : event.key === "End" ? COUNT - 1
      : null;
    if (next === null) return;
    event.preventDefault();
    unlock();
    const index = wrap(next);
    setPreview(index);
    setTurn((t) => nearestTurn(t, index * STEP));
    // Wait for the keys to settle so quick presses don't download every station.
    clearTimeout(keyTimer.current);
    keyTimer.current = setTimeout(() => select(index), 350);
  }

  // Visualizer ring: bars around the knob follow the music.
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    const ratio = window.devicePixelRatio || 1;
    element.width = SIZE * ratio;
    element.height = SIZE * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const node = analyser();
    const data = new Uint8Array(node?.frequencyBinCount ?? 128);
    let frame = 0;

    const draw = () => {
      context.clearRect(0, 0, SIZE, SIZE);
      const live = status === "on" && node && !still;
      if (live) node.getByteFrequencyData(data);
      context.lineCap = "round";
      context.lineWidth = 3;
      for (let i = 0; i < BAR_COUNT; i++) {
        // Mirror the low end around the ring so both halves move together.
        const bin = 2 + Math.round((i < BAR_COUNT / 2 ? i : BAR_COUNT - 1 - i) * 1.6);
        const level = live ? data[bin] / 255 : 0;
        const degrees = (i / BAR_COUNT) * 360;
        const from = polar(BARS_IN, degrees);
        const to = polar(BARS_IN + 2 + level * (BARS_OUT - BARS_IN), degrees);
        context.strokeStyle = `rgba(212, 176, 106, ${0.18 + level * 0.8})`;
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        context.stroke();
      }
      if (live) frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, [status, analyser]);

  const current = STATIONS[shown];
  const pointer = { a: polar(KNOB_R - 46, 0), b: polar(KNOB_R - 14, 0) };

  return (
    <div className="grid items-center gap-10 md:grid-cols-[minmax(0,420px)_1fr] md:gap-16">
      <div
        ref={dial}
        role="slider"
        tabIndex={0}
        aria-label="Station dial"
        aria-valuemin={1}
        aria-valuemax={COUNT}
        aria-valuenow={shown + 1}
        aria-valuetext={`Station ${shown + 1}: ${current.title}`}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative mx-auto aspect-square w-full max-w-[420px] cursor-grab touch-none rounded-full outline-none select-none focus-visible:ring-2 focus-visible:ring-primary active:cursor-grabbing"
      >
        <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden className="absolute inset-0 size-full">
          <defs>
            <radialGradient id="knob" cx="40%" cy="35%" r="75%">
              <stop offset="0%" stopColor="#2d3449" />
              <stop offset="100%" stopColor="#0b1326" />
            </radialGradient>
          </defs>
          <circle cx={C} cy={C} r={C - 4} fill="none" stroke="rgba(255,255,255,0.08)" />
          {STATIONS.map((s, i) => {
            const degrees = i * STEP;
            const t1 = polar(158, degrees);
            const t2 = polar(166, degrees);
            const label = polar(LABEL_R, degrees);
            const active = i === shown;
            return (
              <g key={s.id}>
                <line x1={t1.x} y1={t1.y} x2={t2.x} y2={t2.y} stroke={active ? "#d4b06a" : "rgba(255,255,255,0.25)"} strokeWidth={2} />
                <text
                  x={label.x}
                  y={label.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-code-label"
                  fontSize={13}
                  fill={active ? "#d4b06a" : "#c8bfcc"}
                  fontWeight={active ? 700 : 400}
                >
                  {pad(i)}
                </text>
              </g>
            );
          })}
          <g
            style={{
              transform: `rotate(${turn}deg)`,
              transformOrigin: "50% 50%",
              transition: dragging ? "none" : "transform 450ms cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          >
            <circle cx={C} cy={C} r={KNOB_R} fill="url(#knob)" stroke="rgba(212,176,106,0.55)" strokeWidth={2} />
            <circle cx={C} cy={C} r={KNOB_R - 8} fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="2 6" />
            <line x1={pointer.a.x} y1={pointer.a.y} x2={pointer.b.x} y2={pointer.b.y} stroke="#d4b06a" strokeWidth={4} strokeLinecap="round" />
          </g>
        </svg>
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={toggle}
          aria-label={playing ? "Pause radio" : "Play radio"}
          className="absolute top-1/2 left-1/2 grid size-[22%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-on-primary shadow-lg shadow-black/40 transition-transform hover:scale-105"
        >
          {status === "loading" ? <span className="size-5 animate-spin rounded-full border-2 border-on-primary border-t-transparent" /> : playing ? <PauseIcon className="size-7" /> : <PlayIcon className="size-7 translate-x-0.5" />}
        </button>
      </div>

      <div>
        <p className="font-code-label text-code-label text-primary uppercase">
          Station {pad(shown)} / {COUNT} ·{" "}
          {preview !== null ? "Release to tune" : status === "loading" ? "Tuning…" : playing ? "On air" : "Off air"}
        </p>
        <h2 className="mt-3 font-display text-[32px] leading-tight font-extrabold tracking-tight md:text-[44px]" aria-live="polite">
          {current.title}
        </h2>
        <p className="mt-3 text-body-md text-on-surface-variant">
          A loop from the full song. Turn the dial to switch stations; the music keeps playing while you look around the site.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => select(shown - 1)}
            aria-label="Previous station"
            className="glass-card grid size-11 place-items-center rounded-full transition-colors hover:text-primary"
          >
            <PrevIcon />
          </button>
          <button
            type="button"
            onClick={() => select(shown + 1)}
            aria-label="Next station"
            className="glass-card grid size-11 place-items-center rounded-full transition-colors hover:text-primary"
          >
            <NextIcon />
          </button>
          <a
            href={current.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-primary/50 px-5 py-3 font-button text-button text-primary transition-colors hover:bg-primary hover:text-on-primary"
          >
            Hear the full song on YouTube ↗
          </a>
        </div>

        <ol className="mt-10 grid gap-x-6 border-t border-white/10 sm:grid-cols-2">
          {STATIONS.map((s, i) => (
            <li key={s.id} className="border-b border-white/10">
              <button
                type="button"
                onClick={() => select(i)}
                aria-current={i === station && playing ? "true" : undefined}
                className="flex w-full items-center gap-4 py-3 text-left transition-colors hover:text-primary aria-[current=true]:text-primary"
              >
                <span className="w-6 font-code-label text-[13px] text-primary">{pad(i)}</span>
                <span className="flex-1 truncate">{s.title}</span>
                {i === station && playing && <span className="font-code-label text-[11px] uppercase">On air</span>}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
