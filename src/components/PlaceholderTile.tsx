const TINTS = [
  "from-secondary-container/70 to-surface-container",
  "from-tertiary-container/80 to-surface-container",
  "from-primary-container/70 to-surface-container",
];

type PlaceholderTileProps = {
  title: string;
  index: number;
  aspect: "aspect-square" | "aspect-video";
};

export default function PlaceholderTile({ title, index, aspect }: PlaceholderTileProps) {
  return (
    <article
      className={`${aspect} relative flex flex-col justify-end overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br p-4 ${
        TINTS[index % TINTS.length]
      }`}
    >
      <span
        aria-hidden
        className="absolute -top-8 -right-8 h-32 w-32 rounded-full border border-white/15"
      />
      <h2 className="font-headline-md font-semibold">{title}</h2>
      <p className="font-code-label text-[13px] text-on-surface-variant">Coming soon</p>
    </article>
  );
}
