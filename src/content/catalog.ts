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
export const ART = placeholders("Art");
export const VIDEOS = placeholders("Video");
