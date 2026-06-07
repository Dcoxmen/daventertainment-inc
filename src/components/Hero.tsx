const TECH_STACK = [
  "Next.js",
  "PyTorch",
  "TypeScript",
  "PostgreSQL",
  "LLM Fine-tuning",
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-12 md:pt-24 pb-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* ── Left content ── */}
        <div className="lg:col-span-7 space-y-8">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            <span className="font-code-label text-code-label">
              SYSTEMS_ACTIVE_V2.0.4
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-display font-display text-on-surface leading-tight">
            Crafting the{" "}
            <span className="text-primary">Future</span> of the{" "}
            <span className="text-secondary">Internet</span>
          </h1>

          {/* Bio card */}
          <div className="glass-card p-gutter rounded-2xl relative overflow-hidden group">
            <div className="absolute inset-0 shimmer-bg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed relative z-10">
              Engineering the digital frontier as a{" "}
              <span className="text-primary font-semibold">
                Modern Web Architect &amp; AI Integrator
              </span>
              . Over 20 years building high-performance web ecosystems that
              leverage artificial intelligence to deliver superior user
              experiences. From fluid interfaces to intelligent backends, I
              build the bridges between human intent and digital excellence.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <a
              href="#projects"
              className="px-8 py-4 bg-primary text-on-primary rounded-xl font-button text-button shadow-[0_0_40px_rgba(208,188,255,0.15)] hover:scale-105 active:scale-95 transition-all"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="px-8 py-4 bg-transparent border border-white/10 backdrop-blur-md text-on-surface rounded-xl font-button text-button hover:bg-white/5 active:scale-95 transition-all flex items-center gap-2"
            >
              Hire Me
              <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>

          {/* Tech stack chips */}
          <div className="flex flex-wrap gap-3 pt-2">
            {TECH_STACK.map((tech) => (
              <div
                key={tech}
                className="px-3 py-1 rounded-lg bg-surface-container-high border border-outline-variant/30 font-code-label text-code-label text-on-surface-variant"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>

        {/* ── Right bento grid ── */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4 mt-8 lg:mt-0">
          {/* Main visual */}
          <div className="col-span-2 glass-card rounded-2xl p-6 flex flex-col justify-end relative overflow-hidden border-t border-l border-white/20 min-h-[200px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-surface-container to-secondary/5" />
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
              <div className="w-44 h-44 rounded-full border border-primary/30 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full border border-secondary/30 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-3xl">
                      hub
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative z-10">
              <span className="text-secondary font-code-label text-code-label mb-2 block">
                Neural Service
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface">
                GPT-Nexus Core
              </h3>
            </div>
          </div>

          {/* Stat — uptime */}
          <div className="glass-card rounded-2xl p-6 flex flex-col justify-between aspect-square border-t border-l border-white/20">
            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">
                analytics
              </span>
            </div>
            <div>
              <div className="font-headline-md text-headline-md text-primary">
                99.8%
              </div>
              <div
                className="text-on-surface-variant font-code-label"
                style={{ fontSize: "12px" }}
              >
                UPTIME_STABILITY
              </div>
            </div>
          </div>

          {/* Stat — lines */}
          <div className="glass-card rounded-2xl p-6 flex flex-col justify-between aspect-square border-t border-l border-white/20">
            <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary">
                code_blocks
              </span>
            </div>
            <div>
              <div className="font-headline-md text-headline-md text-secondary">
                1.2M
              </div>
              <div
                className="text-on-surface-variant font-code-label"
                style={{ fontSize: "12px" }}
              >
                LINES_COMMITTED
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background glow decorations */}
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -left-24 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
}
