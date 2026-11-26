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
- **Sora** — display, all headlines, buttons (`--font-sora`)
- **Inter** — body text (`--font-inter`)
- **JetBrains Mono** — code labels, nav items, badges (`--font-jetbrains-mono`)
- **Self-hosted** via `next/font/local` from `src/app/fonts/*.woff2` (latin variable files). Do NOT switch back to `next/font/google`: it downloads fonts at build time, and a failed download on Netlify broke the 2026-11-08 deploy

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
    api/avatar/session/route.ts — starts a LemonSlice avatar room server-side (key stays on the server)
    sitemap.ts, robots.ts
    globals.css       — Tailwind v4 @theme + custom utilities
    (site)/           — plain fast pages with shared footer
      work/, work/[slug]/, about/, music/, art/, videos/, studio/, contact/
  components/
    SiteHeader.tsx, PageIntro.tsx, PlaceholderTile.tsx, Contact.tsx
    AvatarChat.tsx    — /about headshot that becomes a live LemonSlice video avatar (Daily call SDK, loaded on click)
    experience/
      Experience.tsx  — scroll story sections, Lenis + GSAP ScrollTrigger timeline, timeline rail, sound button
      BadgeScene.tsx  — React Three Fiber scene: badge, backdrop, screenshots
      StoryObjects.tsx — 2005 windows, 2018 sales app page + head-to-head card, 2021 particle lens, Now creator badges (desktop only)
      creatorIcons.ts — Apps / Music / Art / Videos icon art and links, shared by the 3D badges and the phone buttons
      CreatorButtons.tsx — phone view of the Now chapter: the four icons as tappable, gently floating buttons
      keyframes.ts    — badge state for each chapter (desktop and phone layouts)
      interaction.ts  — shared live input (pointer, tap pulse, scroll speed, cursor) and the layout media queries
      shaders.ts      — badge face, harbor backdrop, windows and particle shaders
    player/
      PlayerProvider.tsx — site-wide radio in the root layout (Web Audio): stations, tuning static, home scroll filter, analyser, Media Session
      MiniPlayer.tsx — floating controls on plain pages once the radio is started (hidden on / and /music)
      icons.tsx — drawn play/pause/next/prev icons (text symbols render as emoji on Windows)
    art/ArtGallery.tsx — /art gallery: tilt/glare hover, spotlight, View cursor, scroll reveal; full-screen viewer that flies from the tile (GSAP), arrows/swipe/keys
    music/RadioDial.tsx — the Dial on /music: 12 stations like a clock, drag/tap/arrow keys, visualizer ring
  content/
    apps.ts           — the 4 featured apps, each with a 16:9 `image` and a square `badge` (the 3D frame shows the first four, in order)
    story.ts          — home chapter copy and skills
    stations.ts       — the 12 radio stations (loop file, exact length, YouTube link)
    catalog.ts        — videos (12 placeholders); ART lists David's 12 artworks (files in public/art/)
    profile.ts        — headshot path, resume filename, stats, experience, services, FAQ (shown on /about)
    schema.ts         — JSON-LD: site graph (Person, Organization, ProfessionalService, WebSite linked by @id)
public/               — static assets; audio/soul-swellin-loop-30sec.mp3 is David's music loop
  work/               — app images: <slug>-cover.webp (16:9) and <slug>-badge.webp (square)
scripts/
  work-images/make.mjs — builds public/work/ from source/ (HTML layouts screenshotted by Playwright, saved with sharp)
  og-image/make.mjs — builds src/app/opengraph-image.png, the 1200×630 link preview
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

