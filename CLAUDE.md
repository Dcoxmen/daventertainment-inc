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
- **IMPORTANT — Tailwind v4 theme split:** Colors use plain `@theme {}` (outputs CSS custom properties, allows runtime overrides). Fonts/sizes/spacing use `@theme inline {}` (baked at build time). Keep this split. The light/dark toggle was removed in the redesign, so the site is dark only.

### Typography
- **Sora** — display, all headlines, buttons (`--font-sora` via next/font)
- **Inter** — body text (`--font-inter` via next/font)
- **JetBrains Mono** — code labels, nav items, badges (`--font-jetbrains-mono` via next/font)

### Custom CSS utilities (in `globals.css`)
- `.glass-card` — frosted glass card effect
- `.mesh-gradient` — gold/blue radial gradient background
- `.glass-input` — dark frosted form input
- `.glow-violet` — gold drop shadow (class name kept, color updated to match primary gold)
- `.shimmer-bg` — animated shimmer on hover

### Navigation (redesign branch)
Multi-page site: Work, About, Music, Art, Videos, Studio, plus a Hire Me button to `/contact`. See `src/components/SiteHeader.tsx`.

### Logos
- **New logo installed 2026-11-08** (same colors and round shape, mono lettering, gold outer ring)
- `public/Daventertainment-logo.png` — header logo and JSON-LD logo (1024×1024, includes the gold ring)
- `public/badge-face.webp` — 3D badge face: the 2048px logo cropped to its inner blue/red circle (the 3D badge supplies its own gold rim)
- `src/app/icon.png` — 32×32 favicon (the gold "D"); replaced `favicon.ico`

---

## Current File Structure (redesign branch)

