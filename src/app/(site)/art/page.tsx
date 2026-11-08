import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import PlaceholderTile from "@/components/PlaceholderTile";
import { ART } from "@/content/catalog";

export const metadata: Metadata = {
  title: "Art | Daventertainment Inc",
  description: "Original art from Daventertainment Inc.",
  alternates: { canonical: "/art" },
};

export default function ArtPage() {
  return (
    <>
      <PageIntro label="Art" title="The gallery is being hung.">
        Original art from Daventertainment Inc.
      </PageIntro>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {ART.map(({ title }, index) => (
          <PlaceholderTile key={title} title={title} index={index} aspect="aspect-square" />
        ))}
      </div>
    </>
  );
}
