/**
 * Inspect the current Workshop implementation in a real browser:
 *  - horizontal overflow at several viewport widths
 *  - card transforms across the pinned scroll range
 *  - image loading status
 *  - console errors
 *
 * Usage: node tools/inspect-workshop.mjs [baseUrl]
 */
import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = process.argv[2] || 'http://127.0.0.1:5174/';
const OUT = './shots-inspect';

await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--font-render-hinting=none'],
});

const report = {};

for (const vp of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 900, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  const page = await browser.newPage();
  const errors = [];
  const failed = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('requestfailed', (r) => failed.push(r.url() + ' :: ' + r.failure()?.errorText));

  await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.name === 'mobile', hasTouch: vp.name === 'mobile' });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 90000 });
  await new Promise((r) => setTimeout(r, 3500));

  // ── Horizontal overflow probe at scroll 0 ──────────────────────────
  const overflow0 = await page.evaluate(() => {
    const de = document.documentElement;
    const offenders = [];
    const vw = de.clientWidth;
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (r.right > vw + 1 || r.left < -1) {
        const cs = getComputedStyle(el);
        if (cs.position === 'fixed') continue;
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: (typeof el.className === 'string' ? el.className : '').slice(0, 60),
          left: Math.round(r.left),
          right: Math.round(r.right),
          pos: cs.position,
        });
      }
    }
    return {
      scrollWidth: de.scrollWidth,
      clientWidth: de.clientWidth,
      bodyScrollWidth: document.body.scrollWidth,
      offenders: offenders.slice(0, 25),
      offenderCount: offenders.length,
    };
  });

  // ── Image status ───────────────────────────────────────────────────
  const images = await page.evaluate(() =>
    [...document.querySelectorAll('img')].map((i) => ({
      src: i.getAttribute('src'),
      ok: i.complete && i.naturalWidth > 0,
      nw: i.naturalWidth,
    }))
  );

  // ── Scroll through workshop and sample card states ─────────────────
  const geo = await page.evaluate(() => {
    const sec = document.getElementById('workshop');
    const r = sec.getBoundingClientRect();
    return { top: r.top + window.scrollY, height: r.height, scrollHeight: document.documentElement.scrollHeight, vh: innerHeight };
  });

  const samples = [];
  const probeAt = async (y) => {
    await page.evaluate((t) => {
      const inst = window.lenis;
      if (inst && inst.scrollTo) inst.scrollTo(t, { immediate: true, force: true });
      else window.scrollTo(0, t);
    }, y);
    await new Promise((r) => setTimeout(r, 650));
    const s = await page.evaluate(() => ({
      scrollY: Math.round(window.scrollY),
      deScrollWidth: document.documentElement.scrollWidth,
      deClientWidth: document.documentElement.clientWidth,
      cards: [...document.querySelectorAll('#workshop li')].map((c) => {
        const r = c.getBoundingClientRect();
        const cs = getComputedStyle(c);
        return {
          left: Math.round(r.left), right: Math.round(r.right),
          w: Math.round(r.width), z: cs.zIndex,
          transform: cs.transform === 'none' ? 'none' : cs.transform,
          op: cs.opacity,
        };
      }),
      pinned: (() => { const st = document.querySelector('#workshop > div'); if (!st) return null; const r = st.getBoundingClientRect(); return { top: Math.round(r.top), pos: getComputedStyle(st).position }; })(),
    }));
    return s;
  };

  const span = Math.max(0, geo.height - geo.vh);
  for (const f of [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1]) {
    samples.push({ f, ...(await probeAt(Math.round(geo.top + span * f))) });
  }
  // overflow probe mid-pin
  const overflowMid = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    bodyScrollWidth: document.body.scrollWidth,
  }));

  await page.evaluate((t) => {
    const inst = window.lenis;
    if (inst && inst.scrollTo) inst.scrollTo(t, { immediate: true, force: true });
    else window.scrollTo(0, t);
  }, Math.round(geo.top + span * 0.35));
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({ path: `${OUT}/${vp.name}-mid.png` });

  await page.evaluate((t) => {
    const inst = window.lenis;
    if (inst && inst.scrollTo) inst.scrollTo(t, { immediate: true, force: true });
    else window.scrollTo(0, t);
  }, Math.round(geo.top));
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({ path: `${OUT}/${vp.name}-start.png` });

  report[vp.name] = { overflow0, overflowMid, images, geo, samples, errors, failed };
  await page.close();
}

await browser.close();
console.log(JSON.stringify(report, null, 2));