```
src/
  app/
    layout.tsx        — fonts, metadata, JSON-LD, SiteHeader
    page.tsx          — home: renders the 3D Experience
    sitemap.ts, robots.ts
    globals.css       — Tailwind v4 @theme + custom utilities
    (site)/           — plain fast pages with shared footer
      work/, work/[slug]/, about/, music/, art/, videos/, studio/, contact/
  components/
    SiteHeader.tsx, PageIntro.tsx, PlaceholderTile.tsx, Contact.tsx
    experience/
      Experience.tsx  — scroll story sections, Lenis + GSAP ScrollTrigger timeline, timeline rail, sound button
      BadgeScene.tsx  — React Three Fiber scene: badge, backdrop, screenshots
      StoryObjects.tsx — 2005 windows, 2018 sales app page + head-to-head card, 2021 particle lens, Now creator badges (desktop only)
      creatorIcons.ts — Apps / Music / Art / Videos icon art and links, shared by the 3D badges and the phone buttons
      CreatorButtons.tsx — phone view of the Now chapter: the four icons as tappable, gently floating buttons
      keyframes.ts    — badge state for each chapter (desktop and phone layouts)
      shaders.ts      — badge face, harbor backdrop, windows and particle shaders
      useStorySound.ts — Listen/Silent audio; a low-pass filter opens as you scroll
  content/
    apps.ts           — the 4 featured apps (apps with screenshots first; the NDA app last)
    story.ts          — home chapter copy and skills, plus THEME_TRACK (the music file path)
    catalog.ts        — tracks, art, videos (12 placeholders each)
    profile.ts        — headshot path, resume filename, stats, experience, services
public/               — static assets; audio/soul-swellin-loop-30sec.mp3 is David's music loop
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

## Featured Apps

Source of truth: `src/content/apps.ts`. Bundle Builder (The Joy Factory, name approved for public use), PageScore (10k+ active users), Conversational Analytics Engine (85% report automation), Gamified Sales Engine (NDA: no client name or visuals). Services copy lives in `src/content/profile.ts`.

---

## Key Conventions

- Use **App Router** (`src/app/`) — no Pages Router
- Keep components in `src/components/`
- Images go in `public/` and are served via Next.js `<Image>` component
- Tailwind v4 — utility-first, split `@theme` in `globals.css` (no `tailwind.config.js`): fonts/sizes use `@theme inline`, colors use plain `@theme`
- `'use client'` only where needed: SiteHeader, Contact, experience components
- TypeScript strict mode is on — zero errors as of current build
- Multi-page App Router site; the home page is the 3D scroll story, all other pages stay fast and plain
- 3D loads client-side only; reduced-motion and no-WebGL visitors get plain text

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

- **2026-11-07** — Redesign planning, Phase 1 and Phase 2, on branch `redesign/phase-1-prototype` (uncommitted at pause):
  - Evaluated lorenzolottici.it, premotio.com and puture.co.kr; plan agreed (see Redesign Plan below)
  - Phase 1: 3D badge with Intro, 1997 and 2000 chapters. David tested it: "exactly the direction I wanted"; headlines fine for now
  - Phase 2: multi-page site, content files, placeholders, sitemap and robots; removed light/dark toggle, Material Symbols font and smooth-scroll rule
  - Added three, @react-three/fiber, gsap, @gsap/react, lenis, @types/three
  - David changed UC Irvine to 2019–2024 and Hornblower to 1997–2020 in `profile.ts`; the resume PDF still says Present for both

- **2026-11-08** — Story timeline from David; chapter outline approved; **Phase 3 built** (uncommitted):
  - 14 home sections: Intro, 8 eras (1997–Now), 4 app chapters (The Work), Contact; about 19 screens
  - New badge looks: app windows (2005), gold coin flip (2010), stamped company seal with shockwave (2016), node network (2018), particle lens (2021), app/music/art badges (Now), app screenshots in the frame (The Work)
  - Clickable timeline rail (desktop), Listen/Silent sound with a generated 21-second placeholder loop, reduced-motion version shows the story as a plain timeline
  - Fixed a Phase 1 bug: the WebGL check opened a new graphics context on every re-render
  - Logistics client stays anonymous in the story (Worldwide Express named only on `/about`)

- **2026-11-08 (later)** — **Redesign deployed to production.** At David's request, committed Phases 1–3 as `4018a56`, pushed `redesign/phase-1-prototype`, fast-forwarded `main` and pushed. Netlify deployed in about a minute. Live checks passed: all 12 pages at desktop and phone sizes, sitemap (12 URLs), robots, audio file, timeline rail, sound, phone menu, reduced-motion version, no console errors

- **2026-11-08 (evening)** — Deployed as `f227cca` and verified live:
  - Bundle Builder app page links to https://thejoyfactory.com (`url` in `apps.ts`), like PageScore
  - Chapter 6 (2018 The Scale) redesigned at David's request: the seal flies into the logo slot of a wireframe sales app page (KPI tiles, bar chart, donut, leaderboard) beside a head-to-head card comparing Rep A and Rep B. Same wireframe style as 2005. Panels draw in from the top behind a scan line and erase in reverse. Replaced the 2018 node network. Labels stay generic for the NDA

- **2026-11-08 (night)** — Chapter copy rewrite in `src/content/story.ts` (deployed as `d433906`): stronger verbs and turning points, varied openings, and a through-line. The motif "read the room" is planted in 2000 and paid off in Now, echoing the headline "Code that plays to the room." Facts unchanged; logistics client still anonymous. David approved all chapters; at his request the 2021 chapter no longer names The Joy Factory ("At my current job position")

- **2026-11-08 (late night)** — Now chapter (not yet deployed): added a fourth floating icon for Videos (screen with gold play button); desktop shows the four 3D badges in a staggered 2 × 2 cluster; on phones the 3D badges hide and the chapter shows the same four icons as tappable buttons linking to /work, /music, /art and /videos (replacing the text links there). Added "Video" to the chapter's skills

## Contact Form — Implementation Notes

- **Service:** formsubmit.co (free, no account needed)
- **Why not Netlify Forms:** Netlify Forms AJAX submissions are intercepted before reaching Next.js, but `@netlify/plugin-nextjs` routes all paths through the SSR function first — the form handler never fires. Traditional HTML-only forms would work but require a page reload.
- **How it works:** `Contact.tsx` POSTs JSON to `https://formsubmit.co/ajax/davedvst@gmail.com`. First submission requires a one-time email activation — already completed and live.
- `public/netlify-form.html` can be left in place or removed — it's no longer used.

## Redesign Plan

**Goal:** an award-level 3D scrolling site that serves recruiters and clients first, and also shows apps, music, art and video and tells the Daventertainment story.

**Agreed direction**
- Two speeds: cinematic home, fast plain pages, always a way to skip to work
- One concept per page: Badge = home, Dial = `/music`, Backlot = `/studio` (coming soon for now)
- Story focus (David, 2026-11-08): a well-rounded modern creator with a strong technical foundation. Music and DJ work open the story, but full stack code and content creation lead
- Home chapters (approved 2026-11-08, built in Phase 3): Intro → 1997 The Code → 2000 The Harbor → 2005 The Contracts → 2010 The Label → 2016 The Seal → 2018 The Scale → 2021 The Intelligence → Now: The Creator → The Work → Contact

