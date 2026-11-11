import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import RadioDial from "@/components/music/RadioDial";

export const metadata: Metadata = {
  title: "Music | Daventertainment Inc",
  description:
    "Daventertainment Radio: twelve original lo-fi, chillhop and funk stations by David Cox. Turn the dial to listen.",
  alternates: { canonical: "/music" },
};

export default function MusicPage() {
  return (
    <>
      <PageIntro label="Music" title="Tune in.">
        Twelve original lo-fi stations from Daventertainment Inc. Turn the dial to listen.
      </PageIntro>
      <RadioDial />
    </>
  );
}
