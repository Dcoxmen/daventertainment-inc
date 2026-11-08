import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import PlaceholderTile from "@/components/PlaceholderTile";
import { VIDEOS } from "@/content/catalog";

export const metadata: Metadata = {
  title: "Videos | Daventertainment Inc",
  description: "Original video work from Daventertainment Inc.",
  alternates: { canonical: "/videos" },
};

export default function VideosPage() {
  return (
    <>
      <PageIntro label="Videos" title="Now in the edit.">
        Original video work from Daventertainment Inc.
      </PageIntro>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {VIDEOS.map(({ title }, index) => (
          <PlaceholderTile key={title} title={title} index={index} aspect="aspect-video" />
        ))}
      </div>
    </>
  );
}
