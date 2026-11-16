import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import ArtGallery, { type Artwork } from "@/components/art/ArtGallery";
import { ART } from "@/content/catalog";

export const metadata: Metadata = {
  title: "Art | Daventertainment Inc",
  description: "Original art and illustration from Daventertainment Inc.",
  alternates: { canonical: "/art" },
};

const artworks = ART.filter((item): item is Artwork => Boolean(item.src));

export default function ArtPage() {
  return (
    <>
      <PageIntro label="Art" title="Original art and illustration.">
        Neon cities, coastal sunsets, music, and myth, from the Daventertainment studio.
      </PageIntro>
      <ArtGallery items={artworks} />
    </>
  );
}
