const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({viewport:{width:1440,height:900},ignoreHTTPSErrors:true,locale:'fr-FR'});
  const p = await ctx.newPage();
  const r = await p.goto('https://www.flyairsenegal.com',{waitUntil:'domcontentloaded',timeout:60000}).catch(e=>console.log('goto',e.message));
  await p.waitForTimeout(6000);
  console.log('status', r && r.status(), p.url());
  console.log('title', await p.title());
  const txt = await p.evaluate(()=>document.body.innerText);
  console.log(txt.slice(0,800));
  console.log('captcha?', /captcha|cloudflare|vérification|verify you are human|robot/i.test(txt+await p.content()));
  await b.close();
})();
