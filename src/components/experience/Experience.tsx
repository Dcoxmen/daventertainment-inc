"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { APPS, type App } from "@/content/apps";
import { ERAS, type Era } from "@/content/story";
import { usePlayer } from "@/components/player/PlayerProvider";
import type { BadgeState } from "./BadgeScene";
import { stateFor } from "./keyframes";
import CreatorButtons from "./CreatorButtons";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const BadgeScene = dynamic(() => import("./BadgeScene"), { ssr: false });

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeToMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// Checked once: each check opens a WebGL context, and browsers cap how many exist.
let webglSupported: boolean | undefined;

function canRunExperience() {
  if (window.matchMedia(REDUCED_MOTION).matches) return false;
  webglSupported ??= !!document.createElement("canvas").getContext("webgl2");
  return webglSupported;
}

type Section =
  | { kind: "intro" }
  | { kind: "era"; era: Era; number: number }
  | { kind: "app"; app: App; index: number }
  | { kind: "contact" };

const SECTIONS: Section[] = [
  { kind: "intro" },
  ...ERAS.map((era, i) => ({ kind: "era" as const, era, number: i + 1 })),
  ...APPS.map((app, index) => ({ kind: "app" as const, app, index })),
  { kind: "contact" },
];

// Section heights in viewport units. The badge timeline uses the same scale,
// and each change finishes as its section reaches the top of the screen.
const HEIGHT_VH: Record<Section["kind"], number> = { intro: 100, era: 150, app: 120, contact: 100 };
const TRANSITION_VH = 85;

const FIRST_APP = SECTIONS.findIndex((section) => section.kind === "app");
const RAIL = [
  ...ERAS.map((era, i) => ({ label: era.year, section: i + 1 })),
  { label: "Work", section: FIRST_APP },
];

function stateKey(section: Section) {
  if (section.kind === "era") return section.era.id;
  if (section.kind === "app") return "work";
  return section.kind;
}

function marker(section: Section) {
  if (section.kind === "era") return `${section.era.year} · ${section.era.title}`;
  if (section.kind === "app") return "The Work";
  return section.kind === "intro" ? "Welcome" : "Contact";
}

const ACCENTS: Record<Era["accent"], string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
};

const BODY = "mt-4 text-body-md text-on-surface md:mt-5 md:text-body-lg";
const LABEL = "font-code-label text-code-label uppercase";

