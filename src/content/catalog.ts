// To publish real work, replace a placeholder with an entry that has a real
// title and file. Price and buy link are for the shop in a later phase.
export type CatalogItem = {
  title: string;
  src?: string;
  price?: number;
  buyUrl?: string;
};

// Files live in public/art/ (WebP, up to 1024px square).
export const ART: CatalogItem[] = [
  { title: "Chilled Rainbow Martini", src: "/art/chilled-rainbow-martini.webp" },
  { title: "Cityside Underglow Pink", src: "/art/cityside-underglow-pink.webp" },
  { title: "Day of the Dead Guitarist", src: "/art/day-of-dead-guitarist.webp" },
  { title: "Overgrown City Self-Portrait", src: "/art/youTube-Channel-Cover.webp" },
  { title: "Red Lips, Vintage Mic", src: "/art/red-lips-vintage-mic.webp" },
  { title: "Psychedelic City", src: "/art/psychedelic-city-painting.webp" },
  { title: "Rainbow Volcano Eruption", src: "/art/rainbow-volcano-eruption.webp" },
  { title: "Soul Singer Abstract", src: "/art/soul-singer-abstract.webp" },
  { title: "Synthwave Palms Sunset", src: "/art/synthwave-palms-sunset.webp" },
  { title: "Tech Pirate Skull & Crossbones", src: "/art/tech-pirate-skull-crossbones.webp" },
  { title: "Tokyo Rooftop, Neon City", src: "/art/tokyo-rooftop-guy-neon-city.webp" },
  { title: "Venice Beach Twilight Guitar", src: "/art/venice-beach-twilight-guitar.webp" },
];
// Two kinds of source: an MP4 file (short, silent clips that play inline on a
// loop) or a YouTube video (loads the YouTube player only when clicked).
// Posters live in public/videos/ so the page contacts no other site until play.
export type Video = {
  slug: string;
  title: string;
  kind: string; // short label, e.g. "Brand film"
  description: string;
  poster: string;
  seconds: number;
  uploadDate: string; // ISO date, for VideoObject JSON-LD
  source: { type: "file"; src: string } | { type: "youtube"; id: string };
  link?: { label: string; href: string };
};

export const VIDEOS: Video[] = [
  {
    slug: "joyfactory-axtion",
    title: "aXtion Cases: Built for the Field",
    kind: "Brand film",
    description:
      "A 16-second brand film for The Joy Factory's rugged aXtion cases. It runs as the hero banner on the company's homepage to build excitement and awareness.",
    poster: "/videos/joyfactory-axtion-poster.webp",
    seconds: 16,
    uploadDate: "2026-11-23",
    source: {
      type: "file",
      src: "https://thejoyfactory.com/wp-content/uploads/2026/11/joyfactory-axtion-feature-16s.mp4",
    },
    link: { label: "See it on thejoyfactory.com", href: "https://thejoyfactory.com" },
  },
  {
    slug: "pagescore-audit-walkthrough",
    title: "How to Run an AEO Audit with PageScore",
    kind: "App walkthrough",
    description:
      "A walkthrough of PageScore's free version: running an audit, reading the report, and what the paid tiers add.",
    poster: "/videos/pagescore-audit-thumb.webp",
    seconds: 287,
    uploadDate: "2026-06-13",
    source: { type: "youtube", id: "1aQoHSzgmKg" },
    link: { label: "About PageScore", href: "/work/pagescore" },
  },
];
