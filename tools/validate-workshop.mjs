/**
 * Validate the Workshop section (pinned, scroll-driven overlapping deck).
 *
 * Usage: node tools/validate-workshop.mjs [baseUrl]
 *
 * Checks, in a real Chromium:
 *   - no page-level horizontal overflow anywhere (scrollWidth == clientWidth)
 *   - every project image actually loads (naturalWidth > 0) and no 404s
 *   - each incoming card enters from BEYOND the right edge, moving
 *     monotonically left into place, and settles centred
 *   - the previous card stays centred (never exits left) while a newer card
 *     layers above it (higher z-index) and it subtly shrinks + darkens
 *   - content reveal order inside an incoming card: media -> text -> tech
 *   - the section stays pinned during the transitions and releases after
 *   - scrolling back up reverses everything
 *   - mobile + reduced-motion render a static vertical stack (no horizontal
 *     scroller, no horizontal overflow, section not pinned)
 *   - the dead "/workshop" link is gone; the only live link is Elephant Grey
 *   - no console errors
 */
import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = process.argv[2] || 'http://127.0.0.1:5174/';
const OUT = './shots-workshop';
await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1'],
});

const results = [];
const check = (name, pass, detail) => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function scrollTo(page, y) {
  await page.evaluate((t) => {
    const inst = window.lenis;
    if (inst && inst.scrollTo) inst.scrollTo(t, { immediate: true, force: true });
    else window.scrollTo(0, t);
  }, y);
}

const centerX = (c) => c.left + c.width / 2;

const sampleState = () =>
  page => page.evaluate(() => {
    const sec = document.getElementById('workshop');
    const cards = [...sec.querySelectorAll('li[data-card]')];
    const stage = sec.firstElementChild;
    const stageRect = stage.getBoundingClientRect();
    const parseScale = (t) => {
      if (!t || t === 'none') return 1;
      const m = t.match(/matrix\(([^)]+)\)/);
      if (!m) return 1;
      return Number(m[1].split(',')[0]);
    };
    return {
      scrollY: Math.round(window.scrollY),
      stageTop: Math.round(stageRect.top),
      stagePos: getComputedStyle(stage).position,
      vw: window.innerWidth,
      vh: window.innerHeight,
      cards: cards.map((c) => {
        const r = c.getBoundingClientRect();
        const cs = getComputedStyle(c);
        const q = (sel) => {
          const el = c.querySelector(sel);
          return el ? Number(getComputedStyle(el).opacity) : null;
        };
        return {
          left: Math.round(r.left),
          right: Math.round(r.right),
          width: Math.round(r.width),
          height: Math.round(r.height),
          z: Number(cs.zIndex) || 0,
          opacity: Number(cs.opacity),
          scale: Math.round(parseScale(cs.transform) * 1000) / 1000,
          filter: cs.filter,
          reveal: {
            media: q('[data-reveal-media]'),
            text: q('[data-reveal]'),
            tech: q('[data-reveal-tech]'),
            live: q('[data-live]'),
          },
        };
      }),
    };
  });

const overflowProbe = () =>
  page => page.evaluate(() => {
    const de = document.documentElement;
    return { scrollWidth: de.scrollWidth, clientWidth: de.clientWidth };
  });

const collect = { consoleErrors: [], failedRequests: [] };

