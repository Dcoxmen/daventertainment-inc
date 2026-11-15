// Builds the link preview image (1200 × 630) shown when the site is shared on
// LinkedIn, Slack, X, iMessage and similar. Next.js picks it up from src/app/.
// Usage (from the project root): node scripts/og-image/make.mjs
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")), "../..");
const dataUrl = (file, type) => `data:${type};base64,${fs.readFileSync(path.join(ROOT, file)).toString("base64")}`;
const font = (name) => dataUrl(`src/app/fonts/${name}`, "font/woff2");

const html = `<!doctype html><html><head><style>
@font-face { font-family: Sora; src: url(${font("sora-latin.woff2")}); font-weight: 100 900; }
@font-face { font-family: Inter; src: url(${font("inter-latin.woff2")}); font-weight: 100 900; }
@font-face { font-family: Mono; src: url(${font("jetbrains-mono-latin.woff2")}); font-weight: 100 900; }
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 630px; overflow: hidden; color: #dae2fd;
  background:
    radial-gradient(circle at 78% 50%, rgba(212,176,106,0.22), transparent 42%),
    radial-gradient(circle at 15% 85%, rgba(109,156,240,0.18), transparent 45%),
    #0b1326; }
.grid { position: absolute; inset: 0; background-image:
  linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px; }
.copy { position: absolute; left: 72px; top: 0; bottom: 0; width: 660px; display: flex; flex-direction: column; justify-content: center; }
.kicker { font: 500 22px Mono; letter-spacing: 0.12em; text-transform: uppercase; color: #d4b06a; }
h1 { margin-top: 22px; font: 800 76px/1.02 Sora; letter-spacing: -0.02em; }
.role { margin-top: 22px; font: 600 30px/1.3 Sora; color: #dae2fd; }
.skills { margin-top: 26px; font: 400 24px/1.4 Inter; color: #b9c3dc; }
.url { margin-top: 34px; font: 500 22px Mono; color: #6d9cf0; }
.rule { margin-top: 24px; width: 72px; height: 3px; border-radius: 2px; background: #d4b06a; }
.logo { position: absolute; right: 70px; top: 50%; width: 400px; height: 400px; transform: translateY(-50%);
  border-radius: 50%; box-shadow: 0 30px 80px rgba(0,0,0,0.55), 0 0 60px rgba(212,176,106,0.25); }
</style></head><body><div class="grid"></div>
<div class="copy">
  <p class="kicker">Daventertainment Inc</p>
  <h1>David Cox</h1>
  <div class="rule"></div>
  <p class="role">Full Stack Engineer &amp; AI Integration Specialist</p>
  <p class="skills">Over 20 years · Next.js · AI agents &amp; LLMs · SEO &amp; AEO</p>
  <p class="url">daventertainment.com</p>
</div>
<img class="logo" src="${dataUrl("public/Daventertainment-logo.png", "image/png")}" alt="">
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
const out = path.join(ROOT, "src/app/opengraph-image.png");
await page.screenshot({ path: out });
await browser.close();
console.log(`Saved ${path.relative(ROOT, out)}`);
