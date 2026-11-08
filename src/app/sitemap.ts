import type { MetadataRoute } from "next";
import { APPS } from "@/content/apps";

const SITE = "https://daventertainment.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/work", "/about", "/music", "/art", "/videos", "/studio", "/contact"];
  return [...pages, ...APPS.map(({ slug }) => `/work/${slug}`)].map((page) => ({
    url: `${SITE}${page}`,
  }));
}
