// Builds the work images for each app in two shapes:
//   <slug>-cover.webp  16:9, for the /work cards and the app pages
//   <slug>-badge.webp  1:1, for the round frame in the home story (keep content inside the circle)
// Layouts are HTML using the site's fonts, screenshotted by Playwright.
// Usage (from the project root): node scripts/work-images/make.mjs
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1"));
const OUT = path.join(HERE, "../../public/work");
const dataUrl = (file, type) => `data:${type};base64,${fs.readFileSync(path.join(HERE, file)).toString("base64")}`;
const font = (name) => dataUrl(`../../src/app/fonts/${name}`, "font/woff2");

const SRC = {
  analytics: { url: dataUrl("source/analytics.png", "image/png"), w: 1200, h: 630 },
  pagescore: { url: dataUrl("source/pagescore.png", "image/png"), w: 1200, h: 630 },
  bundle: { url: dataUrl("source/bundle-builder.webp", "image/webp"), w: 850, h: 1089 },
};

// A piece of a source image: [x, y, w, h] in source pixels, drawn at `scale`.
const crop = (src, [x, y, w, h], scale, style = "") =>
  `<div style="width:${w * scale}px;height:${h * scale}px;background:url(${src.url}) ${-x * scale}px ${-y * scale}px / ${src.w * scale}px ${src.h * scale}px no-repeat;${style}"></div>`;

const page = (w, h, body, css = "") => `<!doctype html><html><head><style>
@font-face { font-family: Sora; src: url(${font("sora-latin.woff2")}); font-weight: 100 900; }
@font-face { font-family: Mono; src: url(${font("jetbrains-mono-latin.woff2")}); font-weight: 100 900; }
* { box-sizing: border-box; margin: 0; }
body { width: ${w}px; height: ${h}px; overflow: hidden; }
#stage { position: relative; width: ${w}px; height: ${h}px; overflow: hidden; }
.center { display: flex; flex-direction: column; align-items: center; justify-content: center; }
${css}
</style></head><body><div id="stage">${body}</div></body></html>`;

// ---------- Brand backdrop shared by the drawn images ----------
const NAVY_BG = `
.navy { background:
  radial-gradient(circle at 30% 35%, rgba(212,176,106,0.16), transparent 45%),
  radial-gradient(circle at 75% 70%, rgba(109,156,240,0.16), transparent 50%),
  #0b1326; }
.grid { position: absolute; inset: 0; background-image:
  linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
  background-size: 40px 40px; }`;

// ---------- Gamified Sales Engine: a generic wireframe (NDA: no real data or names) ----------
const GOLD = "#d4b06a", BLUE = "#6d9cf0", RED = "#e57888", CREAM = "#efe3c4";
const SALES_CSS = `${NAVY_BG}
.win { position: absolute; border-radius: 18px; background: rgba(12,20,40,0.92); overflow: hidden; }
.bar { height: 48px; display: flex; align-items: center; gap: 18px; padding: 0 20px; font: 600 20px Mono; letter-spacing: 0.04em; }
.dots { display: flex; gap: 8px; } .dots i { width: 11px; height: 11px; border-radius: 50%; background: rgba(255,255,255,0.85); }
.pill { height: 14px; border-radius: 8px; }
.label { font: 500 14px Mono; letter-spacing: 0.12em; color: rgba(255,255,255,0.6); }
.tile { border-radius: 12px; padding: 18px; display: flex; flex-direction: column; gap: 14px; }
.avatar { border-radius: 50%; position: relative; overflow: hidden; background: rgba(255,255,255,0.05); }
.avatar::before { content: ""; position: absolute; left: 50%; top: 24%; width: 34%; height: 34%; transform: translateX(-50%); border-radius: 50%; background: rgba(170,180,210,0.55); }
.avatar::after { content: ""; position: absolute; left: 50%; top: 64%; width: 64%; height: 60%; transform: translateX(-50%); border-radius: 50% 50% 0 0; background: rgba(170,180,210,0.55); }
`;

