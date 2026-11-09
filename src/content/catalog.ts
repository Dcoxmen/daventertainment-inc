// To publish real work, replace a placeholder with an entry that has a real
// title and file. Price and buy link are for the shop in a later phase.
export type CatalogItem = {
  title: string;
  src?: string;
  price?: number;
  buyUrl?: string;
};

const placeholders = (name: string): CatalogItem[] =>
  Array.from({ length: 12 }, (_, i) => ({
    title: `${name} ${String(i + 1).padStart(2, "0")}`,
  }));

export const TRACKS = placeholders("Track");
// Files live in public/art/ (WebP, up to 1024px square).
export const ART: CatalogItem[] = [
  { title: "Chilled Rainbow Martini", src: "/art/chilled-rainbow-martini.webp" },
  { title: "Cityside Underglow Pink", src: "/art/cityside-underglow-pink.webp" },
  { title: "Day of the Dead Guitarist", src: "/art/day-of-dead-guitarist.webp" },
  { title: "Días de los Muertos Band", src: "/art/dias-de-los-muertos-band.webp" },
  { title: "PCH Coastal Drive", src: "/art/pch-coastal-drive-illustration.webp" },
  { title: "Psychedelic City", src: "/art/psychedelic-city-painting.webp" },
  { title: "Rainbow Volcano Eruption", src: "/art/rainbow-volcano-eruption.webp" },
  { title: "Soul Singer Abstract", src: "/art/soul-singer-abstract.webp" },
  { title: "Synthwave Palms Sunset", src: "/art/synthwave-palms-sunset.webp" },
  { title: "Tech Pirate Skull & Crossbones", src: "/art/tech-pirate-skull-crossbones.webp" },
  { title: "Tokyo Rooftop, Neon City", src: "/art/tokyo-rooftop-guy-neon-city.webp" },
  { title: "Venice Beach Twilight Guitar", src: "/art/venice-beach-twilight-guitar.webp" },
];
export const VIDEOS = placeholders("Video");