function EraCopy({ era, number }: { era: Era; number: number }) {
  return (
    <>
      <p className={`${LABEL} ${ACCENTS[era.accent]}`}>
        Chapter {String(number).padStart(2, "0")} · {era.title}
      </p>
      <h2 className="mt-2 font-display text-[72px] leading-none font-extrabold tracking-tight md:text-[140px]">
        {era.year}
      </h2>
      <p className={BODY}>{era.body}</p>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Skills">
        {era.skills.map((skill) => (
          <li
            key={skill}
            className="rounded-md border border-white/15 bg-background/50 px-2 py-0.5 font-code-label text-[12px] text-on-surface-variant md:text-[13px]"
          >
            {skill}
          </li>
        ))}
      </ul>
      {era.links && <CreatorButtons />}
      {era.links && (
        <nav aria-label="Creative work" className="mt-5 hidden flex-wrap gap-3 md:flex">
          {era.links.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg border border-outline px-4 py-2.5 font-button text-sm font-semibold hover:border-primary hover:text-primary"
            >
              {label} →
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}

function AppCopy({ app, index }: { app: App; index: number }) {
  return (
    <>
      <p className={`${LABEL} text-primary`}>
        The Work · {index + 1}/{APPS.length}
      </p>
      {app.client && <p className="mt-3 font-code-label text-[13px] text-secondary">{app.client}</p>}
      <h2 className="mt-1 font-display text-[34px] leading-[1.08] font-extrabold tracking-tight md:text-[52px]">
        {app.title}
      </h2>
      <p className={BODY}>{app.description}</p>
      {app.metric && (
        <p className="mt-4 font-headline-md text-headline-md">
          <span className="text-primary">{app.metric.value}</span> {app.metric.label}
        </p>
      )}
      {app.nda && (
        <p className="mt-4 font-code-label text-[13px] text-on-surface-variant">
          Under NDA · Details on request
        </p>
      )}
      <Link
        href={`/work/${app.slug}`}
        className="mt-5 inline-block font-button text-button text-primary hover:underline"
      >
        View project →
      </Link>
    </>
  );
}

export default function Experience() {
  const root = useRef<HTMLDivElement>(null);
  const lenis = useRef<Lenis | null>(null);
  const badge = useRef<BadgeState>(stateFor("intro", true));
  const [sceneReady, setSceneReady] = useState(false);
  const [chapter, setChapter] = useState(0);
  const animated = useSyncExternalStore(subscribeToMotion, canRunExperience, () => false);
  // The site-wide radio: muffled at the top of the story, opening up as you scroll.
  const sound = usePlayer();
  const setSoundProgress = sound.setFilter;
  useEffect(() => () => setSoundProgress(null), [setSoundProgress]);

  useGSAP(
    () => {
      if (!animated) return;

      const smooth = new Lenis();
      lenis.current = smooth;
      const tick = (time: number) => smooth.raf(time * 1000);
      smooth.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const media = gsap.matchMedia();
      media.add({ desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" }, (context) => {
        const desktop = !!context.conditions?.desktop;
        Object.assign(badge.current, stateFor("intro", desktop));

        const story = gsap.timeline({
          defaults: { ease: "power1.inOut", duration: TRANSITION_VH },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: ({ progress }) => setSoundProgress(progress),
          },
        });
        let top = 0;
        SECTIONS.forEach((section, index) => {
          const shot = section.kind === "app" ? section.index : 0;
          if (index > 0) story.to(badge.current, stateFor(stateKey(section), desktop, shot), top - TRANSITION_VH);
          top += HEIGHT_VH[section.kind];
        });

        gsap.utils.toArray<HTMLElement>("[data-copy]").forEach((copy) => {
          const section = copy.closest("[data-chapter]");
          if (desktop) {
            gsap.fromTo(
              copy,
              { autoAlpha: 0, y: 60 },
              {
                autoAlpha: 1,
                y: 0,
                ease: "none",
                scrollTrigger: { trigger: section, start: "top 70%", end: "top 20%", scrub: true },
              }
            );
          } else {
            // Phones: the 3D objects fill the lower half, so the text must not slide up
            // through them. The y offset cancels the scroll, so the text fades in already
            // in its final place at the top, after the previous chapter's text has left.
            gsap.fromTo(
              copy,
              { autoAlpha: 0, y: () => -0.4 * window.innerHeight },
              {
                autoAlpha: 1,
                y: 0,
                ease: "none",
                scrollTrigger: { trigger: section, start: "top 40%", end: "top top", scrub: true, invalidateOnRefresh: true },
              }
            );
          }
          fadeOut(copy, section);
        });

        return () => story.scrollTrigger?.kill();
      });

      function fadeOut(copy: HTMLElement, section: Element | null) {
        gsap.fromTo(
          copy,
          { autoAlpha: 1, y: 0 },
          {
            autoAlpha: 0,
            y: -60,
            ease: "none",
            immediateRender: false,
            scrollTrigger: { trigger: section, start: "bottom 75%", end: "bottom 40%", scrub: true },
          }
        );
      }

      gsap.utils.toArray<HTMLElement>("[data-chapter]").forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onToggle: ({ isActive }) => {
            if (isActive) setChapter(Number(section.dataset.chapter));
          },
        });
      });

      return () => {
        media.revert();
        gsap.ticker.remove(tick);
        smooth.destroy();
        lenis.current = null;
      };
    },
    { scope: root, dependencies: [animated, setSoundProgress] }
  );

  function jumpTo(index: number) {
    const target = root.current?.querySelector<HTMLElement>(`[data-chapter="${index}"]`);
    if (target) lenis.current?.scrollTo(target, { duration: 2 });
  }

  const railActive = RAIL.findLastIndex(({ section }) => section <= chapter && chapter > 0);
  const soundLabel = { off: "Listen", loading: "Tuning…", on: "Sound on" }[sound.status];

  return (
    <div ref={root} className="relative text-on-surface">
      {animated && (
        <div
          aria-hidden
          className={`fixed inset-0 transition-opacity duration-1000 ${sceneReady ? "opacity-100" : "opacity-0"}`}
        >
          <BadgeScene state={badge} onReady={() => setSceneReady(true)} />
        </div>
      )}

      <main className="relative z-10">
        {SECTIONS.map((section, index) => {
          if (section.kind === "intro") {
            return (
              <section
                key="intro"
                data-chapter={index}
                style={animated ? { height: `${HEIGHT_VH.intro}vh` } : undefined}
                className="flex min-h-svh items-start px-4 pt-28 md:items-center md:px-12 md:pt-0"
              >
                <div className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-2">
                  <div className="max-w-xl">
                    <p className="mb-5 font-code-label text-[13px] uppercase text-primary md:text-code-label">
                      David Cox · Daventertainment Inc
                    </p>
                    <h1 className="font-display text-[44px] leading-[1.05] font-extrabold tracking-tight md:text-[76px]">
                      Code that plays to the room.
                    </h1>
                    <p className="mt-5 text-body-md text-on-surface-variant md:mt-6 md:text-body-lg">
                      Full stack engineer and AI integration specialist with over 20 years of experience
                      building SaaS platforms, Next.js applications, and AI-powered systems.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
                      <Link
                        href="/work"
                        className="rounded-lg bg-primary px-6 py-3.5 font-button text-button text-on-primary transition-opacity hover:opacity-85"
                      >
                        See Work
                      </Link>
                      <Link
                        href="/contact"
                        className="rounded-lg border border-outline px-6 py-3.5 font-button text-button text-on-surface transition-colors hover:border-primary hover:text-primary"
                      >
                        Hire Me
                      </Link>
                    </div>
                  </div>
                  <Image
                    src="/badge-face.webp"
                    alt=""
                    width={520}
                    height={520}
                    priority
                    className={`mx-auto w-[62vw] max-w-[520px] transition-opacity duration-1000 md:w-full ${
                      sceneReady ? "opacity-0" : ""
                    }`}
                  />
                </div>
              </section>
            );
          }

          const copy =
            section.kind === "era" ? (
              <EraCopy era={section.era} number={section.number} />
            ) : section.kind === "app" ? (
              <AppCopy app={section.app} index={section.index} />
            ) : (
              <>
                <p className={`${LABEL} text-primary`}>Contact</p>
                <h2 className="mt-2 font-display text-[44px] leading-[1.05] font-extrabold tracking-tight md:text-[76px]">
                  Let&apos;s build something.
                </h2>
                <p className={BODY}>
                  Full stack engineering, AI integration, and creative work. Tell me about the role or
                  project.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="rounded-lg bg-primary px-6 py-3.5 font-button text-button text-on-primary hover:opacity-85"
                  >
                    Hire Me
                  </Link>
                  <Link
                    href="/work"
                    className="rounded-lg border border-outline px-6 py-3.5 font-button text-button hover:border-primary hover:text-primary"
                  >
                    See All Work
                  </Link>
                </div>
              </>
            );

          return (
            <section
              key={index}
              data-chapter={index}
              style={animated ? { height: `${HEIGHT_VH[section.kind]}vh` } : undefined}
              className={animated ? "relative" : "border-l border-white/10 px-4 py-14 md:ml-12 md:px-10"}
            >
              <div
                className={
                  animated
                    ? `sticky top-0 flex h-svh items-start px-4 pt-24 md:items-center md:px-12 md:pt-0 ${
                        section.kind === "era" && section.era.id === "harbor" ? "md:pb-56" : ""
                      }`
                    : ""
                }
              >
                <div
                  data-copy={animated ? "" : undefined}
                  className="max-w-md [text-shadow:0_2px_16px_rgba(3,7,18,0.95)] lg:max-w-lg"
                >
                  {copy}
                </div>
              </div>
            </section>
          );
        })}
      </main>

      {animated && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 whitespace-nowrap px-4 pb-5 font-code-label text-[13px] md:px-12">
          <p className="hidden text-on-surface-variant md:block">{marker(SECTIONS[chapter])}</p>

          <nav aria-label="Story timeline" className="pointer-events-auto hidden gap-1 lg:flex">
            {RAIL.map(({ label, section }, i) => (
              <button
                key={label}
                type="button"
                onClick={() => jumpTo(section)}
                aria-current={i === railActive ? "step" : undefined}
                className="rounded px-2 py-1 text-on-surface-variant transition-colors hover:text-primary aria-[current=step]:bg-primary/15 aria-[current=step]:text-primary"
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="pointer-events-auto flex items-center gap-4 md:gap-6">
            <button
              type="button"
              onClick={sound.toggle}
              aria-pressed={sound.status !== "off"}
              className="text-on-surface transition-colors hover:text-primary aria-pressed:text-primary"
            >
              ♪ {soundLabel}
            </button>
            <Link href="/work" className="text-on-surface hover:text-primary">
              Skip to work →
            </Link>
          </div>
        </div>
      )}

      {!animated && (
        <div className="px-4 pb-10 md:px-12">
          <Link href="/work" className="font-code-label text-[13px] text-on-surface hover:text-primary">
            Skip to work →
          </Link>
        </div>
      )}
    </div>
  );
}
