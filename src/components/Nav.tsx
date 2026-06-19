"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "About", href: "#home", icon: "home" },
  { label: "Projects", href: "#projects", icon: "developer_mode_tv" },
  { label: "Services", href: "#services", icon: "smart_toy" },
  { label: "Contact", href: "#contact", icon: "mail" },
];

export default function Nav() {
  const [active, setActive] = useState("home");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "dark" | "light" | null;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -70% 0px" }
    );

    NAV_ITEMS.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("light", next === "light");
  }

  return (
    <>
      {/* ── Desktop top nav ── */}
      <header className="bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_40px_rgba(212,176,106,0.05)] sticky top-0 z-50 w-full">
        <div className="max-w-container-max mx-auto flex items-center justify-between px-margin-mobile md:px-margin-desktop h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Image
              src="/Daventertainment-logo.png"
              alt="Daventertainment Inc logo"
              width={40}
              height={40}
              className="rounded-full flex-shrink-0"
              priority
            />
            <span className="font-display text-headline-md text-primary tracking-tighter">
              Daventertainment Inc
            </span>
          </div>

          {/* Desktop links */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map(({ label, href }) => {
              const id = href.slice(1);
              return (
                <a
                  key={label}
                  href={href}
                  className={`font-code-label text-code-label transition-colors duration-300 ${
                    active === id
                      ? "text-primary"
                      : "text-on-surface-variant hover:text-secondary"
                  }`}
                >
                  {label}
                </a>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-surface-container border border-white/10 text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">
                {theme === "dark" ? "light_mode" : "dark_mode"}
              </span>
            </button>
            <a
              href="#contact"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary font-code-label text-code-label hover:bg-primary/20 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">terminal</span>
              SSH_CONNECT
            </a>
          </div>
        </div>
      </header>

      {/* ── Mobile bottom nav ── */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-safe pb-4 pt-2 bg-surface-container-lowest/90 backdrop-blur-2xl border-t border-white/5 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-50 rounded-t-xl"
      >
        {NAV_ITEMS.map(({ label, href, icon }) => {
          const id = href.slice(1);
          const isActive = active === id;
          return (
            <a
              key={label}
              href={href}
              className={`flex flex-col items-center justify-center transition-all duration-300 ease-out ${
                isActive
                  ? "text-primary bg-primary/10 rounded-xl px-3 py-1 scale-110"
                  : "text-on-surface-variant/60 hover:text-secondary"
              }`}
            >
              <span className="material-symbols-outlined">{icon}</span>
              <span className="font-code-label mt-1" style={{ fontSize: "10px" }}>
                {label}
              </span>
            </a>
          );
        })}
        {/* Theme toggle in mobile nav */}
        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-secondary transition-all duration-300"
        >
          <span className="material-symbols-outlined">
            {theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
          <span className="font-code-label mt-1" style={{ fontSize: "10px" }}>
            {theme === "dark" ? "Light" : "Dark"}
          </span>
        </button>
      </nav>
    </>
  );
}
