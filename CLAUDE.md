@AGENTS.md

# Portfolio — Daventertainment Inc

## Project Goal

Build a high-quality, high-converting, artistically designed professional portfolio for **Daventertainment Inc** that serves two audiences:
1. **Job recruiters** — evaluating the owner for full-time or contract roles
2. **Clients** — evaluating Daventertainment Inc for contract/freelance work

The portfolio must feel premium, creative, and professional — not a generic template.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16.2.7 (App Router) |
| UI | React 19.2.4 |
| Styling | Tailwind CSS v4 |
| Language | TypeScript |
| Fonts | Sora (display/headlines), Inter (body), JetBrains Mono (code labels) |

> **IMPORTANT:** This is Next.js 16 — a version with breaking changes from prior releases. Always read `node_modules/next/dist/docs/` before writing code. Never assume behavior matches training-data knowledge of Next.js 13/14/15.

---

## Deployment Target — Netlify

- **Host:** Netlify (NOT Vercel)
- User has an **existing Daventertainment Inc site on Netlify** that this build will replace
- Next.js on Netlify requires the `@netlify/plugin-nextjs` adapter
- Add a `netlify.toml` at project root to configure build settings
- The existing Netlify site should be re-linked to this repo (or the repo pushed and connected manually)

### Netlify config needed (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

## Design System (implemented)

### Color palette
> Colors derived from the Daventertainment Inc logo (blue/crimson/gold circle badge)

- **Background:** `#0b1326` (near-black navy)
- **Primary:** `#d4b06a` (warm gold — logo cream/gold text)
- **Secondary:** `#6d9cf0` (royal blue — logo upper half, brightened for dark mode)
- **Tertiary:** `#e57888` (crimson — logo lower half, lightened for dark mode)
- **on-primary:** `#1a0d00` (dark brown — text on gold-background buttons)
- **on-secondary:** `#001233` (dark navy — text on blue-background buttons)
- **on-tertiary:** `#330010` (dark crimson — text on crimson-background buttons)
- Full Material Design 3 token set defined in `globals.css` via `@theme inline`

### Typography
- **Sora** — display, all headlines, buttons (`--font-sora` via next/font)
- **Inter** — body text (`--font-inter` via next/font)
- **JetBrains Mono** — code labels, nav items, badges (`--font-jetbrains-mono` via next/font)
- **Material Symbols Outlined** — icons (loaded via Google Fonts `<link>` in layout.tsx)

### Custom CSS utilities (in `globals.css`)
- `.glass-card` — frosted glass card effect
- `.mesh-gradient` — gold/blue radial gradient background
- `.glass-input` — dark frosted form input
- `.glow-violet` — gold drop shadow (class name kept, color updated to match primary gold)
- `.shimmer-bg` — animated shimmer on hover

### Nav labels (section IDs)
| Nav label | Section ID | Content |
|-----------|-----------|---------|
| Nexus | `#home` | Hero |
| Forge | `#projects` | Projects |
| Labs | `#services` | Services |
| Signal | `#contact` | Contact |

### Nav logo
- `public/Daventertainment-logo.png` — 40×40px, rendered via Next.js `<Image>` in `Nav.tsx`
- Replaced the "D" letter circle placeholder as of 2026-06-07

---

## Current File Structure

```
src/
  app/
    layout.tsx      — Sora/Inter/JetBrains Mono fonts, metadata, Material Symbols link
    page.tsx        — single-page scroll, assembles all components
    globals.css     — full Tailwind v4 @theme + custom utilities
  components/
    Nav.tsx         — sticky top nav (desktop) + fixed bottom nav (mobile), client component
    Hero.tsx        — Nexus section: headline, bio card, CTAs, bento grid
    Projects.tsx    — Forge section: 3 project cards with metric callouts
    Services.tsx    — Labs section: 6 service cards in 2 columns + CTA strip
    Contact.tsx     — Signal section: channel links + contact form, client component
public/             — static assets (project screenshots go here)
```

---

## Owner / Brand Info

- **Name:** David Cox
- **Company:** Daventertainment Inc
- **Email:** davedvst@gmail.com
- **GitHub:** https://github.com/Dcoxmen?tab=repositories
- **LinkedIn:** https://www.linkedin.com/in/david-cox-78b88b44/

### Bio summary (from user draft)
- 20 years of full-stack experience
- Specializes in Next.js, AI integration, and SEO/AEO
- Recently built a gamified SaaS platform for a national logistics company that scaled to nationwide use and drove corporate revenue
- Targets: SaaS companies, contract clients, recruiter-facing job applications

### Tech stack to highlight
- **Frontend:** Next.js, React, TypeScript, TailwindCSS
- **Backend:** Node.js, NestJS, PostgreSQL, Redis
- **AI/ML:** LangChain, Anthropic (Claude), PyTorch, HuggingFace, LLM Fine-tuning, RAG Pipelines, LlamaIndex, Pinecone
- **DevOps:** AWS/GCP, Kubernetes, Docker, Terraform

---

