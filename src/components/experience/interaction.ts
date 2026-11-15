// Live input shared by the 3D story objects: pointer, taps, scroll speed and cursor.
// InputTracker (BadgeScene.tsx) updates it once per frame; every object reads it.

// The side-by-side layout: 768px and wider, or any phone held sideways (short screens).
// Must match the `wide` variant in globals.css.
export const WIDE_QUERY = "(min-width: 768px), (orientation: landscape) and (max-height: 500px)";
// Its exact opposite, for gsap.matchMedia (which needs a query for each branch).
export const NARROW_QUERY = "(max-width: 767px) and (orientation: portrait), (max-width: 767px) and (min-height: 501px)";
// A mouse or trackpad: hover effects and drag to spin. Touch gets tap effects only.
export const HOVER_QUERY = "(hover: hover) and (pointer: fine)";

export const input = {
  /** Pointer position in world units on the badge plane. */
  x: 0,
  y: 0,
  /** 0–1: how strongly objects react to the pointer. Held at 1 while a mouse is over the page; a fading pulse after a tap. */
  strength: 0,
  /** Scroll speed in screen heights per second, smoothed. Positive when scrolling down. */
  velocity: 0,
  /** Cursor each object wants; the tracker shows the first one set. */
  cursor: {} as Record<string, string>,
  /** Client-side navigation, set by Experience so the radio keeps playing. */
  navigate: (href: string) => window.location.assign(href),
};

// Clicks on links, buttons and form fields belong to them, not to the 3D objects behind.
export function isControl(target: EventTarget | null) {
  return target instanceof Element && !!target.closest("a, button, input, textarea, select, label");
}

// Pixels per world unit at the badge plane, and a world point in screen pixels.
export function toScreen(worldX: number, worldY: number, viewport: { width: number; height: number }) {
  const scale = window.innerWidth / viewport.width;
  return {
    x: window.innerWidth / 2 + worldX * scale,
    y: window.innerHeight / 2 - worldY * scale,
    scale,
  };
}
