export type App = {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  client?: string;
  url?: string;
  /** 16:9 image for the /work cards and the app page. Made by scripts/work-images/make.mjs. */
  image: string;
  /** Square image for the round frame in the home story; keep its content inside the circle. */
  badge: string;
  metric?: { value: string; label: string };
  /** Under NDA: the images are an illustration, and the app page offers details on request. */
  nda?: boolean;
};

export const APPS: App[] = [
  {
    slug: "bundle-builder",
    title: "Bundle Builder",
    client: "The Joy Factory",
    description:
      "A customer assistant that helps shoppers narrow down what they need. Focused questions in an easy-to-understand interface identify the features and solutions they are looking for, then it recommends a bundled solution of device case and best-matched mounts and accessories.",
    stack: ["Next.js", "E-commerce API", "Claude AI"],
    url: "https://thejoyfactory.com",
    image: "/work/bundle-builder-cover.webp",
    badge: "/work/bundle-builder-badge.webp",
  },
  {
    slug: "pagescore",
    title: "PageScore: AI SEO & AEO Audit Engine",
    description:
      "An AI-powered landing page evaluator that delivers precise technical SEO and AEO audit reports with actionable recommendations to improve search and AI engine visibility.",
    stack: ["Next.js", "TypeScript", "Anthropic", "React"],
    url: "https://page-score.com",
    image: "/work/pagescore-cover.webp",
    badge: "/work/pagescore-badge.webp",
    metric: { value: "10k+", label: "Active users" },
  },
  {
    slug: "conversational-analytics",
    title: "Conversational Analytics Engine",
    description:
      "A GCP-powered analytics environment connecting BigQuery and Looker Studio to transform GA4 data into real-time conversational dashboards, eliminating manual reporting across the organization.",
    stack: ["GCP", "BigQuery", "Looker Studio", "GA4"],
    image: "/work/conversational-analytics-cover.webp",
    badge: "/work/conversational-analytics-badge.webp",
    metric: { value: "85%", label: "Report automation" },
  },
  {
    slug: "gamified-sales-engine",
    title: "Gamified Sales Engine",
    client: "National logistics company",
    description:
      "A gamified SaaS platform built for a national logistics company. It scaled to nationwide use and drove corporate revenue.",
    stack: ["SaaS", "Full Stack"],
    image: "/work/gamified-sales-engine-cover.webp",
    badge: "/work/gamified-sales-engine-badge.webp",
    nda: true,
  },
];
