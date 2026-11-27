import type { Metadata } from "next";
import Link from "next/link";
import AppImage from "@/components/AppImage";
import PageIntro from "@/components/PageIntro";
import { APPS } from "@/content/apps";

export const metadata: Metadata = {
  title: "Work | David Cox",
  description:
    "Featured apps by David Cox, including AI assistants, audit engines, analytics platforms, and SaaS products.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <PageIntro label="Featured work" title="Apps built for real businesses.">
        AI assistants, audit engines, analytics platforms, and SaaS products.
      </PageIntro>
      <div className="grid gap-6 md:grid-cols-2">
        {APPS.map((app, i) => (
          <Link
            key={app.slug}
            href={`/work/${app.slug}`}
            className="glass-card group overflow-hidden rounded-xl transition-colors hover:border-primary/50"
          >
            <div className="bg-surface-container-low">
              <AppImage app={app} sizes="600px" eager={i < 2} className="block h-auto w-full object-cover" />
            </div>
            <div className="p-6">
              {app.client && (
                <p className="mb-1 font-code-label text-[13px] text-secondary">{app.client}</p>
              )}
              <h2 className="font-headline-md text-headline-md group-hover:text-primary">
                {app.title}
              </h2>
              {app.metric && (
                <p className="mt-2 text-body-md text-on-surface-variant">
                  <span className="font-semibold text-primary">{app.metric.value}</span>{" "}
                  {app.metric.label}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
