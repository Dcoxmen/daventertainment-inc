"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { APPS, type App } from "@/content/apps";
import { ERAS, type Era } from "@/content/story";
import { usePlayer } from "@/components/player/PlayerProvider";
import type { BadgeState } from "./BadgeScene";
import { stateFor } from "./keyframes";
import { NARROW_QUERY, WIDE_QUERY, input } from "./interaction";
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

// Where each rail stop falls on the progress bar (story progress runs from the
// top of the page to one screen before the end).
const SECTION_TOPS = SECTIONS.map((_, i) => SECTIONS.slice(0, i).reduce((sum, s) => sum + HEIGHT_VH[s.kind], 0));
const SCROLL_VH = SECTION_TOPS[SECTIONS.length - 1] + HEIGHT_VH.contact - 100;
const TICKS = RAIL.map(({ section }) => SECTION_TOPS[section] / SCROLL_VH);

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

// Phones have room for only the year.
function shortMarker(section: Section) {
  if (section.kind === "era") return section.era.year;
  return section.kind === "app" ? "Work" : "";
}

const ACCENTS: Record<Era["accent"], string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
};

const BODY = "mt-4 text-body-md text-on-surface wide:mt-5 wide:text-body-lg short:mt-2 short:text-[14px] short:leading-normal";
const LABEL = "font-code-label text-code-label uppercase";

// The year rolls over from the previous chapter's year, digit by digit, like an odometer.
// Each column clips one character; the previous character (drawn by CSS, so it never shows
// up in the page text) sits above it and scrolls away.
function RollingYear({ year, previous, animated }: { year: string; previous: string; animated: boolean }) {
  if (!animated) return year;
  return (
    <>
      <span className="sr-only">{year}</span>
      <span aria-hidden className="inline-flex">
        {[...year].map((char, i) => (
          <span key={i} className="inline-block h-[1em] overflow-hidden">
            <span
              data-roll
              data-prev={previous[i] ?? ""}
              className="relative block before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:content-[attr(data-prev)]"
            >
              {char}
            </span>
          </span>
        ))}
      </span>
    </>
  );
}

