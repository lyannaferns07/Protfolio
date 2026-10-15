import puppeteer from 'puppeteer-core';
import { FINALIZE_APPEAR } from './appear.mjs';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const VPS = { desktop: [1440, 900], tablet: [900, 1000], mobile: [390, 844] };

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new', args: ['--disable-gpu', '--hide-scrollbars'],
});

const all = {};
for (const [name, [w, h]] of Object.entries(VPS)) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h });
  await page.goto('https://karolinahess.com/', { waitUntil: 'networkidle2', timeout: 90000 });
  await new Promise((r) => setTimeout(r, 3000));
  await page.evaluate(FINALIZE_APPEAR);
  await new Promise((r) => setTimeout(r, 300));

  all[name] = await page.evaluate(() => {
    const box = (e) => {
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return { x: +r.x.toFixed(1), y: +(r.y + scrollY).toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) };
    };
    const named = (n) => document.querySelector(`[data-framer-name="${n}"]`);
    const byText = (tag, txt) =>
      [...document.querySelectorAll(tag)].find((e) => e.textContent.trim().startsWith(txt));
    const typeOf = (e) => {
      if (!e) return null;
      const cs = getComputedStyle(e);
      const r = e.getBoundingClientRect();
      return {
        text: e.textContent.trim().slice(0, 34),
        size: cs.fontSize, lh: cs.lineHeight, ls: cs.letterSpacing,
        weight: cs.fontWeight, color: cs.color, align: cs.textAlign,
        font: cs.fontFamily.split(',')[0].replace(/"/g, ''),
        box: { x: +r.x.toFixed(1), y: +(r.y + scrollY).toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) },
      };
    };
    const s2 = document.querySelector('#section-02');
    const s3 = document.querySelector('#section03');
    const reel = document.querySelector('[data-framer-name="reel-button"]') ||
                  document.querySelector('#jfcdl4 > div');

    return {
      docH: document.documentElement.scrollHeight,
      sections: {
        hero: box(document.querySelector('[data-framer-name="hero-section"]')),
        s2: { ...box(s2), bg: getComputedStyle(s2.firstElementChild).backgroundColor,
              radius: getComputedStyle(s2.firstElementChild).borderRadius },
        s3: box(s3),
        footer: box(document.querySelector('footer')),
      },
      stickyWrap: (() => { const e = named('wrapper-sticky'); const cs = e && getComputedStyle(e);
        return e ? { ...box(e), position: cs.position, radius: cs.borderRadius, overflow: cs.overflow } : null; })(),
      works: (() => { const e = named('works'); if (!e) return null;
        return { ...box(e), gap: getComputedStyle(e).gap, align: getComputedStyle(e).alignItems }; })(),
      cards: [...document.querySelectorAll('[data-framer-name^="work-"]')].map((e) => {
        const r = e.getBoundingClientRect();
        return { n: e.getAttribute('data-framer-name'), w: +r.width.toFixed(1), h: +r.height.toFixed(1),
                 radius: getComputedStyle(e).borderRadius, bg: getComputedStyle(e).backgroundColor };
      }),
      header: (() => { const e = document.querySelector('header'); const cs = getComputedStyle(e);
        return { ...box(e), position: cs.position, z: cs.zIndex, pad: cs.padding }; })(),
      nav: (() => { const e = document.querySelector('nav'); const cs = getComputedStyle(e);
        return { ...box(e), position: cs.position, radius: cs.borderRadius, bg: cs.backgroundColor }; })(),
      cta: (() => { const e = document.querySelector('[data-framer-name="call-to-action-default"]');
        return e ? { ...box(e), radius: getComputedStyle(e).borderRadius, bg: getComputedStyle(e).backgroundColor } : null; })(),
      reel: reel ? { ...box(reel), radius: getComputedStyle(reel).borderRadius } : null,
      type: {
        hero1: typeOf(byText('h1', 'Creative')),
        hero2: typeOf(byText('h1', 'Designer')),
        subline: typeOf(byText('p', 'specialized')),
        hybrid: typeOf(byText('h3', 'Designer/developer')),
        introA: typeOf(byText('h2', 'I design')),
        introB: typeOf(byText('h2', 'No templates')),
        reel: typeOf(byText('h1,h2,h3', 'PLAY REEL')),
        statement: typeOf(byText('h3', 'Just')),
        recent: typeOf(byText('h2', 'Recent works')),
        foot1: typeOf(byText('h2', 'Let')),
        foot2: typeOf(byText('h2', 'together')),
        email: typeOf(byText('h3', 'hesskarolina')),
        dropme: typeOf(byText('p', 'Drop me')),
        navlink: typeOf(byText('p', 'HOME')),
        ctaLabel: typeOf(byText('p', 'Contact')),
      },
      heroPhoto: (() => { const e = named('photo'); return e ? box(e) : null; })(),
      footerPic: (() => { const e = document.querySelector('[data-framer-name="pic"]'); return e ? box(e) : null; })(),
    };
  });
  await page.close();
}
await browser.close();
console.log(JSON.stringify(all, null, 1));