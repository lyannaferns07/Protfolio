import puppeteer from 'puppeteer-core';
import { FINALIZE_APPEAR } from './appear.mjs';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--disable-gpu', '--hide-scrollbars'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(process.argv[2] || 'https://karolinahess.com/', { waitUntil: 'networkidle2', timeout: 90000 });
await new Promise((r) => setTimeout(r, 3000));
console.log(await page.evaluate(FINALIZE_APPEAR));

const info = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll('h1').forEach((h) => {
    const cs = getComputedStyle(h);
    const r = h.getBoundingClientRect();
    const p = h.closest('[data-framer-name]')?.parentElement;
    const pcs = p ? getComputedStyle(p) : null;
    out.push({
      text: h.textContent.trim(),
      rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      color: cs.color, fontSize: cs.fontSize, opacity: cs.opacity, visibility: cs.visibility,
      transform: cs.transform, inline: h.getAttribute('style'),
      parentName: p?.getAttribute('data-framer-name'),
      parentOverflow: pcs?.overflow, parentH: pcs?.height, parentTransform: pcs?.transform,
      parentInline: p?.getAttribute('style'),
    });
  });
  return out;
});
console.log(JSON.stringify(info, null, 1));
await browser.close();