const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'fr-FR' })).newPage();
  await p.goto('https://flyairsenegal.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForTimeout(4000);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 400) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(150); }
  const els = await p.$$('img, [style*="background-image"]');
  let i = 0;
  for (const e of els) {
    const bb = await e.boundingBox();
    if (!bb || bb.width < 250 || bb.height < 160) continue;
    const info = await e.evaluate(n => (n.currentSrc || n.src || n.style.backgroundImage || '').slice(-70));
    await e.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
    await e.screenshot({ path: 'assets/h_' + i + '.png' }).catch(() => {});
    console.log(i, Math.round(bb.width), Math.round(bb.height), info);
    i++;
  }
  await b.close();
})();
