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
- Full Material Design 3 token set defined in `globals.css`
- **IMPORTANT — Tailwind v4 theme split:** Colors use plain `@theme {}` (outputs CSS custom properties, allows runtime overrides). Fonts/sizes/spacing use `@theme inline {}` (baked at build time). This split is required for light/dark mode to work — do NOT move colors into `@theme inline`.

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
| About | `#home` | Hero |
| Projects | `#projects` | Projects |
| Services | `#services` | Services |
| Contact | `#contact` | Contact |

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
    Nav.tsx         — sticky top nav (desktop) + fixed bottom nav (mobile) + light/dark toggle, client component
    Hero.tsx        — About/home section: headline, bio card, CTAs, bento grid
    Projects.tsx    — Projects section: 3 project cards with metric callouts
    Services.tsx    — Services section: 6 service cards in 2 columns + CTA strip
    Contact.tsx     — Contact section: channel links + contact form, client component
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
> Project images: cards 1 (Conversational Analytics) and 2 (PageScore) have real screenshots. Card 3 still shows a placeholder div.
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
- Tailwind v4 — utility-first, split `@theme` in `globals.css` (no `tailwind.config.js`): fonts/sizes use `@theme inline`, colors use plain `@theme`
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
  - Nav "SSH_CONNECT" button: fixed broken `#signal` link → `#contact`
  - Contact form: switched from fake setTimeout → formsubmit.co AJAX (live, activated, delivering to davedvst@gmail.com)
  - Service card 3: "Cloud Architecture" → "Cloud & Analytics Infrastructure" (GCP, BigQuery, Looker Studio)
  - Project card 1: "Intelligent E-commerce Engine" → "Conversational Analytics Engine" (real GCP/BigQuery/GA4 project)
  - Project images: cards 1 and 2 now use real screenshots (`project-analytics.png`, `project-pagescore.png`)
- **2026-06-19** — Frontend improvements:
  - Nav labels renamed: Nexus/Forge/Labs/Signal → **About/Projects/Services/Contact** (SEO/AEO friendly)
  - AEO upgrades: full JSON-LD schemas (Person, Organization, ProfessionalService) added to `layout.tsx`; expanded metadata with OpenGraph, Twitter card, keywords
  - **Light/dark mode** added with toggle button (desktop nav + mobile bottom nav):
    - Anti-flash inline script in `<head>` applies saved theme before first paint
    - `localStorage` persists preference across sessions
    - Root cause fix: Tailwind v4 `@theme inline` bakes values at build time — runtime overrides don't work. Solution: split into `@theme inline` (fonts/sizes only) + `@theme` (colors), so `html.light { --color-* }` overrides take effect at runtime
    - Light mode uses warm parchment background (`#f5f0e8`) with darkened gold/blue/crimson accents

## Contact Form — Implementation Notes

- **Service:** formsubmit.co (free, no account needed)
- **Why not Netlify Forms:** Netlify Forms AJAX submissions are intercepted before reaching Next.js, but `@netlify/plugin-nextjs` routes all paths through the SSR function first — the form handler never fires. Traditional HTML-only forms would work but require a page reload.
- **How it works:** `Contact.tsx` POSTs JSON to `https://formsubmit.co/ajax/davedvst@gmail.com`. First submission requires a one-time email activation — already completed and live.
- `public/netlify-form.html` can be left in place or removed — it's no longer used.

## Next Session — Pick Up Here

- [ ] **Project card 3** — "Smart UX Frameworks" is still placeholder content. User is considering app ideas but hasn't decided. Ask what real project to substitute.
- [ ] **Project card 3 screenshot** — Once card 3 content is decided, drop PNG into `public/` and add `image: "/filename.png"` to its object in `PROJECTS[]` in `Projects.tsx`.
- [ ] **Verify light/dark mode** — Fix was applied (globals.css `@theme` split) but user has not confirmed it's working in the browser. Test the toggle on live or dev before assuming it's good.
- [ ] **Push pending changes** — Nav rename, AEO schema, light/dark mode are local and uncommitted. Push to GitHub when user is ready.
- [ ] **Optional extras (deferred)** — Scroll reveal animations, resume download button, copy email to clipboard, scroll progress bar, typed/rotating headline — user chose A/B/C only; these are available if wanted later.

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


Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.


## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.