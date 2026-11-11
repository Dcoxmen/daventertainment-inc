import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { APPS } from "@/content/apps";

export const dynamicParams = false;

export function generateStaticParams() {
  return APPS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const app = APPS.find((item) => item.slug === slug);
  if (!app) return {};
  return {
    title: `${app.title} | David Cox`,
    description: app.description,
    alternates: { canonical: `/work/${slug}` },
  };
}

export default async function AppPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const app = APPS.find((item) => item.slug === slug);
  if (!app) notFound();

  return (
    <article className="max-w-3xl">
      <Link href="/work" className="font-code-label text-code-label text-secondary hover:text-primary">
        ← All work
      </Link>
      {app.client && (
        <p className="mt-8 font-code-label text-code-label uppercase text-primary">{app.client}</p>
      )}
      <h1 className="mt-3 font-display text-[36px] leading-[1.1] font-extrabold tracking-tight md:text-[52px]">
        {app.title}
      </h1>
      <p className="mt-5 text-body-md text-on-surface-variant md:text-body-lg">{app.description}</p>

      {app.metric && (
        <p className="mt-6 font-headline-md text-headline-md">
          <span className="text-primary">{app.metric.value}</span> {app.metric.label}
        </p>
      )}

      <ul className="mt-6 flex flex-wrap gap-2">
        {app.stack.map((item) => (
          <li
            key={item}
            className="rounded-lg border border-white/10 bg-surface-container-high px-3 py-1 font-code-label text-[13px]"
          >
            {item}
          </li>
        ))}
      </ul>

      {app.nda && (
        <p className="glass-card mt-8 rounded-xl p-5 text-body-md text-on-surface-variant">
          This project is under NDA. The image is an illustration, not the real app. Details are available on request.
        </p>
      )}

      <Image
        src={app.image}
        alt={app.nda ? `${app.title} illustration` : `${app.title} screenshot`}
        width={1600}
        height={900}
        sizes="(max-width: 768px) 100vw, 768px"
        className="mt-10 aspect-video h-auto w-full rounded-xl border border-white/10 object-cover"
      />


      <div className="mt-10 flex flex-wrap gap-3">
        {app.url && (
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-outline px-6 py-3.5 font-button text-button hover:border-primary hover:text-primary"
          >
            Visit {app.url.replace("https://", "")} ↗
          </a>
        )}
        <Link
          href="/contact"
          className="rounded-lg bg-primary px-6 py-3.5 font-button text-button text-on-primary hover:opacity-85"
        >
          Talk about a project
        </Link>
      </div>
    </article>
  );
}
