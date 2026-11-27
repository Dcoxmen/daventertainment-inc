"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { preconnect } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import type { Video } from "@/content/catalog";
import { claim, release, subscribe, videoPlaying } from "@/components/player/mediaFocus";
import { PauseIcon, PlayIcon } from "@/components/player/icons";

const SIZES = "(max-width: 768px) 100vw, 600px";

// The parts of YouTube's IFrame Player API used here.
// States: 0 ended, 1 playing, 2 paused.
type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  destroy: () => void;
  getIframe: () => HTMLIFrameElement;
};
type YTApi = {
  Player: new (
    el: HTMLElement,
    options: {
      host: string;
      videoId: string;
      width: string;
      height: string;
      playerVars: Record<string, number>;
      events: {
        onReady: (e: { target: YTPlayer }) => void;
        onStateChange: (e: { data: number }) => void;
      };
    },
  ) => YTPlayer;
};
type YTWindow = Window & { YT?: YTApi; onYouTubeIframeAPIReady?: () => void };

let youTubeApi: Promise<YTApi> | null = null;

/** Loads YouTube's player script once, on the first play click. */
function loadYouTubeApi() {
  youTubeApi ??= new Promise<YTApi>((resolve, reject) => {
    const w = window as YTWindow;
    if (w.YT?.Player) return resolve(w.YT);
    const previous = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(w.YT!);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.onerror = () => {
      youTubeApi = null; // let a later click try again
      reject(new Error("YouTube player script failed to load"));
    };
    document.head.append(script);
  });
  return youTubeApi;
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/**
 * Short silent clip: plays muted on a loop while on screen and pauses when
 * scrolled away. Nothing downloads until it first comes into view. Visitors
 * with reduced motion or data saver on get the poster and press play themselves.
 * It steps aside while another video plays and comes back when that one stops.
 * Being silent, it leaves the radio alone.
 */
function ClipPlayer({ video, src }: { video: Video; src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const id = `clip-${video.slug}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const saveData = (navigator as { connection?: { saveData?: boolean } }).connection?.saveData;
    const autoplay = !saveData && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let inView = false;
    const tryPlay = () => {
      if (autoplay && inView && !userPaused.current && !videoPlaying(id)) el.play().catch(() => {});
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) tryPlay();
        else el.pause();
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    const unsubscribe = subscribe(() => (videoPlaying(id) ? el.pause() : tryPlay()));
    return () => {
      observer.disconnect();
      unsubscribe();
      release(id);
    };
  }, [id]);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      userPaused.current = false;
      claim({ id, video: true, stop: () => el.pause() }); // stops any other video
      el.play().catch(() => {});
    } else {
      userPaused.current = true;
      el.pause();
    }
  };

  return (
    <>
      <video
        ref={ref}
        src={src}
        poster={video.poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={video.title}
        onPlay={() => setPlaying(true)}
        onPause={() => {
          setPlaying(false);
          release(id);
        }}
        onClick={toggle}
        className="absolute inset-0 h-full w-full cursor-pointer object-cover"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute right-3 bottom-3 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition-colors hover:border-primary hover:text-primary"
      >
        {playing ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
      </button>
    </>
  );
}

/**
 * YouTube video behind a facade: the local poster and a play button. The
 * YouTube player (about 1 MB of script plus cookies) loads only on click.
 * It uses YouTube's player API so play, pause and end inside YouTube's own
 * controls follow the site's media rules too.
 */
function YouTubePlayer({ video, id }: { video: Video; id: string }) {
  const [on, setOn] = useState(false);
  const [fallback, setFallback] = useState(false);
  const holder = useRef<HTMLDivElement>(null);
  const yt = useRef<YTPlayer | null>(null);
  const wanted = useRef(false); // false once something else has taken over
  const mediaId = `youtube-${id}`;

  const media = useCallback(
    () => ({
      id: mediaId,
      sound: true,
      video: true,
      stop: () => {
        wanted.current = false;
        yt.current?.pauseVideo();
      },
    }),
    [mediaId],
  );

  useEffect(() => {
    if (!on || fallback) return;
    const box = holder.current;
    if (!box) return;
    let cancelled = false;
    loadYouTubeApi()
      .then((YT) => {
        if (cancelled) return;
        const target = document.createElement("div"); // YouTube swaps this for its iframe
        box.append(target);
        yt.current = new YT.Player(target, {
          host: "https://www.youtube-nocookie.com",
          videoId: id,
          width: "100%",
          height: "100%",
          playerVars: { rel: 0, playsinline: 1 },
          events: {
            onReady: (e) => {
              e.target.getIframe().title = video.title;
              if (wanted.current) e.target.playVideo();
            },
            onStateChange: (e) => {
              if (e.data === 1) {
                wanted.current = true;
                claim(media()); // playing: stop the radio and other videos
              } else if (e.data === 2) release(mediaId);
              else if (e.data === 0) release(mediaId, { finished: true }); // ended: radio returns
            },
          },
        });
      })
      .catch(() => !cancelled && setFallback(true));
    return () => {
      cancelled = true;
      release(mediaId);
      yt.current?.destroy();
      yt.current = null;
      box.replaceChildren();
    };
  }, [on, fallback, id, mediaId, media, video.title]);

  const warm = () => {
    preconnect("https://www.youtube-nocookie.com");
    preconnect("https://www.youtube.com");
  };

  const start = () => {
    wanted.current = true;
    claim(media());
    setOn(true);
  };

  if (fallback) {
    // YouTube's API script failed to load: plain embed, without the media rules.
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
        title={video.title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    );
  }

  if (on) {
    return (
      <>
        <Image src={video.poster} alt="" fill sizes={SIZES} className="object-cover opacity-60" />
        <div ref={holder} className="absolute inset-0 [&_iframe]:h-full [&_iframe]:w-full" />
      </>
    );
  }

  return (
    <button
      type="button"
      onClick={start}
      onPointerEnter={warm}
      onFocus={warm}
      aria-label={`Play video: ${video.title} (${clock(video.seconds)})`}
      className="group/play absolute inset-0 cursor-pointer"
    >
      <Image
        src={video.poster}
        alt=""
        fill
        sizes={SIZES}
        className="object-cover transition-transform duration-700 group-hover/play:scale-[1.03]"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <span className="absolute top-1/2 left-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-on-primary shadow-[0_0_40px_rgba(212,176,106,0.45)] transition-transform duration-300 group-hover/play:scale-110 group-focus-visible/play:scale-110">
        <PlayIcon className="ml-1 h-6 w-6" />
      </span>
      <span className="absolute right-3 bottom-3 rounded-md bg-black/70 px-2 py-0.5 font-code-label text-[12px] text-white">
        {clock(video.seconds)}
      </span>
      <span className="absolute bottom-3 left-3 font-code-label text-[12px] text-white/80">
        Plays on YouTube
      </span>
    </button>
  );
}

export default function VideoCard({ video }: { video: Video }) {
  const { source, link } = video;
  const external = link?.href.startsWith("http");

  return (
    <article className="glass-card overflow-hidden rounded-xl">
      <div className="relative aspect-video bg-surface-container-low">
        {source.type === "file" ? (
          <ClipPlayer video={video} src={source.src} />
        ) : (
          <YouTubePlayer video={video} id={source.id} />
        )}
      </div>
      <div className="p-6">
        <p className="font-code-label text-[13px] uppercase text-primary">
          {video.kind} · {clock(video.seconds)}
        </p>
        <h2 className="mt-2 font-headline-md text-headline-md">{video.title}</h2>
        <p className="mt-3 text-body-md text-on-surface-variant">{video.description}</p>
        {link &&
          (external ? (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block font-code-label text-[13px] text-secondary hover:text-primary"
            >
              {link.label} ↗
            </a>
          ) : (
            <Link
              href={link.href}
              className="mt-4 inline-block font-code-label text-[13px] text-secondary hover:text-primary"
            >
              {link.label} →
            </Link>
          ))}
      </div>
    </article>
  );
}
