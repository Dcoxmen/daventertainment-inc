import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import { TRACKS } from "@/content/catalog";

export const metadata: Metadata = {
  title: "Music | Daventertainment Inc",
  description: "Original music from Daventertainment Inc.",
  alternates: { canonical: "/music" },
};

export default function MusicPage() {
  return (
    <>
      <PageIntro label="Music" title="New tracks are on the way.">
        Original music from Daventertainment Inc.
      </PageIntro>
      <ol className="max-w-3xl divide-y divide-white/10 border-y border-white/10">
        {TRACKS.map(({ title }, index) => (
          <li key={title} className="flex items-center gap-5 py-4">
            <span className="w-7 font-code-label text-[13px] text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="flex-1 font-headline-md font-semibold">{title}</span>
            <span className="font-code-label text-[13px] text-on-surface-variant">Coming soon</span>
          </li>
        ))}
      </ol>
    </>
  );
}
