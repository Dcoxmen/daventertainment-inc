import type { BadgeState } from "./BadgeScene";

const TAU = Math.PI * 2;

type Layout = Pick<BadgeState, "x" | "y" | "size">;

// Where the badge sits on screen. Text is on the left on desktop and on top on phones.
const LAYOUTS: Record<string, { desktop: Layout; mobile: Layout }> = {
  hero: { desktop: { x: 0.25, y: -0.02, size: 0.66 }, mobile: { x: 0, y: -0.27, size: 0.6 } },
  big: { desktop: { x: 0.24, y: 0, size: 0.8 }, mobile: { x: 0, y: -0.2, size: 0.9 } },
  harbor: { desktop: { x: 0.2, y: -0.16, size: 0.74 }, mobile: { x: 0, y: -0.24, size: 0.92 } },
  side: { desktop: { x: 0.24, y: 0, size: 0.7 }, mobile: { x: 0, y: -0.27, size: 0.62 } },
  hub: { desktop: { x: 0.24, y: 0, size: 0.16 }, mobile: { x: 0, y: -0.27, size: 0.2 } },
  frame: { desktop: { x: 0.24, y: 0, size: 0.78 }, mobile: { x: 0, y: -0.27, size: 0.66 } },
};

const BASE: Omit<BadgeState, keyof Layout> = {
  code: 0,
  vinyl: 0,
  coin: 0,
  seal: 0,
  work: 0,
  shot: 0,
  label: 1,
  harbor: 0,
  windows: 0,
  network: 0,
  lens: 0,
  trio: 0,
  tiltX: 0,
  tiltY: 0,
};

// From 2010 on, the badge is a coin that has flipped once (tiltY = TAU).
const STATES: Record<string, [string, Partial<BadgeState>]> = {
  intro: ["hero", {}],
  code: ["big", { code: 1, label: 0.345 }],
  harbor: ["harbor", { code: 1, vinyl: 1, harbor: 1, label: 0.345, tiltX: -1.12 }],
  contracts: ["side", { code: 1, vinyl: 1, label: 0.345, windows: 1, size: 0 }],
  label: ["side", { coin: 1, label: 0.5, tiltY: TAU }],
  seal: ["side", { coin: 1, seal: 1, label: 0.62, tiltY: TAU }],
  scale: ["hub", { coin: 1, seal: 1, label: 0.62, network: 1, tiltY: TAU }],
  intelligence: ["hub", { coin: 1, seal: 1, label: 0.62, lens: 1, tiltY: TAU, size: 0.13 }],
  creator: ["side", { coin: 1, seal: 1, label: 0.62, trio: 1, tiltY: TAU, size: 0 }],
  work: ["frame", { coin: 1, seal: 1, work: 1, label: 0, tiltY: TAU }],
  contact: ["hero", { coin: 1, seal: 1, tiltY: TAU }],
};

export function stateFor(key: string, desktop: boolean, shot = 0): BadgeState {
  const [layout, overrides] = STATES[key];
  return {
    ...BASE,
    ...LAYOUTS[layout][desktop ? "desktop" : "mobile"],
    ...overrides,
    shot,
  };
}