Source of truth: `src/content/apps.ts`. Each app has two images in `public/work/`: `<slug>-cover.webp` (16:9, /work cards and app pages) and `<slug>-badge.webp` (square, content kept inside the circle, for the home 3D frame). Made by `node scripts/work-images/make.mjs` from originals in `scripts/work-images/source/`; the Gamified Sales Engine images are a drawn wireframe illustration (generic labels, NDA-safe). An app may also have `imageSm` (square, shown on phones under 768px on its card and page, via `src/components/AppImage.tsx`); give a replaced image a new filename, since browsers and the Next image cache keep the old one for 4 hours. Optional `details` paragraphs show only on the app's own page. Bundle Builder (The Joy Factory, name approved for public use), PageScore (1k active users), Data Management & Analytics Dashboard (formerly Conversational Analytics Engine, `/work/data-analytics-dashboard`, old URL redirects in `next.config.ts`; 85% report automation; built with Gemini, prototyped in Google AI Studio; images are David's own designs), Gamified Sales Engine (NDA: no client name or visuals). Services copy lives in `src/content/profile.ts`.

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
- Home story has three layouts, and every change must be checked in all three:
  - **Phone** (under 768px wide): text at the top, 3D objects in the lower half. Text fades in already in place at the top (its y offset cancels the scroll), so it never passes through the 3D objects
  - **Desktop** (768px wide and up): text on the left, 3D on the right
  - **Short screens** (`short:` variant in `globals.css`, max-height 500px, i.e. phones held sideways): desktop layout with compact text and no skill tags. The 2018 column is narrower (40vw) to clear the sales app panels
  - The home story switches layout with the `wide:` variant, not `md:`: 768px and up OR any phone held sideways, so an iPhone SE sideways (667×375) also gets the side-by-side layout. `WIDE_QUERY`/`NARROW_QUERY` in `interaction.ts` must match it (used by gsap.matchMedia and StoryObjects)
  - `compact:` (portrait phones under 760px tall) shrinks the type and hides skill tags; `tiny:` (narrow phones held sideways) shrinks it further. Variant order in `globals.css` matters: wide, short, tiny, compact
- Test sizes used: 390×844, 375×667, 430×932 (portrait); 844×340, 844×390, 932×430 (landscape); 1440×900 (desktop)

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

- **2026-11-08 (late night)** — Now chapter (deployed as `b197bab`): added a fourth floating icon for Videos (screen with gold play button); desktop shows the four 3D badges in a staggered 2 × 2 cluster; on phones the 3D badges hide and the chapter shows the same four icons as tappable buttons linking to /work, /music, /art and /videos (replacing the text links there). Added "Video" to the chapter's skills

- **2026-11-08 (late night, 2)** — `/art` (live via `349e6a3` after the font fix): 12 artworks replace the placeholders, with titles from the filenames; headline "Original art and illustration."; images hover-zoom; no full-screen viewer or buy buttons yet

- **2026-11-08 (late night, 3)** — Netlify build of `92fdaba` (art page) failed: `next/font/google` could not download the font files during the build (error: "Can't resolve '@vercel/turbopack-next/internal/font/google/font'"). Netlify's AI suggested removing `--turbo`, but the script never had it; Turbopack is the Next 16 default and had built fine before. Fix: fonts self-hosted with `next/font/local`; verified the build succeeds with Google Fonts blocked

- **2026-11-11** — Three deploys, each verified live:
  - Explained the music player to David (how the loops were cut and how the Web Audio player works) so he can describe it to recruiters and clients
  - **Work images** (`c3d8669`): every app has a 16:9 cover and a square badge image (see Featured Apps). The /work cards use a fixed 16:9 shape on every screen size, so nothing is cropped on phones. The 3D frame shader now has four image slots; the NDA stripes treatment was removed. Gamified Sales Engine got a drawn wireframe illustration (leaderboard + head to head; trophy instead of the DAV logo so it doesn't suggest David owns the client's app); its app page says the image is an illustration, not the real app. Original screenshots moved to `scripts/work-images/source/`
  - **Phone portrait scroll** (`ed69545`): chapter text used to slide up through the 3D objects while half faded, which made 2016+ unreadable mid-screen. Text now fades in already in place at the top
  - **Phone landscape** (`046778d`): David's real problem was an iPhone held sideways in Chrome, which gets the desktop layout (wider than 768px) in a screen only ~340px tall. Text was taller than the screen and never fully visible. Added the `short:` compact layout (see Key Conventions)

