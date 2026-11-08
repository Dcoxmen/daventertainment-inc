import Link from "next/link";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mesh-gradient flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-container-max flex-1 px-4 pt-28 pb-20 md:px-12 md:pt-36">
        {children}
      </main>
      <footer className="border-t border-white/5 px-4 py-8 md:px-12">
        <div className="mx-auto flex max-w-container-max flex-wrap items-center justify-between gap-4 font-code-label text-[13px] text-on-surface-variant">
          <p>© {new Date().getFullYear()} Daventertainment Inc. David Cox</p>
          <div className="flex gap-5">
            <a href="https://github.com/Dcoxmen?tab=repositories" className="hover:text-primary">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/david-cox-78b88b44/" className="hover:text-primary">
              LinkedIn
            </a>
            <Link href="/contact" className="hover:text-primary">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
