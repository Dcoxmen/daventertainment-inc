interface ServiceCard {
  icon: string;
  badge: string;
  title: string;
  description: string;
  tags: string[];
  accentColor: "primary" | "secondary";
}

const FULLSTACK: ServiceCard[] = [
  {
    icon: "east",
    badge: "CORE",
    title: "Advanced React Systems",
    description:
      "Building high-performance, scalable web applications with Next.js, TypeScript, and state management architectures that endure.",
    tags: ["TypeScript", "TailwindCSS", "Redux Toolkit"],
    accentColor: "primary",
  },
  {
    icon: "dns",
    badge: "BACKEND",
    title: "Scalable Node.js APIs",
    description:
      "Designing event-driven microservices and RESTful/GraphQL APIs optimized for high throughput and low latency.",
    tags: ["NestJS", "PostgreSQL", "Redis"],
    accentColor: "primary",
  },
  {
    icon: "cloud",
    badge: "DEVOPS",
    title: "Cloud Architecture",
    description:
      "Architecting resilient infrastructure on AWS/GCP with Infrastructure as Code (Terraform) and CI/CD automation.",
    tags: ["Kubernetes", "Docker", "Terraform"],
    accentColor: "primary",
  },
];

const AI_SERVICES: ServiceCard[] = [
  {
    icon: "smart_toy",
    badge: "NLP",
    title: "LLM Fine-tuning",
    description:
      "Customizing Large Language Models for domain-specific tasks using PEFT/LoRA techniques and high-quality synthetic data.",
    tags: ["PyTorch", "HuggingFace", "Python"],
    accentColor: "secondary",
  },
  {
    icon: "hub",
    badge: "RAG",
    title: "RAG Pipelines",
    description:
      "Developing Retrieval-Augmented Generation systems with vector databases for context-aware, hallucination-free AI responses.",
    tags: ["Pinecone", "LangChain", "LlamaIndex"],
    accentColor: "secondary",
  },
  {
    icon: "visibility",
    badge: "CV",
    title: "Computer Vision",
    description:
      "Implementing object detection, image segmentation, and real-time visual analysis pipelines for automated inspection.",
    tags: ["OpenCV", "YOLOv8", "TensorFlow"],
    accentColor: "secondary",
  },
];

function ServiceCardBlock({ card }: { card: ServiceCard }) {
  const isPrimary = card.accentColor === "primary";
  const accent = isPrimary ? "text-primary" : "text-secondary";
  const badgeBorder = isPrimary ? "border-primary/20 text-primary/60" : "border-secondary/20 text-secondary/60";
  const tagBg = "bg-surface-container-highest border-white/5";

  return (
    <div className="glass-card p-gutter rounded-2xl transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(208,188,255,0.08)]">
      <div className="flex justify-between items-start mb-6">
        <span className={`material-symbols-outlined text-3xl ${accent}`}>
          {card.icon}
        </span>
        <span
          className={`font-code-label border px-2 py-0.5 rounded ${badgeBorder}`}
          style={{ fontSize: "12px" }}
        >
          {card.badge}
        </span>
      </div>
      <h3 className={`font-headline-md text-headline-md mb-3 ${accent}`}>
        {card.title}
      </h3>
      <p className="font-body-md text-body-md text-on-surface-variant mb-6">
        {card.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {card.tags.map((tag) => (
          <span
            key={tag}
            className={`font-code-label text-code-label ${tagBg} px-3 py-1 rounded-lg border`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="py-section-gap">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-code-label text-code-label text-secondary uppercase tracking-widest">
              Available for Architecture
            </span>
          </div>
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">
            Architecting <span className="text-primary">Reliability</span>{" "}
            Through Intelligent <span className="text-secondary">Code</span>
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Bridging the gap between robust Full Stack Engineering and
            cutting-edge AI Integration to build the systems of tomorrow.
          </p>
        </div>

        {/* Two-column services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter items-start">
          {/* Full Stack column */}
          <div className="space-y-gutter">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">
                  layers
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Full Stack Engineering
              </h2>
            </div>
            {FULLSTACK.map((card) => (
              <ServiceCardBlock key={card.title} card={card} />
            ))}
          </div>

          {/* AI Integration column — offset on desktop */}
          <div className="space-y-gutter md:mt-24">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary">
                  psychology
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface">
                AI Integration
              </h2>
            </div>
            {AI_SERVICES.map((card) => (
              <ServiceCardBlock key={card.title} card={card} />
            ))}
          </div>
        </div>

        {/* CTA strip */}
        <div className="mt-32 mb-8">
          <div className="relative glass-card p-12 md:p-20 rounded-[2rem] text-center overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface mb-6 relative z-10">
              Ready to build the{" "}
              <span className="text-primary">extraordinary</span>?
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto mb-10 relative z-10">
              Let&apos;s discuss how my unique blend of engineering discipline and
              AI expertise can accelerate your technical roadmap.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <a
                href="#contact"
                className="px-8 py-4 bg-primary text-on-primary font-button text-button rounded-xl shadow-[0_0_40px_rgba(208,188,255,0.2)] hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">calendar_today</span>
                Book a Consultation
              </a>
              <a
                href="https://github.com/Dcoxmen?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-transparent border border-white/10 backdrop-blur-md text-on-surface font-button text-button rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2"
              >
                View Repository
                <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
