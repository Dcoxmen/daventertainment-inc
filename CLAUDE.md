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
- **Background:** `#0b1326` (near-black navy)
- **Primary:** `#d0bcff` (lavender/violet)
- **Secondary:** `#4cd7f6` (cyan)
- **Tertiary:** `#ffb690` (orange)
- Full Material Design 3 token set defined in `globals.css` via `@theme inline`

### Typography
- **Sora** — display, all headlines, buttons (`--font-sora` via next/font)
- **Inter** — body text (`--font-inter` via next/font)
- **JetBrains Mono** — code labels, nav items, badges (`--font-jetbrains-mono` via next/font)
- **Material Symbols Outlined** — icons (loaded via Google Fonts `<link>` in layout.tsx)

### Custom CSS utilities (in `globals.css`)
- `.glass-card` — frosted glass card effect
- `.mesh-gradient` — purple/cyan radial gradient background
- `.glass-input` — dark frosted form input
- `.glow-violet` — violet drop shadow
- `.shimmer-bg` — animated shimmer on hover

### Nav labels (section IDs)
| Nav label | Section ID | Content |
|-----------|-----------|---------|
| Nexus | `#nexus` | Hero |
| Forge | `#forge` | Projects |
| Labs | `#labs` | Services |
| Signal | `#signal` | Contact |

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
| Intelligent E-commerce Engine | 40% Efficiency Gain | Next.js, OpenAI API, Tailwind, React |
| AI-Powered Content Platform | 10k+ Active Users | LangChain, TypeScript, Anthropic, Next.js |
| Smart UX Frameworks | 12ms Inference Latency | React, Tailwind, TensorFlow.js, Vite |

> Image placeholders currently shown — user will provide real screenshots.

---

## Services (currently in Labs section)

**Full Stack Engineering:**
- Advanced React Systems (TypeScript, TailwindCSS, Redux Toolkit)
- Scalable Node.js APIs (NestJS, PostgreSQL, Redis)
- Cloud Architecture (Kubernetes, Docker, Terraform)

**AI Integration:**
- LLM Fine-tuning (PyTorch, HuggingFace, Python)
- RAG Pipelines (Pinecone, LangChain, LlamaIndex)
- Computer Vision (OpenCV, YOLOv8, TensorFlow)

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

## Next Steps (in order — pick up here next session)

- [x] **Step 1:** Screenshots — placeholders in place; user will provide real images later to swap into `Projects.tsx`
- [x] **Step 2:** Copy review — all copy approved as-is for v1
- [ ] **Step 3:** Deploy to Netlify — see deployment notes below

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
- [ ] Old site removed from Netlify
- [ ] `@netlify/plugin-nextjs` installed
- [ ] `netlify.toml` added
- [ ] Repo pushed to GitHub
- [ ] New site connected in Netlify dashboard
