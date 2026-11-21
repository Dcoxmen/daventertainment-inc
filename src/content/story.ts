// The home page story. Each era is one scroll chapter; the badge state for
// each id lives in src/components/experience/keyframes.ts.

// Replace with your own loop (WAV or MP3, 60–90 seconds, seamless).
export const THEME_TRACK = "/audio/soul-swellin-loop-30sec.mp3";

export type Era = {
  id: string;
  year: string;
  title: string;
  /** One line that carries the story; read in order, the hooks tell the whole arc. */
  hook: string;
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
    hook: "Before I wrote code, I programmed sound.",
    body: "It started in the studio. Programming synthesizers and DAW recording rigs taught me to think in sequences, signals, and systems. Promoting my bands' gigs pulled that curiosity online, into digital video, web design, and my first lines of code.",
    skills: ["Synth programming", "DAW recording", "Digital video", "Web design"],
    accent: "secondary",
  },
  {
    id: "harbor",
    year: "2000",
    title: "The Practice",
    hook: "Two stages: the decks on weekends, the browser on weekdays.",
    body: "Weekends, I was on the water, DJing and playing harbor cruise parties across Los Angeles and Orange County, and eventually running entertainment for one of the yacht companies. Weekdays, I learned HTML, JavaScript, PHP, and databases and took my first web jobs. Both crafts ran on one instinct: create quality work, consistently.",
    skills: ["HTML", "JavaScript", "Databases", "Live production"],
    accent: "tertiary",
  },
  {
    id: "contracts",
    year: "2005",
    title: "The Contracts",
    hook: "Every contract raised the bar, and I learned to clear it every time.",
    body: "Temp contracts became a steady run of web and SaaS projects, for clients from large marketing firms to small, fast-moving teams. Each one meant a new codebase, a new deadline, and a new way of working, so I learned to ramp up fast and deliver. Each job was a lesson in adaptability.",
    skills: ["Web development", "SaaS", "Client delivery"],
    accent: "secondary",
  },
  {
    id: "label",
    year: "2010",
    title: "The Label",
    hook: "The music business taught me the business of software.",
    body: "A former bandmate and I started a music publishing venture, writing, producing, registering, and distributing our own catalog. Selling it online meant learning e-commerce, payment gateways, PHP, and Node.js. It's also what led me to start building a sales app, the project that would expand my full stack experience.",
    skills: ["PHP", "Node.js", "E-commerce", "Payment gateways", "Music production"],
    accent: "primary",
  },
  {
    id: "seal",
    year: "2016",
    title: "The Seal",
    hook: "I made it official, and a national client took notice.",
    body: "I incorporated Daventertainment Inc as a sound design and web development company. A large logistics company brought me on for ongoing development, liked the system connectors I built for its clients, and they put a sales app I developed in front of its sales team for testing.",
    skills: ["System integrations", "APIs", "Sales apps"],
    accent: "primary",
  },
  {
    id: "scale",
    year: "2018",
    title: "The Scale",
    hook: "One test team became a national sales force.",
    body: "The sales app went national, adopted by the company's sales force, and I earned a position inside the enterprise. There I learned to ship with large teams and real process. I also joined the UC Irvine coding bootcamp program, where I'd later help teach, and began studying AI.",
    skills: ["SCRUM", "Jira", "GitHub", "Node.js", "Python", "APIs"],
    accent: "secondary",
  },
  {
    id: "intelligence",
    year: "2021",
    title: "The Intelligence",
    hook: "The tools started thinking. I put them to work.",
    body: "In my current role, I've taken AI from experiment to everyday tool. I build customer facing and B2B applications, wire up AI agents, LLMs, and RAG, automate database operations, and connect it all to real commerce through Shopify, BigCommerce, HubSpot, NetSuite, and Google Cloud.",
    skills: ["AI agents", "Claude", "LLMs", "RAG", "Next.js", "Google Cloud", "Shopify", "NetSuite"],
    accent: "secondary",
  },
  {
    id: "creator",
    year: "Now",
    title: "The Creator",
    hook: "Same instinct, new instruments.",
    body: "Today I build for curiosity as much as for clients: my own apps, daily art, and music, coding alongside AI agents and curating the knowledge they work from. It's what the studio and software development taught me, to create quality work consistently.",
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
