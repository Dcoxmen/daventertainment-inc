export type App = {
  slug: string;
  title: string;
  description: string;
  /** Extra paragraphs shown only on the app's own page, below the description. */
  details?: string[];
  stack: string[];
  client?: string;
  url?: string;
  /** 16:9 image for the /work cards and the app page. Made by scripts/work-images/make.mjs. */
  image: string;
  /** Optional square image the app page shows on phones (under 768px) instead of `image`. */
  imageSm?: string;
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
    details: [
      "The strategy was to raise sales conversions on both sides of the business: B2B buyers outfitting their teams and shoppers on the e-commerce store. A large catalog of cases, mounts and accessories can stall a purchase. Bundle Builder turns that choice into a short, guided conversation, so every buyer reaches a complete, compatible setup and can order it in one step.",
      "It is built with Next.js and deployed on Vercel, connects to the store through its e-commerce API, and uses Claude AI to turn each buyer's answers into a tailored recommendation.",
      "We have also created variations of Bundle Builder for select channel partners, each tailored to that partner's product lineup and customers.",
    ],
    stack: ["Next.js", "Vercel", "E-commerce API", "Claude AI"],
    url: "https://thejoyfactory.com",
    image: "/work/bundle-builder-entry-cover.webp",
    badge: "/work/bundle-builder-badge.webp",
  },
  {
    slug: "pagescore",
    title: "PageScore: AI SEO & AEO Audit Engine",
    description:
      "An AI-powered landing page evaluator that delivers precise technical SEO and AEO audit reports with actionable recommendations to improve search and AI engine visibility.",
    details: [
      "Search has changed. People now ask ChatGPT, Perplexity and Google AI Overviews for answers, and most pages are not built to be read, trusted and cited by those engines. Traditional SEO tools don't measure it, so site owners can't see why they are missing from AI answers. PageScore solves that: paste in any URL and get a scored report on both traditional SEO and AI answer engine readiness in under 10 seconds.",
      "Each audit runs 24 checks across five categories, including Core Web Vitals, schema and JSON-LD validation, E-E-A-T signals and LLM readability, then returns ready-to-paste code fixes and a downloadable PDF report.",
      "It is built with Next.js, TypeScript and React and deployed on Vercel, with Supabase for accounts and audit history, Stripe for Pro and Agency subscriptions, and Anthropic's Claude powering the AI analysis.",
    ],
    stack: ["Next.js", "TypeScript", "React", "Anthropic", "Supabase", "Stripe", "Vercel"],
    url: "https://page-score.com",
    image: "/work/pagescore-cover.webp",
    badge: "/work/pagescore-badge.webp",
    metric: { value: "1k", label: "Active users" },
  },
  {
    slug: "data-analytics-dashboard",
    title: "Data Management & Analytics Dashboard",
    description:
      "A central data platform on Google Cloud that pulls siloed company data from APIs into BigQuery, uses AI to map how it relates and catch errors, and gives the whole organization one trusted source for reporting and tracking.",
    details: [
      "It began as a conversational analytics engine for GA4 data and grew into something bigger. The company's data lived in silos across many different systems, with little or no relational connection between them, so every report meant pulling exports by hand and stitching them together.",
      "The dashboard solves this with six tabs that take any API source from raw data to trusted tables. It connects to the API source, picks the dataset schema needed, validates the BigQuery project and dataset, previews the data, and ingests it into BigQuery. The sixth tab uses Google Gemini to work out how the datasets relate, check their accuracy, and find bugs, with troubleshooting steps and suggested fixes.",
      "The app was prototyped in Google AI Studio and built with Gemini, which kept the whole stack inside Google Cloud alongside BigQuery.",
      "The result is a central source of data for reporting and tracking: dashboards and reports now draw on clean, connected tables in BigQuery instead of scattered exports.",
    ],
    stack: ["GCP", "BigQuery", "REST APIs", "Gemini", "Google AI Studio", "GA4"],
    image: "/work/data-management-dashboard-cover.webp",
    imageSm: "/work/data-analytics-dashboard-sm.webp",
    badge: "/work/data-analytics-dashboard-badge.webp",
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
