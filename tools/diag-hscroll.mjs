import puppeteer from 'puppeteer-core';
import { FINALIZE_APPEAR } from './appear.mjs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const out = 'C:\\Users\\Lyaan\\AppData\\Local\\Temp\\opencode\\ref-hscroll';
await mkdir(out, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--disable-gpu', '--hide-scrollbars'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('https://karolinahess.com/', { waitUntil: 'networkidle2', timeout: 90000 });
await new Promise((r) => setTimeout(r, 3000));
await page.evaluate(FINALIZE_APPEAR);

console.log('lenis keys:', await page.evaluate(() => {
  const l = window.lenis;
  return JSON.stringify({
    isStopped: l.isStopped, isScrolling: l.isScrolling,
    anim: l.animatedScroll, limit: l.limit, vh: l.dimensions?.viewportHeight,
    methods: Object.getOwnPropertyNames(Object.getPrototypeOf(l)).slice(0, 40),
  }, null, 1);
}));

const probe = () => page.evaluate(() => {
  const w = document.querySelector('[data-framer-name="works"]');
  const ws = document.querySelector('[data-framer-name="wrapper-sticky"]');
  return {
    y: Math.round(window.scrollY),
    lenisY: Math.round(window.lenis?.animatedScroll ?? -1),
    worksX: w ? Math.round(w.getBoundingClientRect().x) : null,
    wsT: ws ? getComputedStyle(ws).transform : null,
  };
});

const log = [];
for (const y of [1800, 2100, 2400, 2700, 3000, 3300, 3600, 3900, 4200, 4500, 4800, 5100, 5400, 5940]) {
  await page.evaluate((t) => window.lenis.scrollTo(t, { immediate: true, force: true }), y);
  await new Promise((r) => setTimeout(r, 700));
  await page.evaluate(FINALIZE_APPEAR);
  const p = await probe();
  log.push(p);
  await page.screenshot({ path: path.join(out, `hs-${String(y).padStart(5, '0')}.png`) });
}
console.log(JSON.stringify(log, null, 1));
await browser.close();