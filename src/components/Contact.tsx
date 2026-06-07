"use client";

import { useState } from "react";

const CHANNELS = [
  {
    icon: "mail",
    label: "Email",
    display: "davedvst@gmail.com",
    href: "mailto:davedvst@gmail.com",
  },
  {
    icon: "code",
    label: "GitHub",
    display: "/Dcoxmen",
    href: "https://github.com/Dcoxmen?tab=repositories",
  },
  {
    icon: "hub",
    label: "LinkedIn",
    display: "/in/david-cox",
    href: "https://www.linkedin.com/in/david-cox-78b88b44/",
  },
];

type FormStatus = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="py-section-gap">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          {/* ── Left: headline + channels ── */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-6">
                Let&apos;s connect the{" "}
                <span className="text-primary">neural nodes</span>.
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
                Whether you&apos;re looking to discuss a high-scale architecture,
                an AI integration project, or just want to talk code — I&apos;m
                always active on the signal.
              </p>
            </div>

            {/* Direct channels */}
            <div>
              <h3 className="font-code-label text-code-label text-primary uppercase tracking-widest mb-6">
                Direct Channels
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CHANNELS.map((ch) => (
                  <a
                    key={ch.label}
                    href={ch.href}
                    target={ch.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      ch.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="glass-card p-6 rounded-xl hover:border-primary/50 transition-all duration-300 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-2xl">
                        {ch.icon}
                      </span>
                    </div>
                    <div>
                      <div className="text-on-surface font-headline-md text-headline-md leading-none mb-1">
                        {ch.label}
                      </div>
                      <div
                        className="text-on-surface-variant font-code-label"
                        style={{ fontSize: "12px" }}
                      >
                        {ch.display}
                      </div>
                    </div>
                  </a>
                ))}

                {/* Status card */}
                <div className="glass-card p-6 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary relative">
                    <span className="material-symbols-outlined text-2xl">
                      sensors
                    </span>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full animate-pulse" />
                  </div>
                  <div>
                    <div className="text-on-surface font-headline-md text-headline-md leading-none mb-1">
                      Status
                    </div>
                    <div
                      className="text-on-surface-variant font-code-label"
                      style={{ fontSize: "12px" }}
                    >
                      Ready for intake
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="pt-8 border-t border-white/5">
              <p className="font-headline-md text-headline-md text-secondary/80 italic">
                &quot;Let&apos;s build the future together.&quot;
              </p>
            </div>
          </div>

          {/* ── Right: contact form ── */}
          <div className="lg:col-span-7">
            <div className="glass-card p-8 md:p-12 rounded-2xl relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />

              <form
                name="contact"
                data-netlify="true"
                netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
                className="space-y-8 relative z-10"
              >
                <input type="hidden" name="form-name" value="contact" />
                <input type="hidden" name="bot-field" />
                <div className="space-y-6">
                  <div className="group">
                    <label
                      htmlFor="name"
                      className="block font-code-label text-code-label text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors"
                    >
                      IDENTIFIER (Name)
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="E.g. Alan Turing"
                      required
                      className="glass-input w-full px-4 py-4 rounded-lg text-on-surface placeholder:text-on-surface-variant/30"
                    />
                  </div>

                  <div className="group">
                    <label
                      htmlFor="email"
                      className="block font-code-label text-code-label text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors"
                    >
                      ENDPOINT (Email)
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="E.g. alan@enigma.com"
                      required
                      className="glass-input w-full px-4 py-4 rounded-lg text-on-surface placeholder:text-on-surface-variant/30"
                    />
                  </div>

                  <div className="group">
                    <label
                      htmlFor="message"
                      className="block font-code-label text-code-label text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors"
                    >
                      PAYLOAD (Message)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="System initialization requested..."
                      required
                      className="glass-input w-full px-4 py-4 rounded-lg text-on-surface placeholder:text-on-surface-variant/30 resize-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-3 text-on-surface-variant/60 font-code-label text-xs">
                    <span className="material-symbols-outlined text-sm">
                      lock
                    </span>
                    SSL Encrypted Transmission
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending" || status === "sent"}
                    className="w-full sm:w-auto px-10 py-4 bg-primary text-on-primary font-button text-button rounded-xl hover:bg-primary-container hover:scale-105 transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(212,176,106,0.4)] flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {status === "sending" && (
                      <>
                        <span className="material-symbols-outlined animate-spin">
                          refresh
                        </span>
                        Processing...
                      </>
                    )}
                    {status === "sent" && (
                      <>
                        <span className="material-symbols-outlined">
                          check_circle
                        </span>
                        Sent Successfully
                      </>
                    )}
                    {status === "error" && (
                      <>
                        <span className="material-symbols-outlined">
                          error
                        </span>
                        Retry — Send Again
                      </>
                    )}
                    {status === "idle" && (
                      <>
                        Send Message
                        <span className="material-symbols-outlined">send</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Subtle grid decoration */}
            <div className="mt-12 opacity-10 pointer-events-none overflow-hidden h-32 relative">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(#958ea0 1px, transparent 1px), linear-gradient(90deg, #958ea0 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
