// Structured data (JSON-LD) for search and AI answer engines. The site-wide graph
// links David, the company and the website by @id, so pages can refer to them
// (an app's author, the About page's subject) instead of repeating them.

export const SITE = "https://daventertainment.com";
export const PERSON_ID = `${SITE}/#david-cox`;
export const ORG_ID = `${SITE}/#organization`;
export const WEBSITE_ID = `${SITE}/#website`;

const SAME_AS = [
  "https://github.com/Dcoxmen",
  "https://www.linkedin.com/in/david-cox-78b88b44/",
  "https://www.youtube.com/channel/UCDCuScou1VMIOx7DCasa76g",
];

export const SITE_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: "David Cox",
      url: SITE,
      image: `${SITE}/headshot-avatar.webp`,
      jobTitle: "Full Stack Engineer & AI Integration Specialist",
      description:
        "Full stack engineer and AI integration specialist with over 20 years of experience building SaaS platforms, e-commerce systems, Next.js applications and AI-powered tools. Founder of Daventertainment Inc. Also a music producer, DJ and artist.",
      email: "davedvst@gmail.com",
      sameAs: SAME_AS,
      worksFor: { "@id": ORG_ID },
      homeLocation: {
        "@type": "Place",
        address: { "@type": "PostalAddress", addressLocality: "Tustin", addressRegion: "CA", addressCountry: "US" },
      },
      alumniOf: { "@type": "CollegeOrUniversity", name: "University of California, Irvine" },
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        name: "Full-Stack MERN Developer Certification",
        recognizedBy: { "@type": "CollegeOrUniversity", name: "University of California, Irvine" },
      },
      knowsAbout: [
        "Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Redis",
        "AI Integration", "AI Agents", "Large Language Models", "Anthropic Claude", "LangChain",
        "RAG Pipelines", "Answer Engine Optimization (AEO)", "Search Engine Optimization (SEO)",
        "E-commerce", "Shopify", "BigCommerce", "HubSpot", "NetSuite",
        "Google Cloud Platform", "BigQuery", "Looker Studio", "Docker",
        "Music production",
      ],
    },
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Daventertainment Inc",
      url: SITE,
      logo: `${SITE}/Daventertainment-logo.png`,
      foundingDate: "2016",
      founder: { "@id": PERSON_ID },
      description:
        "Sound design and web development company founded by David Cox: full stack engineering, AI integration, and original music, art and video.",
      contactPoint: {
        "@type": "ContactPoint",
        email: "davedvst@gmail.com",
        contactType: "Business Inquiries",
        url: `${SITE}/contact`,
      },
      sameAs: SAME_AS,
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE}/#services`,
      name: "Daventertainment Inc — Engineering & AI Services",
      url: SITE,
      description: "Contract and full-time full stack engineering and AI integration services.",
      provider: { "@id": PERSON_ID },
      parentOrganization: { "@id": ORG_ID },
      serviceType: [
        "Full Stack Engineering",
        "AI Integration",
        "AI Agents",
        "AEO Optimization",
        "SEO Engineering",
        "Cloud Analytics",
        "Next.js Development",
      ],
      areaServed: "Worldwide",
      availableChannel: { "@type": "ServiceChannel", serviceUrl: `${SITE}/contact` },
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE,
      name: "Daventertainment Inc",
      description: "Portfolio of David Cox: apps, AI integration, music, art and video.",
      publisher: { "@id": ORG_ID },
      author: { "@id": PERSON_ID },
      inLanguage: "en-US",
    },
  ],
};

/** Renders a JSON-LD script tag's contents safely (no closing </script> inside). */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