- **2026-11-15** — Story, micro-animations, phone and AEO upgrade, **deployed as `33e971f`** and verified live (all 16 URLs return 200; browser checks at 390×844, 667×375 and 1440×900 show no console errors; drag, click and Now badge links work):
  - Each chapter got a one-line `hook` in `story.ts` (read in order they tell the arc); bodies tightened; the 2010 sales app is now the thread that pays off in 2016 and 2018. Facts unchanged
  - Text entrances (scrubbed): the year rolls over from the previous chapter's year like an odometer (previous digits drawn by CSS so they stay out of the page text), an accent rule draws in, skill tags pop in one by one, app metrics count up
  - 3D: badge leans with scroll speed; mouse users can drag or click to spin it (tap on phones); 2005 windows move out of the cursor's way and trail the scroll; 2018 panels turn toward the cursor; 2021 particles part around the cursor (or a tap) and wind up with scrolling; Now badges grow on hover and navigate on click (client-side, radio keeps playing)
  - Story progress bar with chapter ticks (all sizes); bottom bar shows the year on phones; chapter label rises in on change
  - Phones: fixed skill tags over the 3D on 375×667 and the cramped iPhone SE landscape layout (see Key Conventions). Checked all 7 test sizes: no console errors, no sideways scroll
  - AEO: linked JSON-LD graph, ProfilePage + FAQPage and a visible FAQ on /about, SoftwareApplication on each app page, `public/llms.txt`, link preview image, home canonical, "over 20 years" wording everywhere

- **2026-11-15 (later)** — `/art` upgrade, deployed at David's request: "Días de los Muertos Band" replaced with `youTube-Channel-Cover.webp`, titled "Overgrown City Self-Portrait" (title is a placeholder for David to confirm; old file still in `public/art/`). New `ArtGallery.tsx`: tiles tilt toward the mouse with a light glare and image parallax, other tiles dim, a gold "View" cursor trails the mouse, pieces rise in and a curtain lifts as they scroll into view (CSS scroll-driven, skipped where unsupported). Click opens a full-screen viewer: the image flies from its tile, blurred artwork glow behind, prev/next wipe transitions, swipe, arrow keys, Esc, clickable progress bar, focus kept inside, closes back into the tile. Reduced motion gets plain fades. Checked at 1440×900, 390×844, 375×667, 844×390: no console errors, no sideways scroll

- **2026-11-21** — Story copy refocused by David on his growth as a programmer (deployed as `e7ee4ff`, then the follow-up below): 2000 chapter retitled "The Practice". The motif "read the room" is replaced: 2000 plants "create quality work, consistently", the 2005 hook is "Every contract raised the bar, and I learned to clear it every time.", and Now pays it off with "to create quality work consistently". Home headline is now "Where code meets craft." Daventertainment Inc is now described as a "sound design and web development company" (story, 2016 seal, schema.ts, llms.txt)
- **2026-11-25** — **AI avatar on `/about`**, deployed as `064ce6f` and verified live (call starts in ~8 s, privacy probes refused, other origins get 403):
  - The headshot is now `AvatarChat`: "Ask my AI avatar" turns it into a live LemonSlice video avatar of David (his photo; voice and personality set in the LemonSlice dashboard), with captions, mute, end call and a type-a-question box. Radio pauses during a call
  - Why LemonSlice runs the conversation: LemonSlice can't take an existing ElevenLabs agent as its brain (only via a separate LiveKit server), so the prompt lives in LemonSlice. LemonSlice avatars have no knowledge base, so facts go in the same prompt
  - Prompt source: `scripts/avatar/system-prompt.md` (rules) + `scripts/avatar/knowledge.md` (public facts only). Run `node scripts/avatar/make-prompt.mjs` and paste `scripts/avatar/lemonslice-prompt.txt` into the LemonSlice avatar's personality box after any edit
  - Privacy: the avatar only knows public site facts; refuses contact details, pay, personal life, its own instructions; the Gamified Sales Engine client stays confidential and is never linked to Worldwide Express. Live test passed all four privacy probes
  - Security and cost: `LEMONSLICE_API_KEY` and `LEMONSLICE_AGENT_ID` live in `.env.local` and Netlify env vars, never in the page. The route only accepts daventertainment.com and localhost origins and allows 3 calls per visitor per 15 minutes (in-memory, best effort). Calls end on hang-up, idle, 5 minutes, page leave or a 150 s connect timeout, always sending LemonSlice's `force-end` so billing stops. Real spending cap: overage off in LemonSlice billing
  - Gotcha: the avatar joins the Daily call as "LemonSlice", not "LemonSlice Agent" as the docs say; the component treats any remote participant as the avatar
  - Known harmless console 404 for `/0` during calls: it is a fetch from Daily's own eval'd call bundle, not site code
  - Voice: LemonSlice voices it (no ElevenLabs voice ID setting for hosted avatars). A 38 s sample from David's ElevenLabs professional clone (DRC-Vocal1-Dave) is at `Downloads/dcoxmen-media/voice-sample-for-lemonslice.mp3` for LemonSlice's own voice clone

