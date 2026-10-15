/**
 * Capture full-page + per-section screenshots of the redesigned site.
 *
 * Usage: node tools/capture-sections.mjs [baseUrl] [outDir]
 */
import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = process.argv[2] || 'http://127.0.0.1:5175/';
const OUT = process.argv[3] || './shots-stitch';
await mkdir(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1'],
});

for (const vp of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844, isMobile: true },
]) {
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('requestfailed', (r) => errors.push('reqfail: ' + r.url()));

  await page.setViewport({
    width: vp.width,
    height: vp.height,
    isMobile: !!vp.isMobile,
    hasTouch: !!vp.isMobile,
  });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 90000 });
  await sleep(3500);

  const scrollTo = (y) =>
    page.evaluate((t) => {
      const l = window.lenis;
      if (l && l.scrollTo) l.scrollTo(t, { immediate: true, force: true });
      else window.scrollTo(0, t);
    }, y);

  // Overflow check
  const ov = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
  }));
  console.log(`[${vp.name}] scrollWidth=${ov.sw} clientWidth=${ov.cw}`);

  // Section offsets
  const ids = ['home', 'workshop', 'about', 'contact'];
  const geo = await page.evaluate((list) => {
    const out = {};
    for (const id of list) {
      const el = document.getElementById(id);
      out[id] = el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : -1;
    }
    // The Workshop stage contains its own <footer> rail, so take the
    // last one in document order (the site footer).
    const all = document.querySelectorAll('footer');
    const siteFooter = all[all.length - 1];
    out.footer = Math.round(
      (siteFooter?.getBoundingClientRect().top ?? 0) + window.scrollY
    );
    return out;
  }, ids);

  await scrollTo(0);
  await sleep(600);
  await page.screenshot({ path: `${OUT}/${vp.name}-hero.png` });

  for (const id of ids) {
    if (geo[id] < 0) continue;
    await scrollTo(geo[id]);
    await sleep(1200);
    await page.screenshot({ path: `${OUT}/${vp.name}-${id}.png` });
  }

  await scrollTo(geo.footer - 200);
  await sleep(900);
  await page.screenshot({ path: `${OUT}/${vp.name}-footer.png` });

  if (errors.length) console.log(`[${vp.name}] ERRORS:`, errors.slice(0, 8));
  else console.log(`[${vp.name}] no console/network errors`);

  await page.close();
}

await browser.close();
console.log('done');