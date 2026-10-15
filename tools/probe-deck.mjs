/**
 * Diagnostic: dump ScrollTrigger progress + card transforms across the
 * pinned range, to confirm the takeover timeline maps scroll correctly.
 */
import puppeteer from 'puppeteer-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = process.argv[2] || 'http://127.0.0.1:5175/';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--disable-gpu', '--hide-scrollbars'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
await page.goto(URL, { waitUntil: 'networkidle2', timeout: 90000 });
await sleep(3500);

const geo = await page.evaluate(() => {
  const sec = document.getElementById('workshop');
  const stage = sec.firstElementChild;
  return {
    top: Math.round(sec.getBoundingClientRect().top + window.scrollY),
    height: sec.getBoundingClientRect().height,
    stageH: stage.getBoundingClientRect().height,
    vh: innerHeight,
    stagePos: getComputedStyle(stage).position,
  };
});
console.log('geo', geo);
const range = geo.height - geo.vh;
console.log('pinnedRange', range);

for (const f of [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95]) {
  await page.evaluate((t) => {
    const l = window.lenis;
    if (l && l.scrollTo) l.scrollTo(t, { immediate: true, force: true });
    else window.scrollTo(0, t);
  }, geo.top + range * f);
  await sleep(1600);

  const s = await page.evaluate(() => {
    const sec = document.getElementById('workshop');
    const cards = [...sec.querySelectorAll('li[data-card]')];
    const sts = window.ScrollTrigger?.getAll?.() ?? [];
    const master = sts.find((t) => t.trigger === sec);
    return {
      scrollY: Math.round(window.scrollY),
      progress: master ? +master.progress.toFixed(4) : null,
      start: master ? Math.round(master.start) : null,
      end: master ? Math.round(master.end) : null,
      animDur: master?.animation?.duration?.().toFixed(3),
      cards: cards.map((c) => {
        const r = c.getBoundingClientRect();
        const cs = getComputedStyle(c);
        const m = (cs.transform || '').match(/matrix\(([^)]+)\)/);
        const tx = m ? Number(m[1].split(',')[4]) : 0;
        return {
          left: Math.round(r.left),
          w: Math.round(r.width),
          tx: Math.round(tx),
          scale: m ? +Number(m[1].split(',')[0]).toFixed(3) : 1,
        };
      }),
    };
  });
  console.log(
    `f=${f.toFixed(2)} y=${String(s.scrollY).padStart(5)} prog=${s.progress} dur=${s.animDur} | ` +
      s.cards.map((c) => `L${c.left}/tx${c.tx}/s${c.scale}`).join('  ')
  );
}

await browser.close();