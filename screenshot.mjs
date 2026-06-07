import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

await page.screenshot({ path: './hero.png' });

await page.evaluate(() => document.querySelector('#forge')?.scrollIntoView({ behavior: 'instant' }));
await page.waitForTimeout(400);
await page.screenshot({ path: './forge.png' });

await page.evaluate(() => document.querySelector('#labs')?.scrollIntoView({ behavior: 'instant' }));
await page.waitForTimeout(400);
await page.screenshot({ path: './labs.png' });

await page.evaluate(() => document.querySelector('#signal')?.scrollIntoView({ behavior: 'instant' }));
await page.waitForTimeout(400);
await page.screenshot({ path: './signal.png' });

console.log('Done');
await browser.close();
