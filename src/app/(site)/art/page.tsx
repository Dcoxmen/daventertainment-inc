import type { Metadata } from "next";
import Image from "next/image";
import PageIntro from "@/components/PageIntro";
import PlaceholderTile from "@/components/PlaceholderTile";
import { ART } from "@/content/catalog";

export const metadata: Metadata = {
  title: "Art | Daventertainment Inc",
  description: "Original art and illustration from Daventertainment Inc.",
  alternates: { canonical: "/art" },
};

export default function ArtPage() {
  return (
    <>
      <PageIntro label="Art" title="Original art and illustration.">
        Neon cities, coastal sunsets, music, and myth, from the Daventertainment studio.
      </PageIntro>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {ART.map(({ title, src }, index) =>
          src ? (
            <figure key={title} className="group">
              <div className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-surface-container-low">
                <Image
                  src={src}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 300px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <figcaption className="mt-2 font-headline-md text-sm font-semibold md:text-base">
                {title}
              </figcaption>
            </figure>
          ) : (
            <PlaceholderTile key={title} title={title} index={index} aspect="aspect-square" />
          )
        )}
      </div>
    </>
  );
}