### Story timeline (David's own words, summarized, 2026-11-08)
- **1997:** started coding and digital video while promoting his bands and gigs; programming synthesizers and DAW recording systems led him to programming and internet design
- **2000:** learning HTML, JavaScript and database development; regular weekend gigs for large party yacht companies in LA and Orange County; managed entertainment for one yacht company; temporary web development gigs
- **2005:** regular temp agency work in web and SaaS development, for companies from large marketing firms to small nimble ones, while managing music on weekends
- **2010:** music publishing venture with a friend and former bandmate (creating, producing, registering, distributing music); e-commerce and payment gateways; added PHP and Node.js; began developing a sales app that started his full stack career
- **2016:** Daventertainment Inc established as an entertainment and web development company; regular contract development for a large logistics company, which liked system connector apps built for its clients; began testing a sales app for its sales department
- **2018:** the national sales team adopted the sales app, and the company offered compensation and positions; enterprise work with large teams (SCRUM, Jira, GitHub, Node.js, Python, APIs); joined the UC Irvine coding bootcamp, later taught there; began learning AI development
- **2021:** current job at a specialized product company (The Joy Factory): web development, customer and B2B apps, AI integration, marketing workflows; AI agents, ChatGPT, Claude, Gemini, LLMs, RAG, HubSpot, BigCommerce, Shopify, NetSuite, Vercel, Next.js, Google Cloud
- **Now:** building his own apps, art and music to stay sharp and current; coding with AI agents and optimizing agent knowledge
- Experience wording is "over 20 years". Keep existing metrics (99.8%, 1.2M, 85%, 10k+)
- Art stays professional: no cannabis or POD designs here
- No database or payments yet. Later: art and music with personal and commercial licenses through hosted checkout, plus app templates in a separate area
- No news or blog for now. Art, music and video will update regularly
- The new logo is coming, with the same colors and round shape

| Phase | Status |
|-------|--------|
| 1. Prototype | ✅ Done, approved by David |
| 2. Foundation | ✅ Built, awaiting David's review |
| 3. Home experience: remaining chapters, sound, phone and reduced-motion polish | ✅ Built 2026-11-08, awaiting David's review |
| 4. Dial on `/music`, Backlot on `/studio` | ⏭️ Next |
| 5. Launch: real-device testing, speed tuning, real contact form test, swap live site | Not started |
| 6. Later: real content, shop, licenses, templates, award submission | Not started |

## Next Session — Pick Up Here

**State (2026-11-08):** Phases 1–3 plus the new logo, favicon, music, Joy Factory link, 2018 sales app scene, headshot, resume PDF and rewritten chapter copy are **live on daventertainment.com** (commit `d433906` on `main`). Work continues on `redesign/phase-1-prototype`; merge to `main` to deploy. To view locally: `npm run build`, `npx next start`, open `http://localhost:3000`.

**Needs David's decision or input**
- [x] **1997 story:** resolved 2026-11-08 by David's story timeline above. Professional web work since 2005 supports "over 20 years"; suggest updating the resume from "15+ years" to match
- [x] **Chapter outline** approved 2026-11-08 and built
- [ ] **Review Phase 3** on a real computer and phone: smoothness, pacing, chapter copy, the placeholder music
- [x] **Music:** David's `soul-swellin-loop-30sec.mp3` (31.7 sec, seamless) replaced the placeholder on 2026-11-08
- [x] **Story questions answered 2026-11-08:**
  - David will update the resume to "20+ years" and to show yacht gigs starting in 2000; `/about` now shows Hornblower 2000–2020
  - Worldwide Express stays at 2018–2020 (when he was officially hired; contract work began in 2016)
  - The 2010 sales app is the Gamified Sales Engine (begun 2010, tested 2016, national in 2018)
  - Name Worldwide Express **only** on `/about`. The story chapters, app pages and anywhere else must keep the logistics client anonymous
- [x] **Resume PDF:** corrected version added 2026-11-08 as `public/David_Cox_Resume_2026.pdf` (no phone number; source in David's OneDrive/Documents). The Download Resume button on `/about` appears automatically
- [x] **Employers:** Worldwide Express and Hornblower are named on `/about` only; the logistics client stays anonymous everywhere else
- [x] **Commit and push:** done 2026-11-08; the redesign is live
- [ ] **Send one real test message** through the live contact form (only mocked submissions were tested)

**Assets still to come:** real tracks, art and videos. Headshot added 2026-11-08 as `public/headshot.webp` (face-centered crop, shown without color treatment; live as of commit `23368cd`). New logo, favicon and music loop are live (2026-11-08, commit `27e81a9`).

**To check or do later**
- [ ] Look at the Bundle Builder card on `/work`: the full-image change was built but not visually checked
- [ ] Add the full-screen art view and video player when real media exists
- [ ] Reconcile the Netlify status below: `netlify.toml` and `@netlify/plugin-nextjs` are not in the repo, though the site deploys fine
- [ ] Old links to `/#projects` and `/#contact` no longer lead to those sections after launch

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

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

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