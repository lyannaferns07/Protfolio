import puppeteer from 'puppeteer-core';
import { FINALIZE_APPEAR } from './appear.mjs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const out = 'C:\\Users\\Lyaan\\AppData\\Local\\Temp\\opencode\\ref-wheels';
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

const probe = () =>
  page.evaluate(() => {
    const w = document.querySelector('[data-framer-name="works"]');
    const ws = document.querySelector('[data-framer-name="wrapper-sticky"]');
    const s3 = document.querySelector('#section03');
    return {
      y: Math.round(window.scrollY),
      worksX: w ? Math.round(w.getBoundingClientRect().x) : null,
      worksT: w ? getComputedStyle(w).transform : null,
      wsT: ws ? getComputedStyle(ws).transform : null,
      s3T: s3 ? getComputedStyle(s3).transform : null,
      s3H: s3 ? Math.round(s3.getBoundingClientRect().height) : null,
    };
  });

await page.mouse.move(720, 450);
const log = [await probe()];
for (let i = 0; i < 26; i++) {
  await page.mouse.wheel({ deltaY: 260 });
  await new Promise((r) => setTimeout(r, 260));
  const p = await probe();
  log.push(p);
  if (p.y > 2200 && !p.shot) {
    await page.evaluate(FINALIZE_APPEAR);
    await page.screenshot({ path: path.join(out, `w-${i}.png`) });
    p.shot = true;
  }
}
console.log(JSON.stringify(log, null, 1));
await browser.close();