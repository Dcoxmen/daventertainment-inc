"use client";

import { useState } from "react";
import PageIntro from "@/components/PageIntro";

const CHANNELS = [
  { label: "Email", display: "davedvst@gmail.com", href: "mailto:davedvst@gmail.com" },
  { label: "GitHub", display: "/Dcoxmen", href: "https://github.com/Dcoxmen?tab=repositories" },
  { label: "LinkedIn", display: "/in/david-cox", href: "https://www.linkedin.com/in/david-cox-78b88b44/" },
];

const BUTTON_LABELS: Record<FormStatus, string> = {
  idle: "Send Message",
  sending: "Sending...",
  sent: "Message Sent",
  error: "Try Again",
};

const FIELD = "glass-input w-full rounded-lg px-4 py-3.5 text-on-surface";
const LABEL = "mb-2 block font-code-label text-code-label text-on-surface-variant";

type FormStatus = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formsubmit.co/ajax/davedvst@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
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
    <div className="grid items-start gap-12 lg:grid-cols-2">
      <div>
        <PageIntro label="Contact" title="Let's build something.">
          Tell me about the role or project, and I&apos;ll get back to you.
        </PageIntro>
        <ul className="space-y-3">
          {CHANNELS.map(({ label, display, href }) => (
            <li key={label}>
              <a href={href} className="glass-card flex justify-between gap-4 rounded-xl p-5 transition-colors hover:border-primary/50">
                <span className="font-headline-md font-semibold">{label}</span>
                <span className="font-code-label text-[13px] text-on-surface-variant">{display}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="glass-card space-y-6 rounded-2xl p-6 md:p-10">
        <div>
          <label htmlFor="name" className={LABEL}>Name</label>
          <input id="name" name="name" type="text" autoComplete="name" required className={FIELD} />
        </div>
        <div>
          <label htmlFor="email" className={LABEL}>Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required className={FIELD} />
        </div>
        <div>
          <label htmlFor="message" className={LABEL}>Message</label>
          <textarea id="message" name="message" rows={5} required className={`${FIELD} resize-none`} />
        </div>
        <button
          type="submit"
          disabled={status === "sending" || status === "sent"}
          className="w-full rounded-lg bg-primary px-8 py-4 font-button text-button text-on-primary transition-opacity hover:opacity-85 disabled:opacity-70"
        >
          {BUTTON_LABELS[status]}
        </button>
        {status === "error" && (
          <p role="alert" className="text-body-md text-error">
            That didn&apos;t send. Please try again or email me directly.
          </p>
        )}
      </form>
    </div>
  );
}
