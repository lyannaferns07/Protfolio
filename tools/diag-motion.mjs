import puppeteer from 'puppeteer-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new', args: ['--disable-gpu', '--hide-scrollbars'],
});
const page = await browser.newPage();
page.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE ERROR:', m.text().slice(0, 200)); });
page.on('pageerror', (e) => console.log('PAGE ERROR:', String(e).slice(0, 300)));
await page.setViewport({ width: 1440, height: 900 });
await page.goto('https://karolinahess.com/', { waitUntil: 'networkidle2', timeout: 90000 });
await new Promise((r) => setTimeout(r, 3000));

console.log(await page.evaluate(() => JSON.stringify({
  MotionIsMounted: window.MotionIsMounted,
  MotionHandoffAnimation: typeof window.MotionHandoffAnimation,
  MotionCheckAppearSync: typeof window.MotionCheckAppearSync,
  lenisStopped: window.lenis?.isStopped,
  lenisClass: document.documentElement.className,
}, null, 1)));

// Restart Lenis and try a real wheel.
await page.evaluate(() => window.lenis.start());
await page.mouse.move(700, 500);
for (let i = 0; i < 8; i++) {
  await page.mouse.wheel({ deltaY: 300 });
  await new Promise((r) => setTimeout(r, 250));
}
console.log('after lenis.start + wheel:', await page.evaluate(() => JSON.stringify({
  y: Math.round(window.scrollY),
  lenisY: Math.round(window.lenis.animatedScroll),
  worksX: Math.round(document.querySelector('[data-framer-name="works"]').getBoundingClientRect().x),
  cls: document.documentElement.className,
})));

await browser.close();