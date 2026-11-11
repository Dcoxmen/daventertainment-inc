// The home page story. Each era is one scroll chapter; the badge state for
// each id lives in src/components/experience/keyframes.ts.

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
    body: "Weekends, I was on the water, DJing and playing harbor cruise parties across Los Angeles and Orange County, and eventually running entertainment for one of the yacht companies. Weekdays, I was learning HTML, JavaScript, PHP, and databases and taking my first web jobs. Both crafts demanded one instinct: read the room.",
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
    body: "A former bandmate and I started a music publishing venture, writing, producing, registering, and distributing our own catalog. Selling it online meant learning e-commerce, payment gateways, PHP, and Node.js. It's also where we started building the new apps that would launch my full stack career.",
    skills: ["PHP", "Node.js", "E-commerce", "Payment gateways", "Music production"],
    accent: "primary",
  },
  {
    id: "seal",
    year: "2016",
    title: "The Seal",
    body: "I incorporated Daventertainment Inc as an entertainment and web development company. That's when a large logistics company contracted us for ongoing development, liked the system connectors we built for their clients, and they put our sales app in front of their sales team for testing.",
    skills: ["System integrations", "APIs", "Sales apps"],
    accent: "primary",
  },
  {
    id: "scale",
    year: "2018",
    title: "The Scale",
    body: "The sales app went national, adopted by the company's sales force, and I earned a position inside the enterprise. There I learned to ship with large teams and real process. I also joined the UC Irvine coding bootcamp program, where I'd later help teach. Began studying AI.",
    skills: ["SCRUM", "Jira", "GitHub", "Node.js", "Python", "APIs"],
    accent: "secondary",
  },
  {
    id: "intelligence",
    year: "2021",
    title: "The Intelligence",
    body: "Started my current job position, and have implemented AI from experiment to everyday tool. I build customer facing and B2B applications, wire AI agents, LLMs, and RAG, automate database operations and integrate them into real commerce workflows, and connect platforms like Shopify, BigCommerce, HubSpot, and Google Cloud.",
    skills: ["AI agents", "Claude", "LLMs", "RAG", "Next.js", "Google Cloud", "Shopify", "NetSuite"],
    accent: "secondary",
  },
  {
    id: "creator",
    year: "Now",
    title: "The Creator",
    body: "Today driven by curiosity and creativity. I build my own apps, make daily art, and produce music, coding alongside AI agents and curating the knowledge they work from. It's the same instinct I learned developing software and performing music: read the room, then deliver.",
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
