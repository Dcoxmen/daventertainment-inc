import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Studio | Daventertainment Inc",
  description: "The Daventertainment lab and studio is coming soon.",
  alternates: { canonical: "/studio" },
};

export default function StudioPage() {
  return (
    <PageIntro label="Studio · Coming soon" title="The Backlot is under construction.">
      The Daventertainment lab for experiments, prototypes, and new ideas.
    </PageIntro>
  );
}
