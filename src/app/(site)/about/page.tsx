import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import { EDUCATION, EXPERIENCE, HEADSHOT, RESUME_FILE, SERVICES, STATS } from "@/content/profile";

export const metadata: Metadata = {
  title: "About | David Cox",
  description:
    "David Cox is a full stack engineer and AI integration specialist with over 20 years of experience and a background in live entertainment.",
  alternates: { canonical: "/about" },
};

const hasResume = existsSync(path.join(process.cwd(), "public", RESUME_FILE));

export default function AboutPage() {
  return (
    <>
      <div className="grid items-center gap-10 md:grid-cols-[1fr_320px]">
        <div>
          <PageIntro label="About" title="David Cox">
            Full stack engineer and AI integration specialist with over 20 years
            of experience. I build scalable web platforms, e-commerce systems, and
            AI-powered tools, with a background in live entertainment and a
            passion for emerging technology.
          </PageIntro>
          <div className="-mt-6 mb-10 flex flex-wrap gap-3 md:-mt-8">
            {hasResume && (
              <a
                href={`/${RESUME_FILE}`}
                className="rounded-lg bg-primary px-6 py-3.5 font-button text-button text-on-primary hover:opacity-85"
              >
                Download Resume
              </a>
            )}
            <Link
              href="/contact"
              className="rounded-lg border border-outline px-6 py-3.5 font-button text-button hover:border-primary hover:text-primary"
            >
              Get in Touch
            </Link>
          </div>
        </div>
        <div className="relative mx-auto aspect-square w-64 overflow-hidden rounded-full border-2 border-primary md:w-80">
          <Image
            src={HEADSHOT}
            alt="David Cox"
            fill
            sizes="320px"
            className="object-cover"
          />
        </div>
      </div>

      <dl className="mb-16 grid grid-cols-2 gap-4 md:max-w-md">
        {STATS.map(({ value, label }) => (
          <div key={label} className="glass-card rounded-xl p-5">
            <dd className="font-headline-md text-headline-md text-primary">{value}</dd>
            <dt className="font-code-label text-[13px] text-on-surface-variant">{label}</dt>
          </div>
        ))}
      </dl>

      <section className="mb-16">
        <h2 className="mb-6 font-headline-lg text-headline-lg-mobile md:text-headline-lg">What I do</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {SERVICES.map(({ group, items }) => (
            <div key={group}>
              <h3 className="mb-4 font-code-label text-code-label uppercase text-secondary">{group}</h3>
              <div className="space-y-3">
                {items.map(({ title, description }) => (
                  <div key={title} className="glass-card rounded-xl p-5">
                    <h4 className="font-headline-md font-semibold">{title}</h4>
                    <p className="mt-1 text-body-md text-on-surface-variant">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16 max-w-3xl">
        <h2 className="mb-6 font-headline-lg text-headline-lg-mobile md:text-headline-lg">Experience</h2>
        <ol className="space-y-7 border-l border-white/10 pl-6">
          {EXPERIENCE.map(({ role, company, dates, summary }) => (
            <li key={role}>
              <p className="font-code-label text-[13px] text-primary">{dates}</p>
              <h3 className="mt-1 font-headline-md font-semibold">{role}</h3>
              <p className="text-secondary">{company}</p>
              <p className="mt-1 text-body-md text-on-surface-variant">{summary}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="max-w-3xl">
        <h2 className="mb-4 font-headline-lg text-headline-lg-mobile md:text-headline-lg">Education</h2>
        <ul className="space-y-2 text-body-md text-on-surface-variant">
          {EDUCATION.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
