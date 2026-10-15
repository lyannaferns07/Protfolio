import puppeteer from 'puppeteer-core';
import { FINALIZE_APPEAR } from './appear.mjs';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const VPS = { desktop: [1440, 900], tablet: [900, 1000], mobile: [390, 844] };
const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new', args: ['--disable-gpu', '--hide-scrollbars'],
});
const out = {};
for (const [name, [w, h]] of Object.entries(VPS)) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h });
  await page.goto('https://karolinahess.com/', { waitUntil: 'networkidle2', timeout: 90000 });
  await new Promise((r) => setTimeout(r, 3000));
  await page.evaluate(FINALIZE_APPEAR);
  out[name] = await page.evaluate(() => {
    const b = (e) => { if (!e) return null; const r = e.getBoundingClientRect();
      return { x: +r.x.toFixed(1), y: +(r.y + scrollY).toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; };
    const visible = (e) => { let n = e; while (n && n !== document.body) {
      if (getComputedStyle(n).display === 'none') return false; n = n.parentElement; } return true; };
    const reels = [...document.querySelectorAll('button')].filter((e) => {
      const r = e.getBoundingClientRect();
      return e.textContent.includes('PLAY REEL') && visible(e) && r.width > 0; });
    const greens = [...document.querySelectorAll('div')].filter((e) => {
      const cs = getComputedStyle(e);
      return cs.backgroundColor === 'rgb(26, 82, 65)' && visible(e) && e.getBoundingClientRect().height > 200; });
    const quick = [...document.querySelectorAll('p')].find((e) => e.textContent.includes('Quick info'));
    return {
      greens: greens.map((e) => ({ ...b(e), radius: getComputedStyle(e).borderRadius, wrapT: getComputedStyle(e.parentElement).transform })),
      reel: reels.map((e) => ({ ...b(e), radius: getComputedStyle(e).borderRadius })),
      heroH1: [...document.querySelectorAll('h1')].filter(visible).map((e) => ({
        t: e.textContent.trim(), size: getComputedStyle(e).fontSize, ...b(e) })),
      footH2: [...document.querySelectorAll('h2')].filter((e) => visible(e) && /work|together/i.test(e.textContent))
        .map((e) => ({ t: e.textContent.trim(), size: getComputedStyle(e).fontSize, ...b(e) })),
      email: [...document.querySelectorAll('h3')].filter((e) => visible(e) && e.textContent.includes('@'))
        .map((e) => ({ t: e.textContent.trim(), size: getComputedStyle(e).fontSize, ...b(e) })),
      quickTab: quick ? (() => { const p = quick.closest('a'); const r = (p || quick).getBoundingClientRect();
        return { ...b(p || quick), writingMode: getComputedStyle(p || quick).writingMode,
                 radius: getComputedStyle(p || quick).borderRadius }; })() : null,
      socialsBottom: (() => { const s = document.querySelector('[data-framer-name="socials-dark"]') ||
        document.querySelector('[data-framer-name="socials-white"]');
        return s ? b(s) : null; })(),
      scrollDown: (() => { const s = [...document.querySelectorAll('div')].find((e) =>
        getComputedStyle(e).borderRadius === '100px' && e.getBoundingClientRect().width === 60);
        return s ? b(s) : null; })(),
    };
  });
  await page.close();
}
await browser.close();
console.log(JSON.stringify(out, null, 1));