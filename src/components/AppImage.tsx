import Image, { getImageProps } from "next/image";
import type { App } from "@/content/apps";

type AppImageProps = {
  app: App;
  /** Sizing and look; the shape (16:9, or square on phones when there is a phone image) is added here. */
  className: string;
  /** `sizes` for the wide image on screens 768px and up. */
  sizes: string;
};

// The app's 16:9 image. When the app has a square phone version, phones (under 768px) get that instead.
export default function AppImage({ app, className, sizes }: AppImageProps) {
  const alt = app.nda ? `${app.title} illustration` : `${app.title} screenshot`;
  const wide = { src: app.image, alt, width: 1600, height: 900, sizes: `(max-width: 768px) 100vw, ${sizes}` };
  if (!app.imageSm) return <Image {...wide} className={`${className} aspect-video`} />;

  const { props: { srcSet: desktop } } = getImageProps(wide);
  const { props: phone } = getImageProps({ src: app.imageSm, alt, width: 1200, height: 1200, sizes: "100vw" });
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktop} sizes={wide.sizes} />
      <img {...phone} alt={alt} className={`${className} aspect-square md:aspect-video`} />
    </picture>
  );
}
