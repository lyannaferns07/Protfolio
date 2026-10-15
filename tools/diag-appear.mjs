import puppeteer from 'puppeteer-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--disable-gpu', '--hide-scrollbars'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(process.argv[2] || 'https://karolinahess.com/', { waitUntil: 'networkidle2', timeout: 90000 });

for (const wait of [1000, 3000, 6000]) {
  await new Promise((r) => setTimeout(r, wait === 1000 ? 1000 : 2000 + (wait === 3000 ? 0 : 2000)));
  const s = await page.evaluate(() => {
    const q = (sel) => document.querySelector(sel);
    const cs = (el) => (el ? getComputedStyle(el).transform : 'MISSING');
    const anims = document.getAnimations().length;
    const running = document.getAnimations()
      .filter((a) => a.playState === 'running')
      .map((a) => a.effect?.target?.className?.toString().slice(0, 40) + ' :: ' + a.effect?.getTiming?.().delay)
      .slice(0, 12);
    return {
      Web: cs(q('[data-framer-name="Web"]')),
      Designer: cs(q('[data-framer-name="Designer"]')),
      subtext: cs(q('[data-framer-name="specialized in branding and no-code development"]')),
      photoWrap: cs(q('[data-framer-name="photo"]')),
      photoOpacity: q('[data-framer-name="photo"]') ? getComputedStyle(q('[data-framer-name="photo"]').parentElement).opacity : null,
      anims, running,
    };
  });
  console.log('after ~' + wait + 'ms:', JSON.stringify(s, null, 1));
}
await browser.close();