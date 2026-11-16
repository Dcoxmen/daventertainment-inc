"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import gsap from "gsap";

export type Artwork = { title: string; src: string };

const TILE_SIZES = "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 300px";
const STAGE_SIZES = "(max-width: 768px) 92vw, 70vw";
const RADIUS = 14; // px, matches .art-frame

const pad = (n: number) => String(n).padStart(2, "0");
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const mouseHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/** Tilt, glare and parallax for a tile. x and y are the pointer position over it, 0 to 1. */
function setTilt(el: HTMLElement, x: number, y: number) {
  el.style.setProperty("--rx", `${(0.5 - y) * 10}deg`);
  el.style.setProperty("--ry", `${(x - 0.5) * 12}deg`);
  el.style.setProperty("--gx", `${x * 100}%`);
  el.style.setProperty("--gy", `${y * 100}%`);
  el.style.setProperty("--px", `${(0.5 - x) * 5}%`);
  el.style.setProperty("--py", `${(0.5 - y) * 5}%`);
}

export default function ArtGallery({ items }: { items: Artwork[] }) {
  const [active, setActive] = useState<number | null>(null);
  const frames = useRef<(HTMLSpanElement | null)[]>([]);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const gridRef = useRef<HTMLUListElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  // "View" cursor that trails the mouse over the artwork (mouse users only)
  useEffect(() => {
    const grid = gridRef.current;
    const cursor = cursorRef.current;
    if (!grid || !cursor || !mouseHover() || reducedMotion()) return;
    grid.dataset.cursor = "";
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0, shown = false;

    const tick = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.2 ? requestAnimationFrame(tick) : 0;
    };
    const update = (target: Element | null) => {
      const over = !!target?.closest(".art-tile");
      if (over && !shown) { x = tx; y = ty; } // appear at the pointer instead of flying in
      if (over !== shown) {
        shown = over;
        cursor.dataset.show = String(over);
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      update(e.pointerType === "mouse" ? (e.target as Element) : null);
    };
    const scroll = () => update(document.elementFromPoint(tx, ty));
    const leave = () => update(null);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", scroll);
      document.documentElement.removeEventListener("mouseleave", leave);
      cancelAnimationFrame(raf);
      delete grid.dataset.cursor;
    };
  }, []);

  const onTileMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    setTilt(e.currentTarget, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
  };
  const onTileLeave = (e: React.PointerEvent<HTMLButtonElement>) => setTilt(e.currentTarget, 0.5, 0.5);

  const open = (i: number) => {
    const button = buttons.current[i];
    if (button) setTilt(button, 0.5, 0.5); // fly out of the tile's resting position
    if (cursorRef.current) cursorRef.current.dataset.show = "false";
    setActive(i);
  };

  return (
    <>
      <ul
        ref={gridRef}
        className="art-grid grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6 md:gap-y-12 lg:grid-cols-4"
      >
        {items.map((art, i) => (
          <li key={art.src} className="art-reveal">
            <button
              ref={(el) => { buttons.current[i] = el; }}
              type="button"
              className="art-tile"
              aria-label={`View ${art.title}`}
              aria-haspopup="dialog"
              onClick={() => open(i)}
              onPointerMove={onTileMove}
              onPointerLeave={onTileLeave}
            >
              <span ref={(el) => { frames.current[i] = el; }} className="art-frame">
                <span className="art-zoom">
                  <Image src={art.src} alt={art.title} fill sizes={TILE_SIZES} className="art-img object-cover" />
                </span>
                <span className="art-shade" aria-hidden />
                <span className="art-glare" aria-hidden />
                <span className="art-curtain" aria-hidden />
              </span>
              <span className="mt-3 flex items-baseline gap-3">
                <span className="font-code-label text-[12px] text-primary/80">{pad(i + 1)}</span>
                <span className="art-title font-headline-md text-sm font-semibold md:text-base">{art.title}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div ref={cursorRef} className="art-cursor" data-show="false" aria-hidden>
        <span>View</span>
      </div>

      {active !== null &&
        createPortal(
          <Lightbox
            items={items}
            start={active}
            originOf={(i) => frames.current[i] ?? null}
            onClosed={(i) => {
              setActive(null);
              buttons.current[i]?.focus({ preventScroll: true });
            }}
          />,
          document.body
        )}
    </>
  );
}

type View = { index: number; from: number; dir: number };

function Lightbox({
  items,
  start,
  originOf,
  onClosed,
}: {
  items: Artwork[];
  start: number;
  originOf: (i: number) => HTMLElement | null;
  onClosed: (i: number) => void;
}) {
  const n = items.length;
  const wrap = (i: number) => (i + n) % n;
  const [view, setView] = useState<View>({ index: start, from: start, dir: 0 });

  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const layers = useRef(new Map<number, HTMLDivElement>());
  const openTl = useRef<gsap.core.Timeline | null>(null);
  const closing = useRef(false);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  // The current artwork, its neighbours (preloaded) and the one sliding out
  const shown = Array.from(new Set([wrap(view.index - 1), view.index, wrap(view.index + 1), view.from]));

  // Open: lock scroll, then fly the artwork from its tile to the stage
  useLayoutEffect(() => {
    const html = document.documentElement;
    const saved = [html.style.overflow, document.body.style.paddingRight];
    const scrollbar = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus({ preventScroll: true });

    const d = reducedMotion() ? 0 : 1;
    const stage = stageRef.current!;
    const origin = originOf(start);
    gsap.set(layers.current.get(start)!, { autoAlpha: 1, zIndex: 2 });

    const tl = gsap.timeline();
    tl.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 * d, ease: "power2.out" }, 0);
    if (origin && d) {
      const from = origin.getBoundingClientRect();
      const to = stage.getBoundingClientRect();
      const s = from.width / to.width;
      origin.style.visibility = "hidden";
      tl.fromTo(
        stage,
        { x: from.left - to.left, y: from.top - to.top, scale: s, transformOrigin: "0 0" },
        { x: 0, y: 0, scale: 1, duration: 1, ease: "expo.inOut", onComplete: () => { origin.style.visibility = ""; } },
        0
      );
      tl.fromTo(clipRef.current, { borderRadius: RADIUS / s }, { borderRadius: RADIUS, duration: 1, ease: "expo.inOut" }, 0);
    } else {
      tl.fromTo(stage, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0);
    }
    tl.fromTo(
      [topRef.current, bottomRef.current],
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.7 * d, ease: "power3.out", stagger: 0.08 },
      0.55 * d
    );
    openTl.current = tl;

    return () => {
      tl.kill();
      if (origin) origin.style.visibility = "";
      html.style.overflow = saved[0];
      document.body.style.paddingRight = saved[1];
    };
    // Runs once per opening; `start` and `originOf` are fixed for this lightbox
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Change artwork: the new one wipes in from the side it came from, the old one drifts away
  useLayoutEffect(() => {
    const { index, from, dir } = view;
    if (index === from) return;
    const d = reducedMotion() ? 0 : 1;
    const fwd = dir > 0;
    layers.current.forEach((el, i) => {
      gsap.killTweensOf([el, el.firstElementChild]);
      if (i !== index && i !== from) gsap.set(el, { autoAlpha: 0, zIndex: 0 });
    });
    const incoming = layers.current.get(index);
    const outgoing = layers.current.get(from);
    if (!incoming) return;

    gsap.set(incoming, { autoAlpha: 1, zIndex: 2 });
    gsap.fromTo(
      incoming,
      { clipPath: fwd ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9 * d, ease: "expo.inOut" }
    );
    gsap.fromTo(
      incoming.firstElementChild,
      { scale: 1.25, xPercent: fwd ? 14 : -14 },
      { scale: 1, xPercent: 0, duration: 1.1 * d, ease: "expo.out" }
    );
    if (outgoing) {
      gsap.set(outgoing, { zIndex: 1 });
      gsap.fromTo(
        outgoing.firstElementChild,
        { scale: 1, xPercent: 0 },
        {
          scale: 1.06,
          xPercent: fwd ? -20 : 20,
          duration: 0.9 * d,
          ease: "expo.inOut",
          onComplete: () => { gsap.set(outgoing, { autoAlpha: 0, zIndex: 0 }); },
        }
      );
    }
  }, [view]);

  const go = (step: number) => {
    if (closing.current) return;
    setView((v) => ({ index: wrap(v.index + step), from: v.index, dir: step }));
  };
  const jump = (to: number) => {
    if (closing.current) return;
    setView((v) => (to === v.index ? v : { index: to, from: v.index, dir: to > v.index ? 1 : -1 }));
  };

  // Close: fly back into the tile if it is on screen, otherwise fade out
  const close = () => {
    if (closing.current) return;
    closing.current = true;
    openTl.current?.kill();
    const d = reducedMotion() ? 0 : 1;
    const stage = stageRef.current!;
    const clip = clipRef.current!;
    const origin = originOf(view.index);
    clip.style.setProperty("--lrx", "0deg");
    clip.style.setProperty("--lry", "0deg");

    const tl = gsap.timeline({
      onComplete: () => {
        if (origin) origin.style.visibility = "";
        onClosed(view.index);
      },
    });
    tl.to([topRef.current, bottomRef.current], { opacity: 0, y: 12, duration: 0.3 * d, ease: "power2.in" }, 0);

    const r = origin?.getBoundingClientRect();
    if (origin && r && d && r.bottom > 0 && r.top < window.innerHeight) {
      // Measure the stage at rest, even if the opening flight was interrupted
      const now = { x: gsap.getProperty(stage, "x"), y: gsap.getProperty(stage, "y"), scale: gsap.getProperty(stage, "scale") };
      gsap.set(stage, { x: 0, y: 0, scale: 1 });
      const to = stage.getBoundingClientRect();
      gsap.set(stage, now);
      const s = r.width / to.width;
      origin.style.visibility = "hidden";
      tl.to(stage, { x: r.left - to.left, y: r.top - to.top, scale: s, transformOrigin: "0 0", duration: 0.85, ease: "expo.inOut" }, 0.05);
      tl.to(clip, { borderRadius: RADIUS / s, duration: 0.85, ease: "expo.inOut" }, 0.05);
      tl.to(backdropRef.current, { opacity: 0, duration: 0.7, ease: "power2.inOut" }, 0.15);
    } else {
      tl.to(stage, { opacity: 0, scale: 0.96, duration: 0.35 * d, ease: "power2.in" }, 0);
      tl.to(backdropRef.current, { opacity: 0, duration: 0.4 * d }, 0.1);
    }
  };

  // Keyboard: Esc closes, arrows browse, Tab stays inside the viewer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab") {
        const focusable = rootRef.current?.querySelectorAll<HTMLElement>("button:not([tabindex='-1'])");
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // The artwork leans toward the mouse
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || closing.current || !stageRef.current || !clipRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
    const y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
    clipRef.current.style.setProperty("--lry", `${x * 4}deg`);
    clipRef.current.style.setProperty("--lrx", `${-y * 4}deg`);
  };

  const art = items[view.index];

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${art.title}, artwork ${view.index + 1} of ${n}`}
      className="fixed inset-0 z-[60]"
      onPointerMove={onMove}
    >
      <div ref={backdropRef} className="absolute inset-0 bg-surface-container-lowest/90 opacity-0 backdrop-blur-2xl">
        <div key={view.index} className="lb-fade absolute inset-0 overflow-hidden" aria-hidden>
          <Image src={art.src} alt="" fill sizes="96px" className="scale-125 object-cover opacity-40 blur-3xl" />
        </div>
        <button
          type="button"
          tabIndex={-1}
          aria-hidden
          className="absolute inset-0 cursor-zoom-out"
          onClick={close}
        />
      </div>

      <div className="pointer-events-none relative flex h-full flex-col px-4 pt-4 pb-5 md:px-10 md:pt-6 md:pb-8">
        <div ref={topRef} className="flex items-center justify-between opacity-0">
          <p className="font-code-label text-[13px] text-on-surface-variant">
            <span className="inline-block overflow-hidden align-bottom">
              <span key={view.index} className="lb-rise inline-block text-primary">{pad(view.index + 1)}</span>
            </span>{" "}
            / {pad(n)}
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            className="lb-btn pointer-events-auto flex h-11 items-center gap-3 rounded-full border border-white/15 pr-2 pl-5 font-code-label text-[13px] uppercase"
          >
            Close
            <span className="relative block h-7 w-7" aria-hidden>
              <span className="absolute top-1/2 left-1/2 h-px w-3.5 -translate-x-1/2 rotate-45 bg-current" />
              <span className="absolute top-1/2 left-1/2 h-px w-3.5 -translate-x-1/2 -rotate-45 bg-current" />
            </span>
          </button>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center py-4 short:py-2">
          <div
            ref={stageRef}
            className="pointer-events-auto relative aspect-square w-[min(92vw,calc(100svh_-_210px))] touch-pan-y [perspective:1400px] short:w-[min(92vw,calc(100svh_-_130px))]"
            onPointerDown={(e) => { swipe.current = { x: e.clientX, y: e.clientY }; }}
            onPointerUp={(e) => {
              const s = swipe.current;
              swipe.current = null;
              if (!s) return;
              const dx = e.clientX - s.x;
              if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - s.y)) go(dx < 0 ? 1 : -1);
            }}
          >
            <div ref={clipRef} className="lb-clip absolute inset-0 overflow-hidden rounded-[14px] bg-surface-container-low">
              {shown.map((i) => (
                <div
                  key={items[i].src}
                  ref={(el) => {
                    if (el) layers.current.set(i, el);
                    return () => { layers.current.delete(i); };
                  }}
                  className="invisible absolute inset-0 overflow-hidden opacity-0"
                >
                  <div className="absolute inset-0">
                    {/* Same size as the tile, so it is already cached and shows during the flight */}
                    <Image src={items[i].src} alt="" fill sizes={TILE_SIZES} className="object-cover" />
                    <Image
                      src={items[i].src}
                      alt={i === view.index ? items[i].title : ""}
                      fill
                      sizes={STAGE_SIZES}
                      loading="eager"
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div ref={bottomRef} className="pointer-events-auto opacity-0">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="mb-1 font-code-label text-[12px] uppercase text-on-surface-variant short:hidden">
                Daventertainment Studio
              </p>
              <h2 className="overflow-hidden font-display text-xl font-bold tracking-tight md:text-3xl short:text-lg">
                <span key={view.index} className="lb-rise block text-balance">{art.title}</span>
              </h2>
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => go(-1)} aria-label="Previous artwork" className="lb-btn grid h-12 w-12 place-items-center rounded-full border border-white/15">
                <Arrow className="rotate-180" />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next artwork" className="lb-btn grid h-12 w-12 place-items-center rounded-full border border-white/15">
                <Arrow />
              </button>
            </div>
          </div>
          <div className="mt-4 flex gap-1 short:mt-1">
            {items.map((a, i) => (
              <button
                key={a.src}
                type="button"
                onClick={() => jump(i)}
                aria-label={`Show ${a.title}`}
                aria-current={i === view.index}
                className="group flex h-5 flex-1 items-center"
              >
                <span
                  className={`h-[2px] w-full origin-left transition-all duration-500 ${
                    i === view.index ? "scale-y-150 bg-primary" : "bg-white/20 group-hover:bg-white/50"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden>
      <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
