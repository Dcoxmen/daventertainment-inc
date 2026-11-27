import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import VideoCard from "@/components/videos/VideoCard";
import { VIDEOS, type Video } from "@/content/catalog";
import { SITE, jsonLd } from "@/content/schema";

export const metadata: Metadata = {
  title: "Videos & Motion Graphics | Daventertainment Inc",
  description:
    "Original videos and motion graphics by David Cox of Daventertainment Inc for product support, brand awareness, marketing and education, made with CapCut, Premiere Pro, HyperFrames, Claude AI, Google Flow, ElevenLabs, Suno and LemonSlice.",
  alternates: { canonical: "/videos" },
};

const CHANNEL = "https://www.youtube.com/channel/UCDCuScou1VMIOx7DCasa76g";

const isoDuration = (s: number) => `PT${Math.floor(s / 60)}M${s % 60}S`;

const videoSchema = (v: Video) => ({
  "@type": "VideoObject",
  name: v.title,
  description: v.description,
  thumbnailUrl: `${SITE}${v.poster}`,
  uploadDate: v.uploadDate,
  duration: isoDuration(v.seconds),
  ...(v.source.type === "file"
    ? { contentUrl: v.source.src }
    : { embedUrl: `https://www.youtube.com/embed/${v.source.id}` }),
});

const PAGE_SCHEMA = { "@context": "https://schema.org", "@graph": VIDEOS.map(videoSchema) };

export default function VideosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(PAGE_SCHEMA)} />
      <PageIntro label="Videos" title="Videos & Motion Graphics">
        Every video here is one I made, in a range of styles and formats built
        for different jobs: product support, brand awareness, marketing media,
        and education. My toolkit includes CapCut, Premiere Pro, HyperFrames,
        Claude AI, Google Flow, ElevenLabs, Suno, and LemonSlice. Fight AI slop
        with quality content.
      </PageIntro>
      <div className="grid gap-6 md:grid-cols-2">
        {VIDEOS.map((video) => (
          <VideoCard key={video.slug} video={video} />
        ))}
      </div>
      <p className="mt-12 font-code-label text-[13px] text-on-surface-variant">
        More videos on the way.{" "}
        <a
          href={CHANNEL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-secondary hover:text-primary"
        >
          Visit the YouTube channel ↗
        </a>
      </p>
    </>
  );
}
