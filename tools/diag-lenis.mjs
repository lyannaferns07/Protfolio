import puppeteer from 'puppeteer-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--disable-gpu', '--hide-scrollbars'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('https://karolinahess.com/', { waitUntil: 'networkidle2', timeout: 90000 });
await new Promise((r) => setTimeout(r, 2500));

console.log(await page.evaluate(() => {
  const keys = Object.keys(window).filter((k) => /lenis|Lenis|smooth|scroll/i.test(k));
  const all = [...document.querySelectorAll('*')].map((e) => e).length;
  return JSON.stringify({
    winKeys: keys,
    htmlClass: document.documentElement.className,
    bodyClass: document.body.className,
    scrollHeight: document.documentElement.scrollHeight,
    innerHeight: window.innerHeight,
    nodes: all,
  }, null, 1);
}));

// Try keyboard scrolling, which bypasses wheel handling entirely.
await page.click('body').catch(() => {});
for (let i = 0; i < 6; i++) {
  await page.keyboard.press('PageDown');
  await new Promise((r) => setTimeout(r, 400));
}
console.log('after PageDown x6:', await page.evaluate(() => JSON.stringify({
  y: Math.round(window.scrollY),
  worksX: Math.round(document.querySelector('[data-framer-name="works"]').getBoundingClientRect().x),
})));

await browser.close();