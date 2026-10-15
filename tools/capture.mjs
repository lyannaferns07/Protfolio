/**
 * Screenshot capture harness.
 * Used to capture the reference site and the local recreation at matching
 * viewports / scroll offsets so the two can be compared directly.
 *
 * Usage:
 *   node tools/capture.mjs <url> <outDir> [preset]
 * Presets: desktop (1440x900), tablet (900x1100), mobile (390x844)
 */
import puppeteer from 'puppeteer-core';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { FINALIZE_APPEAR } from './appear.mjs';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const PRESETS = {
  desktop: { width: 1440, height: 900, dsf: 1 },
  tablet: { width: 900, height: 1000, dsf: 1 },
  mobile: { width: 390, height: 844, dsf: 2 },
};

/** Stops Framer's "remix this site" badge panel so it never pollutes a capture. */
const HIDE_OVERLAYS = `
  #template-overlay, #overlay, [id^="framer-badge"] { display: none !important; }
`;

const args = process.argv.slice(2);
const url = args[0] || 'https://karolinahess.com/';
const outDir = path.resolve(args[1] || './shots');
const presets = args[2] ? args[2].split(',') : ['desktop'];

await mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--font-render-hinting=none'],
});

const report = {};

for (const preset of presets) {
  const vp = PRESETS[preset];
  if (!vp) throw new Error(`unknown preset: ${preset}`);

  const page = await browser.newPage();
  await page.setViewport({
    width: vp.width,
    height: vp.height,
    deviceScaleFactor: vp.dsf,
    isMobile: preset === 'mobile',
    hasTouch: preset === 'mobile',
  });

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
  // Let fonts + Framer appear animations settle (they are delay-based, up to ~2.3s).
  await new Promise((r) => setTimeout(r, 3500));
  await page.addStyleTag({ content: HIDE_OVERLAYS });
  // Resolve Framer's deadlocked appear handoff so captures show intended states.
  const finalized = await page.evaluate(FINALIZE_APPEAR);
  if (process.env.VERBOSE) console.log(preset, finalized);

  const { scrollHeight } = await page.evaluate(() => ({
    scrollHeight: document.documentElement.scrollHeight,
  }));
  const vh = vp.height;
  // Capture successive viewport-height steps plus the very bottom.
  const steps = [];
  for (let y = 0; y <= scrollHeight - vh; y += vh) steps.push(y);
  const last = Math.max(0, scrollHeight - vh);
  if (steps[steps.length - 1] !== last) steps.push(last);

  report[preset] = { viewport: `${vp.width}x${vp.height}`, scrollHeight, steps };

  for (const y of steps) {
    // Real wheel input so Lenis + scroll-linked effects run exactly as for a user.
    await page.evaluate((target) => {
      const inst = window.__lenisInstance;
      if (inst && inst.scrollTo) inst.scrollTo(target, { immediate: true, force: true });
      else window.scrollTo(0, target);
    }, y);
    await new Promise((r) => setTimeout(r, 900));
    // Framer's appear handoff re-applies its stuck state on any re-render, so
    // re-resolve it immediately before the shot rather than once after load.
    await page.evaluate(FINALIZE_APPEAR);
    const file = path.join(outDir, `${preset}-${String(y).padStart(5, '0')}.png`);
    await page.screenshot({ path: file });
  }

  await page.close();
}

await browser.close();
await writeFile(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));