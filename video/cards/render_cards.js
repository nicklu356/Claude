// Renders every SVG in output/problem_cards to a 1920x1080 PNG next to it (headless Chromium).
// Usage: cd video && node cards/render_cards.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const DIR = path.resolve(__dirname, '../../output/problem_cards');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const f of fs.readdirSync(DIR).filter((f) => f.endsWith('.svg')).sort()) {
    await page.goto('file://' + path.join(DIR, f));
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(DIR, f.replace(/\.svg$/, '.png')), omitBackground: true });
    console.log('rendered', f);
  }
  await browser.close();
})();
