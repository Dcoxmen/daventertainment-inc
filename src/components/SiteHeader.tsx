"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Music", href: "/music" },
  { label: "Art", href: "/art" },
  { label: "Videos", href: "/videos" },
  { label: "Studio", href: "/studio" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const solid = pathname !== "/" || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-colors ${
        solid ? "border-b border-white/10 bg-background/90 backdrop-blur-xl" : ""
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 md:px-12 md:py-4">
        <Link href="/" onClick={close} className="flex items-center gap-3">
          <Image
            src="/Daventertainment-logo.png"
            alt="Daventertainment Inc logo"
            width={40}
            height={40}
          />
          <span className="hidden font-headline-md font-semibold sm:block">
            Daventertainment Inc
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname.startsWith(href) ? "page" : undefined}
              className="font-code-label text-code-label text-on-surface transition-colors hover:text-primary aria-[current=page]:text-primary"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            onClick={close}
            className="rounded-lg bg-primary px-4 py-2.5 font-button text-sm font-semibold text-on-primary transition-opacity hover:opacity-85"
          >
            Hire Me
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-white/15 lg:hidden"
          >
            <span className={`h-0.5 w-5 bg-on-surface transition-transform ${open ? "translate-y-1 rotate-45" : ""}`} />
            <span className={`h-0.5 w-5 bg-on-surface transition-transform ${open ? "-translate-y-1 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t border-white/10 px-4 py-2 lg:hidden">
          {NAV_ITEMS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={close}
              className="block py-3 font-headline-md text-headline-md text-on-surface"
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
