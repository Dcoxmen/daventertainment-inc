import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <div className="bg-background text-on-background min-h-screen mesh-gradient overflow-x-hidden">
      <Nav />
      <main>
        <Hero />
        <Projects />
        <Services />
        <Contact />
      </main>
      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center">
        <p className="font-code-label text-code-label text-on-surface-variant/40">
          © 2025 Daventertainment Inc — David Cox
        </p>
      </footer>
      {/* Spacer for mobile bottom nav */}
      <div className="h-24 md:hidden" />
    </div>
  );
}