function EraCopy({ era, number, animated }: { era: Era; number: number; animated: boolean }) {
  return (
    <>
      <p className={`${LABEL} ${ACCENTS[era.accent]}`}>
        Chapter {String(number).padStart(2, "0")} · {era.title}
      </p>
      <h2 className="mt-2 font-display text-[72px] leading-none font-extrabold tracking-tight wide:text-[140px] short:mt-1 short:text-[52px] compact:text-[56px] tiny:text-[40px]">
        <RollingYear year={era.year} previous={ERAS[number - 2]?.year ?? ""} animated={animated} />
      </h2>
      <p className="mt-3 font-display text-[19px] leading-snug font-semibold wide:mt-4 wide:text-[25px] short:mt-1 short:text-[16px] compact:mt-2 compact:text-[17px] tiny:text-[14px]">
        {era.hook}
      </p>
      <span
        data-rule
        aria-hidden
        className={`mt-3 block h-[2px] w-14 origin-left rounded-full bg-current wide:mt-4 short:mt-2 compact:mt-2 tiny:hidden ${ACCENTS[era.accent]}`}
      />
      <p className="mt-3 text-body-md text-on-surface wide:mt-4 wide:text-body-lg short:mt-2 short:text-[14px] short:leading-normal compact:mt-2 compact:text-[15px] compact:leading-[1.45] tiny:text-[13px] tiny:leading-snug">
        {era.body}
      </p>
      <ul className="mt-4 flex flex-wrap gap-2 short:hidden compact:hidden" aria-label="Skills">
        {era.skills.map((skill) => (
          <li
            key={skill}
            data-skill
            className="rounded-md border border-white/15 bg-background/50 px-2 py-0.5 font-code-label text-[12px] text-on-surface-variant wide:text-[13px]"
          >
            {skill}
          </li>
        ))}
      </ul>
      {era.links && <CreatorButtons />}
      {era.links && (
        <nav aria-label="Creative work" className="mt-5 hidden flex-wrap gap-3 wide:flex short:mt-3 short:gap-2 tiny:gap-1.5">
          {era.links.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-lg border border-outline px-4 py-2.5 font-button text-sm font-semibold transition-colors hover:border-primary hover:text-primary short:px-3 short:py-1.5 tiny:px-2.5 tiny:text-[13px]"
            >
              {label}{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
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
      {app.client && <p className="mt-3 font-code-label text-[13px] text-secondary short:mt-1">{app.client}</p>}
      <h2 className="mt-1 font-display text-[34px] leading-[1.08] font-extrabold tracking-tight wide:text-[52px] short:text-[26px]">
        {app.title}
      </h2>
      <p className={BODY}>{app.description}</p>
      {app.metric && (
        <p className="mt-4 font-headline-md text-headline-md short:mt-2 short:text-[18px]">
          <span data-count className="text-primary tabular-nums">
            {app.metric.value}
          </span>{" "}
          {app.metric.label}
        </p>
      )}
      {app.nda && (
        <p className="mt-4 font-code-label text-[13px] text-on-surface-variant">
          Under NDA · Details on request
        </p>
      )}
      <Link
        href={`/work/${app.slug}`}
        className="group mt-5 inline-block font-button text-button text-primary hover:underline short:mt-2"
      >
        View project <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
      </Link>
    </>
  );
}

// Builds the entrance for one chapter's text: the block fades in, then the year rolls,
// the rule draws, the skill tags pop in one by one and any metric counts up.
// Scrubbed by scroll, so it plays backwards when you scroll back.
function entrance(copy: HTMLElement, from: gsap.TweenVars, trigger: ScrollTrigger.Vars) {
  const enter = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { ...trigger, scrub: true } });
  enter.fromTo(copy, { autoAlpha: 0, ...from }, { autoAlpha: 1, y: 0, duration: 1 }, 0);

  const rolls = copy.querySelectorAll("[data-roll]");
  if (rolls.length) enter.fromTo(rolls, { yPercent: 100 }, { yPercent: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" }, 0.1);

  const rule = copy.querySelector("[data-rule]");
  if (rule) enter.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: "power2.out" }, 0.35);

  const skills = copy.querySelectorAll("[data-skill]");
  if (skills.length) {
    enter.fromTo(
      skills,
      { autoAlpha: 0, y: 8, scale: 0.92 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.25, stagger: 0.3 / skills.length, ease: "back.out(2.5)" },
      0.45
    );
  }

  const count = copy.querySelector<HTMLElement>("[data-count]");
  const match = count?.textContent?.match(/^(\d+)(.*)$/);
  if (count && match) {
    const total = Number(match[1]);
    const tally = { value: 0 };
    enter.to(
      tally,
      {
        value: total,
        duration: 0.55,
        ease: "power2.out",
        onUpdate: () => {
          count.textContent = `${Math.round(tally.value)}${match[2]}`;
        },
      },
      0.35
    );
  }
}

export default function Experience() {
  const root = useRef<HTMLDivElement>(null);
  const progressBar = useRef<HTMLDivElement>(null);
  const lenis = useRef<Lenis | null>(null);
  const badge = useRef<BadgeState>(stateFor("intro", true));
  const [sceneReady, setSceneReady] = useState(false);
  const [chapter, setChapter] = useState(0);
  const animated = useSyncExternalStore(subscribeToMotion, canRunExperience, () => false);
  const router = useRouter();
  // The site-wide radio: muffled at the top of the story, opening up as you scroll.
  const sound = usePlayer();
  const setSoundProgress = sound.setFilter;
  useEffect(() => () => setSoundProgress(null), [setSoundProgress]);

  // The 3D "Now" badges navigate without a full page load, so the radio keeps playing.
  useEffect(() => {
    input.navigate = (href) => router.push(href);
  }, [router]);

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
      media.add({ desktop: WIDE_QUERY, mobile: NARROW_QUERY }, (context) => {
        const desktop = !!context.conditions?.desktop;
        Object.assign(badge.current, stateFor("intro", desktop));

        const story = gsap.timeline({
          defaults: { ease: "power1.inOut", duration: TRANSITION_VH },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: ({ progress }) => {
              setSoundProgress(progress);
              if (progressBar.current) progressBar.current.style.transform = `scaleX(${progress})`;
            },
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
            entrance(copy, { y: 60 }, { trigger: section, start: "top 70%", end: "top 20%" });
          } else {
            // Phones: the 3D objects fill the lower half, so the text must not slide up
            // through them. The y offset cancels the scroll, so the text fades in already
            // in its final place at the top, after the previous chapter's text has left.
            entrance(
              copy,
              { y: () => -0.4 * window.innerHeight },
              { trigger: section, start: "top 40%", end: "top top", invalidateOnRefresh: true }
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
                className="flex min-h-svh items-start px-4 pt-28 wide:items-center wide:px-12 wide:pt-0 short:pt-16 short:pb-12"
              >
                <div className="grid w-full grid-cols-1 items-center gap-10 wide:grid-cols-2">
                  <div className="max-w-xl">
                    <p className="mb-5 font-code-label text-[13px] uppercase text-primary wide:text-code-label short:mb-2">
                      David Cox · Daventertainment Inc
                    </p>
                    <h1 className="font-display text-[44px] leading-[1.05] font-extrabold tracking-tight wide:text-[76px] short:text-[34px]">
                      Where code meets craft.
                    </h1>
                    <p className="mt-5 text-body-md text-on-surface-variant wide:mt-6 wide:text-body-lg short:mt-3 short:text-[14px] short:leading-normal">
                      Full stack engineer and AI integration specialist with over 20 years of experience
                      building SaaS platforms, Next.js applications, and AI-powered systems.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3 wide:mt-8 short:mt-4">
                      <Link
                        href="/work"
                        className="rounded-lg bg-primary px-6 py-3.5 font-button text-button text-on-primary transition-[opacity,transform] hover:-translate-y-0.5 hover:opacity-85 active:translate-y-0"
                      >
                        See Work
                      </Link>
                      <Link
                        href="/contact"
                        className="rounded-lg border border-outline px-6 py-3.5 font-button text-button text-on-surface transition-[color,border-color,transform] hover:-translate-y-0.5 hover:border-primary hover:text-primary active:translate-y-0"
                      >
                        Hire Me
                      </Link>
                    </div>
                    {animated && (
                      <p className="mt-8 hidden font-code-label text-[12px] text-on-surface-variant pointer-fine:wide:block short:hidden">
                        Scroll for the story · drag the badge to spin it
                      </p>
                    )}
                  </div>
                  <Image
                    src="/badge-face.webp"
                    alt=""
                    width={520}
                    height={520}
                    priority
                    className={`mx-auto w-[62vw] max-w-[520px] transition-opacity duration-1000 wide:w-full ${
                      sceneReady ? "opacity-0" : ""
                    }`}
                  />
                </div>
              </section>
            );
          }

          const copy =
            section.kind === "era" ? (
              <EraCopy era={section.era} number={section.number} animated={animated} />
            ) : section.kind === "app" ? (
              <AppCopy app={section.app} index={section.index} />
            ) : (
              <>
                <p className={`${LABEL} text-primary`}>Contact</p>
                <h2 className="mt-2 font-display text-[44px] leading-[1.05] font-extrabold tracking-tight wide:text-[76px] short:text-[40px]">
                  Let&apos;s build something.
                </h2>
                <p className={BODY}>
                  Full stack engineering, AI integration, and creative work. Tell me about the role or
                  project.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="rounded-lg bg-primary px-6 py-3.5 font-button text-button text-on-primary transition-[opacity,transform] hover:-translate-y-0.5 hover:opacity-85"
                  >
                    Hire Me
                  </Link>
                  <Link
                    href="/work"
                    className="rounded-lg border border-outline px-6 py-3.5 font-button text-button transition-[color,border-color,transform] hover:-translate-y-0.5 hover:border-primary hover:text-primary"
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
              className={animated ? "relative" : "border-l border-white/10 px-4 py-14 wide:ml-12 wide:px-10"}
            >
              <div
                className={
                  animated
                    ? `sticky top-0 flex h-svh items-start px-4 pt-24 wide:items-center wide:px-12 wide:pt-0 short:pt-14 short:pb-10 compact:pt-[72px] ${
                        section.kind === "era" && section.era.id === "harbor" ? "wide:pb-56 short:pb-10" : ""
                      }`
                    : ""
                }
              >
                <div
                  data-copy={animated ? "" : undefined}
                  className={`max-w-md [text-shadow:0_2px_16px_rgba(3,7,18,0.95)] lg:max-w-lg ${
                    section.kind !== "era"
                      ? "short:max-w-[52vw]"
                      : section.era.id === "scale"
                        ? "short:max-w-[40vw] tiny:max-w-[44vw]"
                        : "short:max-w-[44vw] tiny:max-w-[50vw]"
                  }`}
                >
                  {copy}
                </div>
              </div>
            </section>
          );
        })}
      </main>

      {animated && (
        <>
          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 whitespace-nowrap px-4 pb-5 font-code-label text-[13px] wide:px-12 short:pb-3">
            <p key={chapter} className="text-on-surface-variant motion-safe:animate-[rise_0.5s_ease-out] short:invisible">
              <span className="hidden wide:inline">{marker(SECTIONS[chapter])}</span>
              <span className="wide:hidden">{shortMarker(SECTIONS[chapter])}</span>
            </p>

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

            <div className="pointer-events-auto flex items-center gap-4 wide:gap-6">
              <button
                type="button"
                onClick={sound.toggle}
                aria-pressed={sound.status !== "off"}
                className="text-on-surface transition-colors hover:text-primary aria-pressed:text-primary"
              >
                ♪ {soundLabel}
              </button>
              <Link href="/work" className="group text-on-surface hover:text-primary">
                Skip to work <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>

          {/* Story progress, with a tick at each chapter on the rail. */}
          <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-[3px] bg-white/10">
            <div
              ref={progressBar}
              className="h-full origin-left bg-primary shadow-[0_0_10px_rgba(212,176,106,0.8)]"
              style={{ transform: "scaleX(0)" }}
            />
            {TICKS.map((at, i) => (
              <span
                key={at}
                className={`absolute top-1/2 size-[5px] -translate-1/2 rounded-full transition-colors duration-500 ${
                  i <= railActive ? "bg-primary" : "bg-white/35"
                }`}
                style={{ left: `${at * 100}%` }}
              />
            ))}
          </div>
        </>
      )}

      {!animated && (
        <div className="px-4 pb-10 wide:px-12">
          <Link href="/work" className="font-code-label text-[13px] text-on-surface hover:text-primary">
            Skip to work →
          </Link>
        </div>
      )}
    </div>
  );
}
