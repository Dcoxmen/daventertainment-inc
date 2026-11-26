import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import ArtGallery, { type Artwork } from "@/components/art/ArtGallery";
import { ART } from "@/content/catalog";

export const metadata: Metadata = {
  title: "Art | Daventertainment Inc",
  description:
    "Art and illustrations by David Cox of Daventertainment Inc: synthwave, neon cityscapes, psychedelic color and music-inspired portraits, made with Adobe Creative Suite, ArtCraft Suite and AI image and video tools.",
  alternates: { canonical: "/art" },
};

const artworks = ART.filter((item): item is Artwork => Boolean(item.src));

export default function ArtPage() {
  return (
    <>
      <PageIntro label="Art" title="Art & Illustrations">
        Some of my latest creations, ranging from synthwave sunsets and neon
        cityscapes to psychedelic color, Day of the Dead portraiture, and soulful
        abstracts. The styles change, but the eye stays the same: bold color,
        strong mood, and music running through nearly every piece. My toolkit
        includes Adobe Creative Suite, ArtCraft Suite, graphic and sound design,
        and AI image and video.
      </PageIntro>
      <ArtGallery items={artworks} />
    </>
  );
}
