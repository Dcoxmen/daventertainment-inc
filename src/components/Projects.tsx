interface Tag {
  label: string;
  color: string;
}

interface Metric {
  label: string;
  value: string;
  unit: string;
  valueColor: string;
  bar?: { color: string; width: string };
  dots?: boolean;
}

interface Project {
  title: string;
  description: string;
  url?: string;
  tags: Tag[];
  metric: Metric;
}

const PROJECTS: Project[] = [
  {
    title: "Conversational Analytics Engine",
    description:
      "A GCP-powered analytics environment connecting BigQuery and Looker Studio to transform GA4 data into real-time conversational dashboards, eliminating manual reporting across the organization.",
    tags: [
      { label: "GCP", color: "bg-primary/10 text-primary border-primary/20" },
      { label: "BigQuery", color: "bg-secondary/10 text-secondary border-secondary/20" },
      { label: "Looker Studio", color: "bg-tertiary/10 text-tertiary border-tertiary/20" },
      { label: "GA4", color: "bg-white/5 text-on-surface-variant border-white/10" },
    ],
    metric: {
      label: "Pipeline Efficiency",
      value: "85%",
      unit: "Report Automation",
      valueColor: "text-primary",
      bar: { color: "bg-primary", width: "85%" },
    },
  },
  {
    title: "PageScore — AI SEO & AEO Audit Engine",
    description:
      "An AI-powered landing page evaluator that delivers precise technical SEO and AEO audit reports with actionable recommendations to improve search and AI engine visibility.",
    url: "https://page-score.com",
    tags: [
      { label: "Next.js", color: "bg-primary/10 text-primary border-primary/20" },
      { label: "TypeScript", color: "bg-secondary/10 text-secondary border-secondary/20" },
      { label: "Anthropic", color: "bg-tertiary/10 text-tertiary border-tertiary/20" },
      { label: "React", color: "bg-white/5 text-on-surface-variant border-white/10" },
    ],
    metric: {
      label: "Scale Reach",
      value: "10k+",
      unit: "Active Users",
      valueColor: "text-secondary",
      dots: true,
    },
  },
  {
    title: "Smart UX Frameworks",
    description:
      "A suite of adaptive UI components that utilize client-side AI to evolve layouts and interactions based on individual user behavior patterns.",
    tags: [
      { label: "React", color: "bg-tertiary/10 text-tertiary border-tertiary/20" },
      { label: "Tailwind", color: "bg-primary/10 text-primary border-primary/20" },
      { label: "TensorFlow.js", color: "bg-secondary/10 text-secondary border-secondary/20" },
      { label: "Vite", color: "bg-white/5 text-on-surface-variant border-white/10" },
    ],
    metric: {
      label: "Performance",
      value: "12ms",
      unit: "Inference Latency",
      valueColor: "text-tertiary",
      bar: { color: "bg-tertiary", width: "85%" },
    },
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-section-gap">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-code-label text-code-label text-secondary uppercase tracking-widest">
              Active Repository
            </span>
          </div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">
            Integrated AI <span className="text-primary">Solutions</span>
          </h2>
          <p className="max-w-2xl mx-auto text-on-surface-variant font-body-lg text-body-lg">
            Building smarter digital products through seamless AI integration,
            modern web architectures, and user-centric engineering.
          </p>
        </div>

        {/* Project cards */}
        <div className="max-w-4xl mx-auto flex flex-col gap-gutter">
          {PROJECTS.map((project) => (
            <article
              key={project.title}
              className="glass-card rounded-xl overflow-hidden group transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_0_40px_rgba(208,188,255,0.05)]"
            >
              {/* Image placeholder — replace with real screenshots when ready */}
              <div className="relative h-48 md:h-64 w-full overflow-hidden bg-surface-container-low">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-6xl text-on-surface-variant/20">
                    image
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-3">
                      {project.title}
                    </h3>
                    <p className="text-on-surface-variant font-body-md mb-4 leading-relaxed">
                      {project.description}
                    </p>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-secondary font-code-label text-code-label hover:text-primary transition-colors mb-6"
                      >
                        {project.url.replace("https://", "")}
                        <span className="material-symbols-outlined text-base">arrow_outward</span>
                      </a>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag.label}
                          className={`font-code-label text-code-label px-3 py-1 rounded-full border ${tag.color}`}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metric card */}
                  <div className="md:w-48 bg-surface-container-high rounded-xl p-4 border border-white/5 glow-violet flex-shrink-0">
                    <p
                      className="text-on-surface-variant font-code-label uppercase tracking-tighter mb-1"
                      style={{ fontSize: "10px" }}
                    >
                      {project.metric.label}
                    </p>
                    <p
                      className={`font-headline-md text-headline-md mb-1 ${project.metric.valueColor}`}
                    >
                      {project.metric.value}
                    </p>
                    <p className="text-on-surface font-body-md text-sm">
                      {project.metric.unit}
                    </p>
                    {project.metric.bar && (
                      <div className="w-full bg-white/5 h-1 mt-3 rounded-full overflow-hidden">
                        <div
                          className={`${project.metric.bar.color} h-full`}
                          style={{ width: project.metric.bar.width }}
                        />
                      </div>
                    )}
                    {project.metric.dots && (
                      <div className="flex gap-1 mt-3">
                        <div className="w-2 h-2 rounded-full bg-secondary animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:75ms]" />
                        <div className="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:150ms]" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