for (const vp of [
  { name: 'desktop', width: 1440, height: 900, animated: true },
  { name: 'laptop', width: 1366, height: 768, animated: true },
  { name: 'tablet', width: 900, height: 1000, animated: false },
  { name: 'mobile', width: 390, height: 844, animated: false },
]) {
  const page = await browser.newPage();
  const consoleErrors = [];
  const failedRequests = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));
  page.on('requestfailed', (r) => failedRequests.push(`${r.url()} :: ${r.failure()?.errorText}`));
  page.on('response', (r) => { if (r.status() >= 400) failedRequests.push(`${r.status()} ${r.url()}`); });

  await page.setViewport({
    width: vp.width, height: vp.height,
    isMobile: vp.name === 'mobile', hasTouch: vp.name === 'mobile',
  });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 90000 });
  await sleep(3000);

  const tag = `[${vp.name} ${vp.width}x${vp.height}]`;
  const S = sampleState();

  const geo = await page.evaluate(() => {
    const sec = document.getElementById('workshop');
    const r = sec.getBoundingClientRect();
    return { top: r.top + window.scrollY, height: r.height, vh: innerHeight };
  });

  if (vp.animated) {
    const pinnedRange = geo.height - geo.vh;
    check(`${tag} section is tall (pin driver)`, geo.height > geo.vh * 3,
      `height=${Math.round(geo.height)} vh=${geo.vh}`);

    const fracs = [0, 0.06, 0.19, 0.30, 0.47, 0.60, 0.75, 0.90, 0.98];
    const samples = [];
    for (const f of fracs) {
      await scrollTo(page, Math.round(geo.top + pinnedRange * f));
      await sleep(950);
      samples.push({ f, s: await S(page) });
    }
    const at = (f) => samples.reduce((b, s) => (Math.abs(s.f - f) < Math.abs(b.f - f) ? s : b)).s;

    // Overflow
    check(`${tag} no horizontal overflow (mid-pin)`,
      (await overflowProbe()(page)).scrollWidth <= vp.width + 1);
    await scrollTo(page, 0); await sleep(400);
    const ov0 = await overflowProbe()(page);
    check(`${tag} no horizontal overflow (top)`, ov0.scrollWidth <= ov0.clientWidth + 1,
      `scrollWidth=${ov0.scrollWidth} clientWidth=${ov0.clientWidth}`);

    // Pin
    const held = samples.filter((s) => s.f > 0.02 && s.f < 0.99).every((s) => Math.abs(s.s.stageTop) <= 1);
    check(`${tag} section stays pinned during transitions`, held,
      `stage.top: ${samples.map((s) => s.s.stageTop).join(',')}`);

    // Initial state
    const start = at(0);
    const vw = start.vw;
    const c0 = start.cards[0];
    const settledCenter = centerX(c0);
    check(`${tag} first card centred at start`,
      c0.left > 0 && c0.right <= vw + 1,
      `card0 left=${c0.left} right=${c0.right} vw=${vw}`);
    check(`${tag} later cards start beyond the right edge`,
      start.cards.slice(1).every((c) => c.left >= vw - 2),
      `lefts: ${start.cards.map((c) => c.left).join(',')} vw=${vw}`);

    // Per-transition geometry
    const windows = [
      { i: 1, fs: [0.06, 0.19, 0.30] },
      { i: 2, fs: [0.30, 0.47, 0.60] },
      { i: 3, fs: [0.60, 0.75, 0.90] },
    ];
    for (const { i, fs } of windows) {
      const series = fs.map((f) => ({ f, card: at(f).cards[i], prev: at(f).cards[i - 1] }));
      const lefts = series.map((s) => s.card.left);
      const monotonic = lefts.every((l, k) => k === 0 || l <= lefts[k - 1] + 3);
      const fromRight = series[0].card.left > vw;
      const arrives = Math.abs(centerX(series[series.length - 1].card) - settledCenter) <= 3;
      check(`${tag} card ${i + 1}: from right → settles centre (monotonic)`,
        fromRight && monotonic && arrives,
        `lefts ${lefts.join(' → ')} (settled centre ${settledCenter})`);

      const above = series[series.length - 1].card.z > series[series.length - 1].prev.z;
      check(`${tag} card ${i + 1}: layers above previous (z)`, above,
        `z: ${at(fs[1]).cards.map((c) => c.z).join(',')}`);

      const prevCentres = series.map((s) => centerX(s.prev));
      const prevStays = prevCentres.every((c) => Math.abs(c - settledCenter) <= 2);
      const prevRecedes = series.some(
        (s) => s.prev.scale < 0.999 || /brightness\(0\./.test(s.prev.filter)
      );
      check(`${tag} card ${i + 1}: previous stays centred & recedes (no exit-left)`,
        prevStays && prevRecedes,
        `prev centres: ${prevCentres.join(',')} scale: ${series.map((s) => s.prev.scale).join(',')}`);
    }

    // Final settle: identical centres, top card full size, covered cards inset
    const endS = at(0.98);
    const centres = endS.cards.map(centerX);
    const identicalCentres = centres.every((c) => Math.abs(c - settledCenter) <= 2);
    const full = endS.cards[3];
    const covered = endS.cards.slice(0, 3);
    const sizeOk =
      Math.abs(full.width - c0.width) <= 2 &&
      covered.every((c) => c.width <= full.width + 1 && c.scale <= 0.96);
    check(`${tag} all cards settle on the same centre (top full, covered inset)`,
      identicalCentres && sizeOk,
      `centres=${centres.join(',')} widths=${endS.cards.map((c) => c.width).join(',')} scales=${endS.cards.map((c) => c.scale).join(',')}`);

    // Reveal order for the final (incoming) card — sampled once the
    // whole reveal sequence (media → text → tech → live) has finished.
    const rev = at(0.98).cards[3].reveal;
    check(`${tag} incoming card fully revealed (media, text, tech, live)`,
      rev.media === 1 && rev.text === 1 && rev.tech === 1 && rev.live === 1,
      JSON.stringify(rev));

    // Counter at the settled end (scroll back to the final card first — the
    // overflow probe above parked the page at the top of the section)
    await scrollTo(page, Math.round(geo.top + pinnedRange * 0.98));
    await sleep(950);
    const counter = await page.evaluate(() =>
      document.querySelector('#workshop [aria-live="polite"]')?.textContent?.trim()
    );
    check(`${tag} counter reads 04 / 04 at the end`, /04\s*\/\s*04/.test(counter || ''), `"${counter}"`);

    // Release
    await scrollTo(page, Math.round(geo.top + pinnedRange + geo.vh * 0.6));
    await sleep(700);
    const after = await S(page);
    check(`${tag} section releases after final card`, after.stageTop < -10,
      `stage.top=${after.stageTop}`);

    // Reverse
    await scrollTo(page, Math.round(geo.top));
    await sleep(1100);
    const back = await S(page);
    check(`${tag} reverse restores initial state`,
      Math.abs(centerX(back.cards[0]) - settledCenter) <= 3 &&
        back.cards.slice(1).every((c) => c.left >= vw - 60),
      `card0 centre=${centerX(back.cards[0])} others: ${back.cards.slice(1).map((c) => c.left).join(',')}`);

    // Screenshots
    await scrollTo(page, Math.round(geo.top + pinnedRange * 0.19));
    await sleep(900);
    await page.screenshot({ path: `${OUT}/${vp.name}-mid.png` });
    await scrollTo(page, Math.round(geo.top + pinnedRange * 0.98));
    await sleep(900);
    await page.screenshot({ path: `${OUT}/${vp.name}-settled.png` });
  } else {
    // ── Mobile: static vertical stack, no horizontal scroller ──────
    // Load every lazy image before judging them.
    await page.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 1200));
      window.scrollTo(0, 0);
    });
    await sleep(1200);

    const stacked = await page.evaluate(() => {
      const cards = [...document.querySelectorAll('#workshop li[data-card]')];
      const rects = cards.map((c) => {
        const r = c.getBoundingClientRect();
        return { left: Math.round(r.left), top: Math.round(r.top + window.scrollY), transform: getComputedStyle(c).transform };
      });
      let hScroller = false;
      document.querySelectorAll('#workshop *').forEach((el) => {
        const cs = getComputedStyle(el);
        if ((cs.overflowX === 'auto' || cs.overflowX === 'scroll') && el.scrollWidth > el.clientWidth + 2) hScroller = true;
      });
      const sec = document.getElementById('workshop');
      return {
        rects,
        hScroller,
        sectionHeight: sec.getBoundingClientRect().height,
        stagePos: getComputedStyle(sec.firstElementChild).position,
        vh: window.innerHeight,
      };
    });
    const tops = stacked.rects.map((r) => r.top);
    const increasing = tops.every((t, i) => i === 0 || t > tops[i - 1] + 20);
    const sameLeft = stacked.rects.every((r) => Math.abs(r.left - stacked.rects[0].left) <= 2);
    check(`${tag} cards stack vertically (no horizontal gallery)`,
      increasing && sameLeft && !stacked.hScroller,
      `tops=${tops.join(',')} lefts=${stacked.rects.map((r) => r.left).join(',')} hScroller=${stacked.hScroller}`);
    check(`${tag} section not pinned (auto height, stage relative)`,
      stacked.sectionHeight < stacked.vh * 4 && stacked.stagePos === 'relative',
      `height=${Math.round(stacked.sectionHeight)} vh=${stacked.vh} stagePos=${stacked.stagePos}`);

    // Every card must actually show its text and mockup at this width.
    const content = await page.evaluate(() => {
      const cards = [...document.querySelectorAll('#workshop li[data-card]')];
      return cards.map((c) => {
        const title = c.querySelector('h3');
        const img = c.querySelector('img');
        const tR = title?.getBoundingClientRect();
        const iR = img?.getBoundingClientRect();
        return {
          titleVisible:
            !!title && getComputedStyle(title).display !== 'none' && (tR?.width ?? 0) > 0,
          imgVisible: !!img && (iR?.width ?? 0) > 0 && img.naturalWidth > 0,
        };
      });
    });
    check(`${tag} every card shows title + mockup`,
      content.every((c) => c.titleVisible && c.imgVisible),
      JSON.stringify(content));

    const ovm = await overflowProbe()(page);
    check(`${tag} no horizontal overflow`, ovm.scrollWidth <= ovm.clientWidth + 1,
      `scrollWidth=${ovm.scrollWidth} clientWidth=${ovm.clientWidth}`);

    await page.screenshot({ path: `${OUT}/${vp.name}-stack.png` });
  }

  // ── Images (after any lazy loading) ──────────────────────────────
  const imgs = await page.evaluate(() =>
    [...document.querySelectorAll('#workshop img')].map((i) => ({
      src: i.getAttribute('src'), ok: i.complete && i.naturalWidth > 0, nw: i.naturalWidth,
    }))
  );
  const broken = imgs.filter((i) => !i.ok);
  check(`${tag} project images load`, broken.length === 0,
    `${imgs.length} images, broken: ${broken.map((i) => i.src).join(', ') || 'none'}`);

  // ── Links ─────────────────────────────────────────────────────────
  const links = await page.evaluate(() =>
    [...document.querySelectorAll('#workshop a')].map((a) => ({
      href: a.getAttribute('href'), label: a.textContent.trim(), live: a.hasAttribute('data-live'),
    }))
  );
  check(`${tag} no dead "/workshop" link`, !links.some((a) => a.href === '/workshop'));
  const live = links.filter((a) => a.live);
  check(`${tag} only Elephant Grey exposes a Live link`,
    live.length === 1 && /elephant-grey\.com/.test(live[0]?.href || ''),
    live.map((a) => `${a.label}->${a.href}`).join(' | ') || 'none');

  // ── Case study modal (desktop only) ─────────────────────────────
  if (vp.name === 'desktop') {
    // Bring the third card to the top so its case-study button is
    // actually revealed and on-screen before clicking it.
    await scrollTo(page, Math.round(geo.top + (geo.height - geo.vh) * 0.62));
    await sleep(1200);
    // Target the action link on the *topmost* card (3rd card is settled at
    // this scroll depth) — links on covered cards are hidden beneath it.
    const btn = await page.$('#workshop li[data-card]:nth-of-type(3) button[data-live]');
    if (btn) {
      await btn.click();
      await sleep(700);
      const modal = await page.evaluate(() => {
        const d = document.querySelector('[role="dialog"], [aria-modal="true"]');
        return d ? { open: true, title: d.querySelector('h2')?.textContent?.trim() } : { open: false };
      });
      check(`${tag} case study opens a modal`, modal.open, `title="${modal.title ?? ''}"`);
      await page.keyboard.press('Escape');
      await sleep(400);
      const closed = await page.evaluate(
        () => !document.querySelector('[role="dialog"], [aria-modal="true"]')
      );
      check(`${tag} case study modal closes on Escape`, closed);
    } else {
      check(`${tag} case study button present`, false, 'no button found');
    }
  }

  check(`${tag} header nav points at #workshop`,
    await page.evaluate(() => !!document.querySelector('header a[href="#workshop"]')));

  collect.consoleErrors.push(...consoleErrors.map((e) => `${tag} ${e}`));
  collect.failedRequests.push(...failedRequests.map((e) => `${tag} ${e}`));
  await page.close();
}

