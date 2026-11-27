// One rule for everything on the site that plays (radio, videos, the avatar call):
// sound never overlaps sound, and video never overlaps video. Starting something
// stops whatever it would clash with. When it finishes (not when it's paused), the
// things it stopped pick up again, so the radio returns after a video ends.

export type Media = {
  id: string;
  sound?: boolean;
  video?: boolean;
  stop: () => void;
  /** Start again after the media that interrupted this one finishes. */
  resume?: () => void;
};

const active = new Map<string, Media>();
const interrupted = new Map<string, Media[]>(); // id -> the media it stopped
const listeners = new Set<() => void>();

const clash = (a: Media, b: Media) => a.id !== b.id && ((a.sound && b.sound) || (a.video && b.video));

/** Call when media starts playing. Stops anything it clashes with. */
export function claim(media: Media) {
  // Started again by the visitor, so nothing should resume it later.
  for (const [id, list] of interrupted) interrupted.set(id, list.filter((m) => m.id !== media.id));

  const stopped = interrupted.get(media.id) ?? [];
  for (const other of [...active.values()]) {
    if (!clash(media, other)) continue;
    active.delete(other.id);
    other.stop();
    if (other.resume && !stopped.some((m) => m.id === other.id)) stopped.push(other);
  }
  interrupted.set(media.id, stopped);
  active.set(media.id, media);
  listeners.forEach((fn) => fn());
}

/** Call when media pauses or stops. Pass finished: true when it reached its end. */
export function release(id: string, { finished = false } = {}) {
  const changed = active.delete(id);
  if (finished) {
    const list = interrupted.get(id) ?? [];
    interrupted.delete(id);
    for (const media of list) {
      if (![...active.values()].some((other) => clash(media, other))) media.resume?.();
    }
  }
  if (changed) listeners.forEach((fn) => fn());
}

/** True when a video other than `exceptId` is playing. */
export const videoPlaying = (exceptId?: string) =>
  [...active.values()].some((m) => m.video && m.id !== exceptId);

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
