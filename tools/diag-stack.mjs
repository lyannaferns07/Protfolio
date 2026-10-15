import puppeteer from 'puppeteer-core';
import { FINALIZE_APPEAR } from './appear.mjs';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new', args: ['--disable-gpu', '--hide-scrollbars'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('https://karolinahess.com/', { waitUntil: 'networkidle2', timeout: 90000 });
await new Promise((r) => setTimeout(r, 3000));
await page.evaluate(FINALIZE_APPEAR);
await page.evaluate(() => {
  document.getElementById('template-overlay')?.remove();
  document.getElementById('overlay')?.remove();
  document.querySelectorAll('[id^="framer"]').forEach((e) => e.remove());
});

console.log(await page.evaluate(() => {
  const probe = (x, y) => {
    const e = document.elementFromPoint(x, y);
    if (!e) return 'none';
    const n = e.getAttribute('data-framer-name') || e.tagName.toLowerCase();
    return `${n}:${(e.textContent || '').trim().slice(0, 18)}`;
  };
  const h1 = [...document.querySelectorAll('h1')].find((e) => e.textContent.includes('Creative'));
  const r = h1.getBoundingClientRect();
  const photo = document.querySelector('[data-framer-name="photo"]');
  const pr = photo.getBoundingClientRect();
  const zi = (el) => {
    const cs = getComputedStyle(el);
    return `z=${cs.zIndex} pos=${cs.position}`;
  };
  return JSON.stringify({
    h1Box: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
    photoBox: { x: Math.round(pr.x), y: Math.round(pr.y), w: Math.round(pr.width), h: Math.round(pr.height) },
    overlaps: r.right > pr.left && r.left < pr.right && r.bottom > pr.top && r.top < pr.bottom,
    // Sample points that sit on the headline AND inside the photo.
    samples: [[500, 290], [640, 300], [820, 300], [400, 420], [700, 420], [900, 420]]
      .map(([x, y]) => `(${x},${y}) -> ${probe(x, y)}`),
    h1Style: zi(h1),
    photoStyle: zi(photo.parentElement),
    photoWrapperZ: zi(document.querySelector('[data-framer-name="photo"]').parentElement.parentElement),
  }, null, 1);
}));
await browser.close();