## Projects (currently in Forge section)

| Project | Metric | Tags |
|---------|--------|------|
| Conversational Analytics Engine ✅ real | 85% Report Automation | GCP, BigQuery, Looker Studio, GA4 |
| PageScore — AI SEO & AEO Audit Engine ✅ real | 10k+ Active Users | Next.js, TypeScript, Anthropic, React |
| Smart UX Frameworks ⚠️ placeholder | 12ms Inference Latency | React, Tailwind, TensorFlow.js, Vite |

> Card 3 is still placeholder — user to confirm what real project to substitute.
> Project images: card 2 (PageScore) has a real screenshot (`project-pagescore.png`). Cards 1 and 3 still show placeholder divs.
> To add an image to a card: drop PNG into `public/`, add `image: "/filename.png"` to its object in `PROJECTS[]` in `Projects.tsx`. The `<Image>` component and conditional render are already wired up.

---

## Services (currently in Labs section)

**Full Stack Engineering:**
- Advanced React Systems (TypeScript, TailwindCSS, Redux Toolkit)
- Scalable Node.js APIs (NestJS, PostgreSQL, Redis)
- Cloud Architecture (Kubernetes, Docker, Terraform)

**AI Integration:**
- AEO Optimization (Anthropic, Structured Data, Next.js)
- AI-Powered Web Analysis (Anthropic, TypeScript, Next.js)
- Autonomous AI Agents (LangChain, Anthropic, Python)

> Full Stack card 3 updated: "Cloud Architecture" → "Cloud & Analytics Infrastructure" (GCP, BigQuery, Looker Studio)

---

## Key Conventions

- Use **App Router** (`src/app/`) — no Pages Router
- Keep components in `src/components/`
- Images go in `public/` and are served via Next.js `<Image>` component
- Tailwind v4 — utility-first, `@theme inline` in `globals.css` (no `tailwind.config.js`)
- `'use client'` only where needed: Nav (IntersectionObserver), Contact (form state)
- TypeScript strict mode is on — zero errors as of current build
- Single-page scroll layout with anchor-based nav

---

## Session Log

- **2026-06-06** — v1 built and deployed. Full site live on Netlify. All 4 sections complete. Copy approved. Anchor IDs updated to standard names for SEO.
- **2026-06-07 (AM)** — Content accuracy pass:
  - Project card 2 → **PageScore — AI SEO & AEO Audit Engine** (page-score.com, live link added)
  - Hero bento card → **Gamified Sales Engine** (real logistics SaaS achievement)
  - All 3 AI Integration service cards replaced → AEO Optimization / AI-Powered Web Analysis / Autonomous AI Agents
- **2026-06-07 (PM)** — Brand color scheme + logo:
  - Color palette updated from violet/cyan/orange → **gold/royal-blue/crimson** to match Daventertainment Inc logo
  - Nav logo: replaced "D" letter circle with `public/Daventertainment-logo.png` via Next.js `<Image>`

## Contact Form — Implementation Notes

- **Service:** formsubmit.co (free, no account needed)
- **Why not Netlify Forms:** Netlify Forms AJAX submissions are intercepted before reaching Next.js, but `@netlify/plugin-nextjs` routes all paths through the SSR function first — the form handler never fires. Traditional HTML-only forms would work but require a page reload.
- **How it works:** `Contact.tsx` POSTs JSON to `https://formsubmit.co/ajax/davedvst@gmail.com`. First submission requires a one-time email activation — already completed and live.
- `public/netlify-form.html` can be left in place or removed — it's no longer used.

## Next Session — Pick Up Here

- [ ] **Project card 3** — "Smart UX Frameworks" is still placeholder content. Ask user what real project to replace it with.
- [ ] **Project screenshots** — cards 1 and 3 still need real images. Drop into `public/` as `project-analytics.png` and `project-ux-frameworks.png` (or whatever card 3 becomes), then add `image: "/filename.png"` to each project object in `Projects.tsx`.
- [ ] **Any additional polish** — animations, further copy tweaks, new sections if needed

---

## Deployment — Netlify

### Process (in order)
1. **Remove old site** — user must disconnect or delete the existing Daventertainment Inc site in the Netlify dashboard before connecting the new repo, to avoid conflicts
2. **Install adapter** — `npm install @netlify/plugin-nextjs`
3. **Add `netlify.toml`** at project root:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```
4. **Push repo to GitHub** — the project needs to be in a GitHub repo for Netlify to connect to it
5. **Connect in Netlify** — New site → Import from GitHub → select this repo → Netlify auto-detects the plugin and deploys

### Status
- [x] Old site removed from Netlify
- [x] `@netlify/plugin-nextjs` installed
- [x] `netlify.toml` added
- [x] Repo pushed to GitHub
- [x] New site connected in Netlify dashboard
- [x] Custom domain `daventertainment.com` transferred to new site
- [x] `www.daventertainment.com` redirecting to primary domain
- [x] Force HTTPS enabled
- [x] **LIVE AND WORKING** — deployed to Netlify as of 2026-06-06
