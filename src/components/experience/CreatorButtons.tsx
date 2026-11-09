"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { CREATOR_ICONS, drawCreatorIcon, type CreatorIcon } from "./creatorIcons";

function IconButton({ icon, index }: { icon: CreatorIcon; index: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvas.current) drawCreatorIcon(canvas.current, icon);
  }, [icon]);

  return (
    <Link
      href={icon.href}
      className="flex flex-col items-center gap-2 font-code-label text-[13px] text-on-surface"
    >
      <span
        className="block h-16 w-16 overflow-hidden rounded-full border-2 border-primary shadow-[0_6px_20px_rgba(0,0,0,0.45)] motion-safe:animate-[bob_3.2s_ease-in-out_infinite] active:scale-95"
        style={{ animationDelay: `${index * -0.8}s` }}
      >
        <canvas ref={canvas} width={128} height={128} aria-hidden className="h-full w-full" />
      </span>
      {icon.label}
    </Link>
  );
}

// Phone view of the "Now" chapter: the floating badges become tappable buttons.
export default function CreatorButtons() {
  return (
    <nav aria-label="Creative work" className="mt-6 grid grid-cols-4 gap-2 md:hidden">
      {CREATOR_ICONS.map((icon, index) => (
        <IconButton key={icon.href} icon={icon} index={index} />
      ))}
    </nav>
  );
}
