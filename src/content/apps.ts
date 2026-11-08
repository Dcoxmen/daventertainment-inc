export type App = {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  client?: string;
  url?: string;
  image?: string;
  /** Shows the whole image on cards instead of cropping it. */
  portrait?: boolean;
  metric?: { value: string; label: string };
  /** Hides visuals and shows "details on request". */
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
    image: "/project-bundle-builder.webp",
    portrait: true,
  },
  {
    slug: "pagescore",
    title: "PageScore: AI SEO & AEO Audit Engine",
    description:
      "An AI-powered landing page evaluator that delivers precise technical SEO and AEO audit reports with actionable recommendations to improve search and AI engine visibility.",
    stack: ["Next.js", "TypeScript", "Anthropic", "React"],
    url: "https://page-score.com",
    image: "/project-pagescore.png",
    metric: { value: "10k+", label: "Active users" },
  },
  {
    slug: "conversational-analytics",
    title: "Conversational Analytics Engine",
    description:
      "A GCP-powered analytics environment connecting BigQuery and Looker Studio to transform GA4 data into real-time conversational dashboards, eliminating manual reporting across the organization.",
    stack: ["GCP", "BigQuery", "Looker Studio", "GA4"],
    image: "/project-analytics.png",
    metric: { value: "85%", label: "Report automation" },
  },
  {
    slug: "gamified-sales-engine",
    title: "Gamified Sales Engine",
    client: "National logistics company",
    description:
      "A gamified SaaS platform built for a national logistics company. It scaled to nationwide use and drove corporate revenue.",
    stack: ["SaaS", "Full Stack"],
    nda: true,
  },
];