const dots = `<div class="dots"><i></i><i></i><i></i></div>`;

const trophy = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 120 120">
  <circle cx="60" cy="60" r="57" fill="none" stroke="${GOLD}" stroke-width="2" stroke-dasharray="5 6" opacity="0.7"/>
  <circle cx="60" cy="60" r="47" fill="#121b33" stroke="${GOLD}" stroke-width="3"/>
  <path d="M42 36h36v12c0 11-8 20-18 20s-18-9-18-20z" fill="${GOLD}"/>
  <path d="M42 40h-8c0 9 4 14 10 15M78 40h8c0 9-4 14-10 15" fill="none" stroke="${GOLD}" stroke-width="3"/>
  <rect x="56" y="67" width="8" height="10" fill="${GOLD}"/><rect x="46" y="77" width="28" height="7" rx="2" fill="${GOLD}"/>
  <path d="M60 41l3 6 6 1-4.5 4 1 6-5.5-3-5.5 3 1-6-4.5-4 6-1z" fill="#121b33"/>
</svg>`;

// Achievement badges: flame (streak), star (top rep), bolt (fastest close)
const achievements = (size) => {
  const icon = {
    flame: `<path d="M30 12c4 8 12 11 12 21a12 12 0 0 1-24 0c0-6 4-9 5-14 2 4 4 5 5 5-1-5 0-9 2-12z" fill="${RED}"/>`,
    star: `<path d="M30 14l4.5 9.5 10.5 1.5-7.5 7 2 10.5-9.5-5-9.5 5 2-10.5-7.5-7 10.5-1.5z" fill="${GOLD}"/>`,
    bolt: `<path d="M33 12l-13 21h9l-3 15 14-22h-9z" fill="${BLUE}"/>`,
  };
  const ring = { flame: RED, star: GOLD, bolt: BLUE };
  return Object.keys(icon)
    .map((k) => `<svg width="${size}" height="${size}" viewBox="0 0 60 60"><path d="M30 3l24 13.5v27L30 57 6 43.5v-27z" fill="#121b33" stroke="${ring[k]}" stroke-width="2.5"/>${icon[k]}</svg>`)
    .join("");
};

function leaderboard({ left, top, width, height, tilt }) {
  const tiles = [["CALLS", GOLD, "62%"], ["DEALS", BLUE, "78%"], ["REVENUE", RED, "70%"]]
    .map(([l, c, w]) => `<div class="tile" style="flex:1;border:2px solid ${c}aa"><div class="pill" style="width:${w};background:${c}"></div><div class="label">${l}</div></div>`)
    .join("");
  const ranks = [[GOLD, "92%", true], [BLUE, "76%"], [BLUE, "64%"], [BLUE, "51%"]]
    .map(([c, w, first], i) => `<div style="display:flex;align-items:center;gap:16px;padding:12px 14px;border-radius:12px;${first ? `background:rgba(212,176,106,0.1);border:1px solid ${GOLD}66` : "border:1px solid transparent"}">
      <span style="font:700 18px Mono;color:${first ? GOLD : "rgba(255,255,255,0.5)"};width:28px">0${i + 1}</span>
      <div class="avatar" style="width:42px;height:42px;border:2px solid ${c}"></div>
      <div style="flex:1;display:flex;flex-direction:column;gap:9px"><div class="pill" style="width:42%;height:10px;background:rgba(239,227,196,0.75)"></div><div class="pill" style="width:${w};height:8px;background:${c}"></div></div>
      <span style="font:700 16px Mono;color:${c}">${["2,480", "2,115", "1,870", "1,520"][i]}</span></div>`)
    .join("");
  const bars = [44, 62, 50, 76, 68, 100, 84]
    .map((h, i) => `<div style="flex:1;height:${h}%;border-radius:6px 6px 0 0;background:${i === 5 ? GOLD : BLUE}"></div>`)
    .join("");
  return `<div class="win" style="left:${left}px;top:${top}px;width:${width}px;height:${height}px;border:2px solid ${GOLD}cc;box-shadow:0 0 60px rgba(212,176,106,0.25);transform:perspective(1800px) rotateY(${tilt}deg)">
    <div class="bar" style="background:${GOLD}d9;color:${CREAM}">${dots}<span>sales-app / leaderboard</span></div>
    <div style="padding:28px 30px;display:flex;flex-direction:column;gap:26px">
      <div style="display:flex;align-items:center;gap:26px">${trophy(110)}
        <div style="display:flex;flex-direction:column;gap:12px;flex:1"><div class="label" style="color:${GOLD}">WEEKLY CHALLENGE</div><div class="pill" style="width:72%;height:16px;background:${CREAM}"></div><div class="pill" style="width:48%;height:10px;background:rgba(109,156,240,0.6)"></div></div>
      </div>
      <div style="display:flex;gap:18px">${tiles}</div>
      <div style="display:flex;gap:28px">
        <div style="flex:1.45;display:flex;flex-direction:column;gap:6px">${ranks}</div>
        <div style="flex:1;display:flex;flex-direction:column;gap:12px"><div class="label">THIS WEEK</div>
          <div style="flex:1;display:flex;align-items:flex-end;gap:10px;border-bottom:2px solid rgba(255,255,255,0.15)">${bars}</div></div>
      </div>
    </div></div>`;
}

// The duel: two reps, their stats side by side, and achievement badges.
function duel(scale = 1) {
  const s = (n) => n * scale;
  const rows = [["CALLS", 0.62, 0.48], ["DEALS", 0.44, 0.58], ["REVENUE", 0.7, 0.55], ["STREAK", 0.38, 0.66]]
    .map(([l, a, b]) => `<div style="display:flex;flex-direction:column;align-items:center;gap:${s(10)}px"><div class="label" style="font-size:${s(14)}px">${l}</div>
      <div style="display:flex;width:100%;gap:${s(10)}px"><div style="flex:1;display:flex;justify-content:flex-end"><div class="pill" style="width:${a * 100}%;height:${s(12)}px;background:${BLUE}"></div></div>
      <div style="flex:1"><div class="pill" style="width:${b * 100}%;height:${s(12)}px;background:${RED}"></div></div></div></div>`)
    .join("");
  const rep = (name, c) => `<div style="display:flex;flex-direction:column;align-items:center;gap:${s(12)}px"><div class="avatar" style="width:${s(108)}px;height:${s(108)}px;border:${s(4)}px solid ${c}"></div><div style="font:700 ${s(17)}px Mono;letter-spacing:0.1em;color:${CREAM}">${name}</div></div>`;
  return `<div style="display:flex;align-items:center;justify-content:center;gap:${s(30)}px">${rep("REP A", BLUE)}<span style="font:800 ${s(46)}px Sora;color:${GOLD}">VS</span>${rep("REP B", RED)}</div>
      <div style="display:flex;flex-direction:column;gap:${s(18)}px;width:100%">${rows}</div>
      <div style="display:flex;justify-content:center;gap:${s(18)}px;padding-top:${s(6)}px">${achievements(s(64))}</div>`;
}

function headToHead({ left, top, width, height, tilt }) {
  return `<div class="win" style="left:${left}px;top:${top}px;width:${width}px;height:${height}px;border:2px solid ${BLUE}cc;box-shadow:0 0 60px rgba(109,156,240,0.25);transform:perspective(1800px) rotateY(${tilt}deg)">
    <div class="bar" style="background:${BLUE}b3;color:${CREAM}">${dots}<span>HEAD TO HEAD</span></div>
    <div style="padding:30px 34px;display:flex;flex-direction:column;gap:26px">${duel()}</div></div>`;
}

const IMAGES = {
  "gamified-sales-engine-cover": [1600, 900, `<div class="navy" style="position:absolute;inset:0"></div><div class="grid"></div>
    ${leaderboard({ left: 110, top: 125, width: 880, height: 650, tilt: 7 })}
    ${headToHead({ left: 1050, top: 160, width: 460, height: 600, tilt: -9 })}`, SALES_CSS],

  "gamified-sales-engine-badge": [1200, 1200, `<div class="navy" style="position:absolute;inset:0"></div><div class="grid"></div>
    <div class="center" style="position:absolute;inset:0;gap:30px;padding:0 270px">${trophy(170)}${duel(1.35)}</div>`, SALES_CSS],

  // ---------- Bundle Builder: the app's start screen on the brand backdrop ----------
  "bundle-builder-cover": [1600, 900, `<div class="navy" style="position:absolute;inset:0;background:radial-gradient(circle at 50% 50%, rgba(160,20,20,0.35), transparent 42%), #0b1326"></div><div class="grid"></div>
    <div class="center" style="position:absolute;inset:0">${crop(SRC.bundle, [0, 0, 850, 1089], 0.73, "border-radius:16px;box-shadow:0 30px 80px rgba(0,0,0,0.55),0 0 0 1px rgba(255,255,255,0.12)")}</div>`, NAVY_BG],

  "bundle-builder-badge": [1200, 1200, `<div class="center" style="position:absolute;inset:0;background:#ebebe9">${crop(SRC.bundle, [8, 150, 834, 939], 1.12)}</div>`],

  // ---------- PageScore: original banner, rearranged ----------
  "pagescore-cover": [1200, 675, `<div class="center" style="position:absolute;inset:0;background:#202020">${crop(SRC.pagescore, [0, 0, 1200, 630], 1)}</div>`],

  "pagescore-badge": [1200, 1200, `<div class="center" style="position:absolute;inset:0;background:#202020;gap:18px;padding-top:20px">
    ${crop(SRC.pagescore, [22, 26, 306, 246], 1.15)}
    ${crop(SRC.pagescore, [358, 52, 466, 126], 1.5)}
    ${crop(SRC.pagescore, [848, 52, 316, 126], 1.5)}
    ${crop(SRC.pagescore, [680, 208, 480, 64], 1.15, "margin-top:10px;border-radius:12px")}</div>`],

  // ---------- Conversational Analytics: original banner, rearranged ----------
  "conversational-analytics-cover": [1200, 675, `<div class="center" style="position:absolute;inset:0;background:#333">${crop(SRC.analytics, [0, 0, 1200, 630], 1)}</div>`],

  "conversational-analytics-badge": [1200, 1200, `<div class="center" style="position:absolute;inset:0;background:#333;gap:24px">
    ${crop(SRC.analytics, [30, 60, 162, 176], 1.5)}
    ${crop(SRC.analytics, [195, 104, 468, 88], 1.65)}
    ${crop(SRC.analytics, [675, 104, 498, 88], 1.65)}
    ${crop(SRC.analytics, [187, 242, 590, 78], 1.4, "margin-top:10px")}</div>`],
};

const only = process.argv[2];
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const tab = await browser.newPage({ deviceScaleFactor: 1 });
for (const [name, [w, h, body, css]] of Object.entries(IMAGES)) {
  if (only && !name.includes(only)) continue;
  await tab.setViewportSize({ width: w, height: h });
  await tab.setContent(page(w, h, body, css), { waitUntil: "load" });
  await tab.evaluate(() => document.fonts.ready);
  const png = await tab.locator("#stage").screenshot();
  const file = path.join(OUT, `${name}.webp`);
  await sharp(png).webp({ quality: 86 }).toFile(file);
  console.log(name, `${w}x${h}`, `${Math.round(fs.statSync(file).size / 1024)} KB`);
}
await browser.close();