// ── Reduced-motion pass (desktop width) ─────────────────────────────
{
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 90000 });
  await sleep(2500);
  const rm = await page.evaluate(() => {
    const sec = document.getElementById('workshop');
    const cards = [...sec.querySelectorAll('li[data-card]')];
    const rects = cards.map((c) => {
      const r = c.getBoundingClientRect();
      const cs = getComputedStyle(c);
      return { left: Math.round(r.left), top: Math.round(r.top + window.scrollY), transform: cs.transform, opacity: cs.opacity };
    });
    let hScroller = false;
    sec.querySelectorAll('*').forEach((el) => {
      const cs = getComputedStyle(el);
      if ((cs.overflowX === 'auto' || cs.overflowX === 'scroll') && el.scrollWidth > el.clientWidth + 2) hScroller = true;
    });
    const de = document.documentElement;
    return {
      height: sec.getBoundingClientRect().height, vh: innerHeight,
      stagePos: getComputedStyle(sec.firstElementChild).position,
      rects, hScroller, scrollWidth: de.scrollWidth, clientWidth: de.clientWidth,
    };
  });
  const tops = rm.rects.map((r) => r.top);
  const increasing = tops.every((t, i) => i === 0 || t > tops[i - 1] + 20);
  const noTransform = rm.rects.every((r) => r.transform === 'none' || r.transform === 'matrix(1, 0, 0, 1, 0, 0)');
  const visible = rm.rects.every((r) => Number(r.opacity) > 0.99);
  check('[reduced-motion] static stacked fallback, no animation',
    increasing && noTransform && visible && !rm.hScroller && rm.stagePos === 'relative',
    `tops=${tops.join(',')} stagePos=${rm.stagePos} hScroller=${rm.hScroller}`);
  check('[reduced-motion] section not pinned',
    rm.height < rm.vh * 4 && rm.stagePos === 'relative', `height=${Math.round(rm.height)}`);
  check('[reduced-motion] no horizontal overflow', rm.scrollWidth <= rm.clientWidth + 1);
  check('[reduced-motion] no page errors', errs.length === 0, errs.join('; '));
  await page.screenshot({ path: `${OUT}/reduced-motion.png` });
  await page.close();
}

check('no console errors (all passes)', collect.consoleErrors.length === 0,
  collect.consoleErrors.slice(0, 6).join(' | '));
check('no failed requests (all passes)', collect.failedRequests.length === 0,
  collect.failedRequests.slice(0, 6).join(' | '));

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`\n==== ${results.length - failed.length}/${results.length} checks passed ====`);
if (failed.length) {
  console.log('FAILURES:');
  failed.forEach((f) => console.log(` - ${f.name}: ${f.detail}`));
  process.exitCode = 1;
}
