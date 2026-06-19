import type { Metadata } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "David Cox | Full Stack Engineer & AI Integration Specialist | Daventertainment Inc",
  description:
    "David Cox is a Full Stack Engineer and AI Integration Specialist with 20 years of experience building scalable SaaS platforms, Next.js applications, and AI-powered systems. Available for contract and full-time roles.",
  keywords: [
    "Full Stack Developer for hire",
    "AI Integration Engineer",
    "Next.js Developer",
    "TypeScript Engineer",
    "React Developer",
    "Node.js Developer",
    "SaaS Development",
    "LangChain Developer",
    "Anthropic Claude Integration",
    "AEO Optimization",
    "SEO Engineer",
    "GCP BigQuery Engineer",
    "David Cox",
    "Daventertainment Inc",
  ],
  authors: [{ name: "David Cox", url: "https://daventertainment.com" }],
  creator: "David Cox",
  robots: { index: true, follow: true },
  openGraph: {
    title: "David Cox | Full Stack Engineer & AI Integration Specialist",
    description:
      "20 years building high-performance web ecosystems. Specializing in Next.js, AI integration, and SEO/AEO optimization. Available for contract and full-time roles.",
    url: "https://daventertainment.com",
    siteName: "Daventertainment Inc",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "David Cox | Full Stack Engineer & AI Integration Specialist",
    description:
      "20 years building high-performance web ecosystems. Specializing in Next.js, AI integration, and SEO/AEO.",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "David Cox",
    url: "https://daventertainment.com",
    jobTitle: "Full Stack Engineer & AI Integration Specialist",
    description:
      "Full stack engineer with 20 years of experience specializing in Next.js, AI integration, AEO optimization, and cloud analytics.",
    email: "davedvst@gmail.com",
    image: "https://daventertainment.com/Daventertainment-logo.png",
    sameAs: [
      "https://github.com/Dcoxmen",
      "https://www.linkedin.com/in/david-cox-78b88b44/",
    ],
    knowsAbout: [
      "Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Redis",
      "AI Integration", "LangChain", "Anthropic Claude", "LLM Fine-tuning",
      "RAG Pipelines", "SEO", "AEO", "GCP", "BigQuery", "Looker Studio", "Docker",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Daventertainment Inc",
      url: "https://daventertainment.com",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Daventertainment Inc",
    url: "https://daventertainment.com",
    logo: "https://daventertainment.com/Daventertainment-logo.png",
    founder: { "@type": "Person", name: "David Cox" },
    description:
      "Full stack engineering and AI integration services. Specializing in Next.js, TypeScript, AI pipelines, and cloud analytics.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "davedvst@gmail.com",
      contactType: "Business Inquiries",
    },
    sameAs: [
      "https://github.com/Dcoxmen",
      "https://www.linkedin.com/in/david-cox-78b88b44/",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Daventertainment Inc — Engineering & AI Services",
    url: "https://daventertainment.com",
    description:
      "Contract and full-time full stack engineering and AI integration consulting services.",
    provider: { "@type": "Person", name: "David Cox" },
    serviceType: [
      "Full Stack Engineering",
      "AI Integration",
      "AEO Optimization",
      "SEO Engineering",
      "Cloud Analytics",
      "Next.js Development",
    ],
    areaServed: "Worldwide",
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: "https://daventertainment.com/#contact",
    },
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Anti-flash: apply saved theme before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('theme')==='light')document.documentElement.classList.add('light')}catch(e){}`,
          }}
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
