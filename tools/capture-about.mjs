import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.resolve('./shots-about');
await mkdir(outDir, { recursive: true });

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1024', width: 1024, height: 900 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844 },
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1'],
});

for (const vp of viewports) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait for loading screen to complete and exit
  await new Promise((r) => setTimeout(r, 4500));

  // Scroll to #about using Lenis or anchor
  await page.evaluate(() => {
    // @ts-ignore
    if (window.lenis) {
      // @ts-ignore
      window.lenis.scrollTo('#about', { immediate: true });
    } else {
      const el = document.getElementById('about');
      if (el) el.scrollIntoView();
    }
  });

  await new Promise((r) => setTimeout(r, 1500));

  // Capture screenshot of #about
  const aboutEl = await page.$('#about');
  if (aboutEl) {
    await aboutEl.screenshot({ path: path.join(outDir, `${vp.name}.png`) });
    console.log(`Captured ${vp.name}`);
  } else {
    console.log(`Could not find #about for ${vp.name}`);
  }

  await page.close();
}

await browser.close();
console.log('All about captures complete');
