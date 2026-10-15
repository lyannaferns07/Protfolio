import puppeteer from 'puppeteer-core';
import { FINALIZE_APPEAR } from './appear.mjs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const out = 'C:\\Users\\Lyaan\\AppData\\Local\\Temp\\opencode\\ref-headful';
await mkdir(out, { recursive: true });

// Headful: a real, visible window so the compositor drives rAF and Framer Motion.
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: false,
  defaultViewport: null,
  args: ['--start-maximized', '--window-position=0,0', '--disable-gpu'],
});
const page = (await browser.pages())[0] || (await browser.newPage());
await page.setViewport({ width: 1440, height: 900 });
await page.goto('https://karolinahess.com/', { waitUntil: 'networkidle2', timeout: 90000 });
await new Promise((r) => setTimeout(r, 4000));

console.log('appear state:', await page.evaluate(() => JSON.stringify({
  Web: getComputedStyle(document.querySelector('[data-framer-name="Web"]')).transform,
  lenisStopped: window.lenis?.isStopped,
})));

await page.bringToFront();
await page.mouse.move(700, 500);

const log = [];
for (const y of [0, 1800, 2400, 3000, 3600, 4200, 4800, 5400, 5940]) {
  await page.evaluate((t) => window.scrollTo({ top: t, behavior: 'instant' }), y);
  await new Promise((r) => setTimeout(r, 900));
  const p = await page.evaluate(() => {
    const w = document.querySelector('[data-framer-name="works"]');
    return {
      y: Math.round(window.scrollY),
      worksX: w ? Math.round(w.getBoundingClientRect().x) : null,
      worksT: w ? getComputedStyle(w).transform : null,
    };
  });
  log.push(p);
  await page.screenshot({ path: path.join(out, `hf-${String(y).padStart(5, '0')}.png`) });
}
console.log(JSON.stringify(log, null, 1));
await browser.close();