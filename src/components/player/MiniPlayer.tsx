"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { STATIONS } from "@/content/stations";
import { usePlayer } from "./PlayerProvider";
import { NextIcon, PauseIcon, PlayIcon } from "./icons";

// Small floating controls on the plain pages once the radio has been started.
// Home has its own Listen button and /music has the dial, so it hides there.
export default function MiniPlayer() {
  const { status, station, started, toggle, tune } = usePlayer();
  const pathname = usePathname();
  if (!started || pathname === "/" || pathname === "/music") return null;

  const playing = status !== "off";
  return (
    <div className="fixed right-4 bottom-4 z-40 flex items-center gap-3 rounded-full border border-white/10 bg-surface-container/95 py-2 pr-2 pl-4 backdrop-blur-md font-code-label text-[13px] shadow-lg shadow-black/40 md:right-8 md:bottom-8">
      <Link href="/music" className="max-w-[44vw] truncate text-on-surface hover:text-primary md:max-w-[240px]">
        <span className="text-primary">♪</span> {status === "loading" ? "Tuning…" : STATIONS[station].title}
      </Link>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause radio" : "Play radio"}
        className="grid size-9 place-items-center rounded-full bg-primary text-on-primary transition-transform hover:scale-105"
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
      <button
        type="button"
        onClick={() => tune(station + 1)}
        aria-label="Next station"
        className="grid size-9 place-items-center rounded-full text-on-surface transition-colors hover:text-primary"
      >
        <NextIcon />
      </button>
    </div>
  );
}
