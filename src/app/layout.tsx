import type { Metadata } from "next";
import localFont from "next/font/local";
import SiteHeader from "@/components/SiteHeader";
import PlayerProvider from "@/components/player/PlayerProvider";
import MiniPlayer from "@/components/player/MiniPlayer";
import { SITE_GRAPH, jsonLd } from "@/content/schema";
import "./globals.css";

// Fonts are stored in the repo (latin variable files from Google Fonts) so
// builds never depend on downloading them from Google.
const sora = localFont({
  src: "./fonts/sora-latin.woff2",
  variable: "--font-sora",
  weight: "400 800",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  variable: "--font-inter",
  weight: "400 600",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "./fonts/jetbrains-mono-latin.woff2",
  variable: "--font-jetbrains-mono",
  weight: "400 500",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://daventertainment.com"),
  title: "David Cox | Full Stack Engineer & AI Integration Specialist | Daventertainment Inc",
  description:
    "David Cox is a Full Stack Engineer and AI Integration Specialist with over 20 years of experience building scalable SaaS platforms, Next.js applications, and AI-powered systems. Available for contract and full-time roles.",
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
      "Over 20 years building high-performance web ecosystems. Specializing in Next.js, AI integration, and SEO/AEO optimization. Available for contract and full-time roles.",
    url: "https://daventertainment.com",
    siteName: "Daventertainment Inc",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "David Cox | Full Stack Engineer & AI Integration Specialist",
    description:
      "Over 20 years building high-performance web ecosystems. Specializing in Next.js, AI integration, and SEO/AEO.",
  },
};

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(SITE_GRAPH)}
        />
      </head>
      <body className="min-h-screen antialiased">
        <PlayerProvider>
          <SiteHeader />
          {children}
          <MiniPlayer />
        </PlayerProvider>
      </body>
    </html>
  );
}