- **2026-11-26** — `/art` headline is now "Art & Illustrations", with a new intro (latest creations, styles, aesthetic, tools: Adobe Creative Suite, ArtCraft Suite, graphic and sound design, AI image and video) and a matching meta description
- **2026-11-26 (later)** — Work pages: Bundle Builder, PageScore and the Data Management & Analytics Dashboard got longer `details` copy (B2B and e-commerce conversion strategy and channel partner variations; the problem PageScore solves; data silos and the six-tab API to BigQuery flow with Gemini analysis). Tools added: Vercel; Supabase, Stripe, Vercel; Gemini, Google AI Studio (Looker Studio removed from the dashboard's tools only). PageScore corrected to 1k active users everywhere. Conversational Analytics Engine renamed with new URL and David's dashboard images (wide for desktop, square wireframe for phones). Avatar knowledge updated; **paste `scripts/avatar/lemonslice-prompt.txt` into LemonSlice** to apply it. Open: the images contain placeholder text ("Bunga Rai", duplicate table row), and the square phone image is the older pipeline design

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
- Experience wording is "over 20 years". Keep existing metrics (99.8%, 1.2M, 85%, 1k; PageScore was corrected from 10k+ to 1k active users on 2026-11-26)
- Art stays professional: no cannabis or POD designs here
- No database or payments yet. Later: art and music with personal and commercial licenses through hosted checkout, plus app templates in a separate area
- No news or blog for now. Art, music and video will update regularly
- The new logo is coming, with the same colors and round shape

| Phase | Status |
|-------|--------|
| 1. Prototype | ✅ Done, approved by David |
| 2. Foundation | ✅ Built, awaiting David's review |
| 3. Home experience: remaining chapters, sound, phone and reduced-motion polish | ✅ Built 2026-11-08, awaiting David's review |
| 4. Dial on `/music`, Backlot on `/studio` | Dial built 2026-11-10; Backlot next |
| 5. Launch: real-device testing, speed tuning, real contact form test, swap live site | Not started |
| 6. Later: real content, shop, licenses, templates, award submission | Not started |

## Next Session — Pick Up Here

**State (2026-11-15):** Everything through the `/art` gallery and viewer upgrade is **live on daventertainment.com** (`main`, same as the branch). Next planned task: the Backlot on `/studio` (Phase 4), unless David picks something from the lists below. Work continues on `redesign/phase-1-prototype`; merge to `main` to deploy. To view locally: `npm run build`, `npx next start`, open `http://localhost:3000`.

**Phase 4 music: decisions from David (2026-11-10)**
- No licensing or sales: the dial just plays the music. Approach A confirmed
- 12 stations, each a seamless loop of **at most 1:30**, cut with ffmpeg (installed via WinGet) into `public/audio/stations/`. Full mix MP3s stay OUT of the repo
- The home Listen button uses the same site-wide player
- Each station links to its full mix on YouTube. Stations: Cup of Joe (v8q06zzUpo8), Night Out (-5DmnuNbhgE), Hypnotically Cool x Funk Feelin (54B_cwJ5oPQ), Up & Running (Gi1Enlr7J-g), Evening Dine (I9xbNDHCvjc), Aghaz-e Rooz (Begin the Day) (ZCbAeAyIuMg), The Row (xB6esrN9sNI), Spanish Coffee (CjRLfdPre4k), Matiz Tropical (oX00L3VZDhE), Rizz Risen, Landing in Funkify, Mi Special Butterfly (last three: video links still needed)
- The "mixes" are songs of 2:41–4:15, in `claude-projects/audio-files/` (outside the repo). "Tropical Nuance (Remix).mp3" = Matiz Tropical. The last three stations link to the channel videos page on purpose
- **Loops made 2026-11-10**: 12 MP3s in `public/audio/stations/` (72–90 s, 160 kbps, ~1.6 MB each, 19 MB total), station list in `src/content/stations.ts`. Each seam is a 2 s crossfade at a beat-matched point; levels evened to about -16 LUFS. Script and seam previews (loop played twice) are in `audio-files/loop-previews/`; rerun with `node make-loops.mjs <srcDir> <outDir> <previewDir>`
- Loops must play through Web Audio (`AudioBufferSourceNode.loop`); `<audio loop>` leaves a small gap in MP3s
- David approved all 12 loops (2026-11-10)
- **Dial and site-wide player built 2026-11-10, live as commit `0cf4cd4`** (live checks passed). Home Listen now plays the current station (starts at Cup of Joe) with the scroll filter; the old Soul Swellin loop and `useStorySound.ts` were retired (the MP3 is still in `public/audio/`). Tested in headless Chromium: seams loop sample-exact, drag/tap/keys tune, music continues across pages, mini player works, no console errors, no phone overflow. Not yet tested on Safari/iPhone or real devices; lock-screen controls may need an `<audio>` element on some phones

**Phase 4 music: earlier discussion (2026-11-09)**
- YouTube channel: "Daventertainment Inc", https://www.youtube.com/channel/UCDCuScou1VMIOx7DCasa76g. Public feed (no API key): https://www.youtube.com/feeds/videos.xml?channel_id=UCDCuScou1VMIOx7DCasa76g (latest 15 uploads). Mostly weekly 1-hour lo-fi mixes since Nov 2025 (Latin lo-fi, acid jazz, Afro-beat/reggae, indie/math rock, retro lounge, neo soul, Japanese instrumentation), plus 3 singles from Aug–Sep 2025. Recent mixes have ~1,000–1,250 views
- Proposed: the Dial on `/music` with each mix as a "station"
- Recommended approach A: self-hosted 30–60 sec preview loops (~1 MB each, cut from David's mix files) drive the dial and a visualizer; a "Watch the full mix" button opens the YouTube player (loaded only on click). Alternatives: B = YouTube embeds only (dial can't react to the audio; the player must stay visible per YouTube terms); C = full mixes on external storage such as Cloudflare R2. Full mixes (~60–90 MB each) must NOT go in the repo
- Player: no framework. Native audio plus Web Audio API: one site-wide player that keeps playing across pages, a visualizer, Media Session lock-screen controls. Howler.js not needed
- Option: list the newest mixes automatically from the public feed
- Questions waiting on David: (1) approach A? (2) which 12 mixes: most recent, or hand-picked? auto-update from the feed? (3) can he supply mix files to cut previews? (4) should other creators be able to use the music in their videos, and free with credit or paid? (5) Content ID registration, and are all samples cleared? One mix mentions "plunderphonic elements" (6) should the home Listen button use the same site-wide player?

**Videos page plan (agreed with David 2026-11-11, discussion only, nothing built yet)**
- Focus: jobs and contracts first, creative second. David is comfortable on camera; little existing footage, so most videos will be new
- Launch set of 5:
  1. "Hi, I'm David" (45 s, to camera); also use on `/about` or `/contact`
  2. PageScore walkthrough (90 s, screen + voiceover, face in a corner)
  3. Bundle Builder walkthrough (90 s)
  4. "How I built this portfolio with AI agents" (3–4 min: 3D story, radio dial loops, work images)
  5. Gamified Sales Engine story (60–90 s, to camera only; NDA: no client name or product screens; may cut in the wireframe illustration). Arc: begun 2010, tested 2016, national 2018
- Next: Conversational Analytics walkthrough, then 2–3 min explainers (AEO, RAG in plain English, AI agents connected to store data)
- Later, creative row: music visualizer cuts linking to full YouTube mixes, art time-lapses, yacht/DJ archive clips if any
- Leave out: full-length mixes as main content, anything employers haven't cleared, a grid of 12 placeholders
- Walkthrough formula: hook with the result (5 s) → problem (15 s) → one real task demoed (40 s) → one technical decision (20 s) → "let's talk" close (10 s)
- Production: phone/webcam at eye level by a window, $30–60 lav or USB mic, OBS at 1920×1080 with browser at 125% zoom, CapCut or DaVinci Resolve, always captions, three bullet points per video instead of a script
- Schedule: week 1 videos 1–2, week 2 videos 3 and 5, weeks 3–4 video 4, then one every 1–2 weeks
- Page build (when the first videos exist): rows Work → Process → Creative; YouTube with click-to-load facade; the 16:9 work covers as thumbnails; VideoObject JSON-LD; show only finished videos. Until then, replace the 12 placeholders in `catalog.ts` with a "First videos coming soon" note and a link to the YouTube channel
- Offered next: bullet-point outlines for the five launch videos

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

**Assets still to come:** real tracks and videos. Art: 12 pieces added 2026-11-08 from Downloads/portfolio-images (raccoon-samurai-warrior left out at David's request); on 2026-11-09 PCH Coastal Drive was replaced with "Red Lips, Vintage Mic" (Downloads/dcoxmen-media/Poster-lips-mic-red-vintage-1024.png), converted to WebP up to 1024px in `public/art/`. Headshot added 2026-11-08 as `public/headshot.webp`; replaced 2026-11-25 by `public/headshot-avatar.webp` (same photo as the LemonSlice avatar; new filename so image caches don't serve the old one) (face-centered crop, shown without color treatment; live as of commit `23368cd`). New logo, favicon and music loop are live (2026-11-08, commit `27e81a9`).

**To check or do later**
- [x] Bundle Builder card on `/work`: replaced 2026-11-11 by the new 16:9 cover
- [ ] Add the full-screen art view and video player when real media exists
- [ ] Reconcile the Netlify status below: `netlify.toml` and `@netlify/plugin-nextjs` are not in the repo, though the site deploys fine
- [ ] Old links to `/#projects` and `/#contact` no longer lead to those sections after launch
- [ ] David to confirm on his iPhone (landscape, Chrome) that the 2016+ chapters now read well
- [x] Small phones in portrait (375×667): fixed 2026-11-15 (`compact:` variant)
- [x] iPhone SE in landscape (667×375): fixed 2026-11-15 (`wide:` and `tiny:` variants)
- [x] 2010 chapter: TypeScript changed back to PHP (TypeScript was first released in October 2012); David agreed 2026-11-15
- [x] Location: David is based in Tustin, California (Person schema homeLocation, FAQ, llms.txt)
- [x] Chapter hooks and /about FAQ copy approved by David 2026-11-15
- [ ] David to review the Sales Engine illustration choices: the trophy (vs the DAV logo) and the NDA note wording

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