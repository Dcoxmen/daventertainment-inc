"use client";

import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { label: "Nexus", href: "#home", icon: "home" },
  { label: "Forge", href: "#projects", icon: "developer_mode_tv" },
  { label: "Labs", href: "#services", icon: "smart_toy" },
  { label: "Signal", href: "#contact", icon: "mail" },
];

export default function Nav() {
  const [active, setActive] = useState("nexus");

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

  return (
    <>
      {/* ── Desktop top nav ── */}
      <header className="bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_40px_rgba(208,188,255,0.05)] sticky top-0 z-50 w-full">
        <div className="max-w-container-max mx-auto flex items-center justify-between px-margin-mobile md:px-margin-desktop h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-primary/30 bg-surface-container flex items-center justify-center text-primary font-display text-sm font-bold flex-shrink-0">
              D
            </div>
            <span className="font-display text-headline-md text-primary tracking-tighter">
              Daventertainment Inc
            </span>
          </div>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-8">
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

          {/* SSH button */}
          <a
            href="#signal"
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary font-code-label text-code-label hover:bg-primary/20 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">terminal</span>
            SSH_CONNECT
          </a>
        </div>
      </header>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-safe pb-4 pt-2 bg-surface-container-lowest/90 backdrop-blur-2xl border-t border-white/5 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-50 rounded-t-xl">
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
      </nav>
    </>
  );
}
