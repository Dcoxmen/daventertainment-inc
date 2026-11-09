// The home page story. Each era is one scroll chapter; the badge state for
// each id lives in src/components/experience/keyframes.ts.

// Replace with your own loop (WAV or MP3, 60–90 seconds, seamless).
export const THEME_TRACK = "/audio/soul-swellin-loop-30sec.mp3";

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
    body: "It started in the studio. Programming synthesizers and DAW recording rigs taught me to think in sequences and signal flow. Promoting my bands' gigs carried that curiosity online, into code, digital video, and the early web.",
    skills: ["Synth programming", "DAW recording", "Digital video", "Web design"],
    accent: "secondary",
  },
  {
    id: "harbor",
    year: "2000",
    title: "The Harbor",
    body: "Weekends, I was on the water, DJing and playing yacht parties across Los Angeles and Orange County, and eventually running entertainment for one of the yacht companies. Weekdays, I was learning HTML, JavaScript, and databases and taking my first web jobs. Two crafts, one instinct: read the room.",
    skills: ["HTML", "JavaScript", "Databases", "Live production"],
    accent: "tertiary",
  },
  {
    id: "contracts",
    year: "2005",
    title: "The Contracts",
    body: "Temp contracts turned into a steady run of web and SaaS projects, from large marketing firms to small, fast-moving teams. Every client meant a new codebase, a new deadline, and a new way of working, and the weekends still belonged to music.",
    skills: ["Web development", "SaaS", "Client delivery"],
    accent: "secondary",
  },
  {
    id: "label",
    year: "2010",
    title: "The Label",
    body: "A former bandmate and I started a music publishing venture, writing, producing, registering, and distributing our own catalog. Selling it online meant learning e-commerce, payment gateways, PHP, and Node.js. It's also where we started building the sales app that would launch my full stack career.",
    skills: ["PHP", "Node.js", "E-commerce", "Payment gateways", "Music production"],
    accent: "primary",
  },
  {
    id: "seal",
    year: "2016",
    title: "The Seal",
    body: "I incorporated Daventertainment Inc as an entertainment and web development company. A large logistics company brought us on for ongoing development, liked the system connectors we built for their clients, and put our sales app in front of their sales team for testing.",
    skills: ["System integrations", "APIs", "Sales apps"],
    accent: "primary",
  },
  {
    id: "scale",
    year: "2018",
    title: "The Scale",
    body: "The sales app went national, adopted by the company's sales force, and it earned us positions inside the enterprise. There I learned to ship with large teams and real process. I also joined the UC Irvine coding bootcamp I'd later help teach, and started studying AI.",
    skills: ["SCRUM", "Jira", "GitHub", "Node.js", "Python", "APIs"],
    accent: "secondary",
  },
  {
    id: "intelligence",
    year: "2021",
    title: "The Intelligence",
    body: "At my current job position, AI went from experiment to everyday tool. I build customer and B2B applications, wire AI agents, LLMs, and RAG into real commerce workflows, and connect platforms like Shopify, BigCommerce, HubSpot, and NetSuite.",
    skills: ["AI agents", "Claude", "LLMs", "RAG", "Next.js", "Google Cloud", "Shopify", "NetSuite"],
    accent: "secondary",
  },
  {
    id: "creator",
    year: "Now",
    title: "The Creator",
    body: "Today the two threads run together. I build my own apps, make art, and produce music, coding alongside AI agents and curating the knowledge they work from. It's the same instinct I learned on those yacht decks: read the room, then play to it.",
    skills: ["AI agents", "Agent knowledge", "Apps", "Art", "Music", "Video"],
    accent: "primary",
    links: [
      { label: "Apps", href: "/work" },
      { label: "Music", href: "/music" },
      { label: "Art", href: "/art" },
      { label: "Videos", href: "/videos" },
    ],
  },
];
