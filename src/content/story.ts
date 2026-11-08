// The home page story. Each era is one scroll chapter; the badge state for
// each id lives in src/components/experience/keyframes.ts.

// Replace with your own loop (WAV or MP3, 60–90 seconds, seamless).
export const THEME_TRACK = "/audio/theme-placeholder.mp3";

export type Era = {
  id: string;
  year: string;
  title: string;
  body: string;
  skills: string[];
  accent: "primary" | "secondary" | "tertiary";
  links?: { label: string; href: string }[];
};

export const ERAS: Era[] = [
  {
    id: "code",
    year: "1997",
    title: "The Code",
    body: "It started with synthesizers. Programming synths and DAW recording systems while promoting my bands and gigs pulled me into code, digital video, and internet design.",
    skills: ["Synth programming", "DAW recording", "Digital video", "Web design"],
    accent: "secondary",
  },
  {
    id: "harbor",
    year: "2000",
    title: "The Harbor",
    body: "Weekends meant DJ and live music gigs for party yacht companies across Los Angeles and Orange County, including managing entertainment for one of them. Weekdays meant HTML, JavaScript, databases, and my first web development gigs.",
    skills: ["HTML", "JavaScript", "Databases", "Live production"],
    accent: "tertiary",
  },
  {
    id: "contracts",
    year: "2005",
    title: "The Contracts",
    body: "Temp agency contracts became steady web and SaaS development work, for everyone from large marketing firms to small, nimble teams. Every company taught me a new technique.",
    skills: ["Web development", "SaaS", "Client delivery"],
    accent: "secondary",
  },
  {
    id: "label",
    year: "2010",
    title: "The Label",
    body: "A former bandmate and I launched a music publishing venture: creating, producing, registering, and distributing music. Selling it taught me e-commerce and payment gateways, and it's where we began building the sales app that started my full stack career.",
    skills: ["PHP", "Node.js", "E-commerce", "Payment gateways", "Music production"],
    accent: "primary",
  },
  {
    id: "seal",
    year: "2016",
    title: "The Seal",
    body: "Daventertainment Inc was established as an entertainment and web development company. A large logistics company brought us on for regular development, liked the system connector apps we built for their clients, and began testing our sales app.",
    skills: ["System integrations", "APIs", "Sales apps"],
    accent: "primary",
  },
  {
    id: "scale",
    year: "2018",
    title: "The Scale",
    body: "The sales app rolled out to the national sales team, and the company offered us positions. I learned to ship in enterprise environments with large teams, joined the UC Irvine coding bootcamp I would later teach for, and started learning AI development.",
    skills: ["SCRUM", "Jira", "GitHub", "Node.js", "Python", "APIs"],
    accent: "secondary",
  },
  {
    id: "intelligence",
    year: "2021",
    title: "The Intelligence",
    body: "At The Joy Factory, I build customer and B2B applications, integrate AI, and shape marketing workflows, working daily with AI agents, LLMs, and RAG across modern commerce platforms.",
    skills: ["AI agents", "Claude", "LLMs", "RAG", "Next.js", "Google Cloud", "Shopify", "NetSuite"],
    accent: "secondary",
  },
  {
    id: "creator",
    year: "Now",
    title: "The Creator",
    body: "I keep building my own apps, art, and music to stay sharp and current, coding alongside AI agents and refining the knowledge they work from.",
    skills: ["AI agents", "Agent knowledge", "Apps", "Art", "Music"],
    accent: "primary",
    links: [
      { label: "Apps", href: "/work" },
      { label: "Music", href: "/music" },
      { label: "Art", href: "/art" },
      { label: "Videos", href: "/videos" },
    ],
  },
];
