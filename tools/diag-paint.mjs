import puppeteer from 'puppeteer-core';
import { FINALIZE_APPEAR } from './appear.mjs';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new', args: ['--disable-gpu', '--hide-scrollbars'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('https://karolinahess.com/', { waitUntil: 'networkidle2', timeout: 90000 });
await new Promise((r) => setTimeout(r, 3000));
await page.evaluate(FINALIZE_APPEAR);

const rows = [];
for (const y of [0, 450, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3400, 3800, 4200, 4600, 5000, 5400, 5800, 6300, 6840]) {
  await page.evaluate((t) => window.scrollTo(0, t), y);
  await new Promise((r) => setTimeout(r, 350));
  const s = await page.evaluate(() => {
    const stack = document.elementsFromPoint(720, 450).slice(0, 5).map((e) => {
      const cs = getComputedStyle(e);
      const n = e.getAttribute('data-framer-name') || e.tagName.toLowerCase();
      return n + '[' + cs.backgroundColor + (cs.position === 'fixed' ? ' FIXED' : '') + (cs.position === 'sticky' ? ' STICKY' : '') + ']';
    });
    return { y: Math.round(window.scrollY), stack };
  });
  rows.push('scroll ' + String(s.y).padStart(4) + '  centre: ' + s.stack.join('  '));
}
console.log(rows.join('\n'));
await browser.close();