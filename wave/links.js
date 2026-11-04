const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({viewport:{width:1440,height:900},ignoreHTTPSErrors:true,locale:'fr-FR'})).newPage();
  await p.goto('https://www.wave.com/fr/',{waitUntil:'domcontentloaded',timeout:60000});
  await p.waitForTimeout(5000);
  const links = await p.evaluate(()=>[...document.querySelectorAll('a[href]')].map(a=>[a.textContent.trim().replace(/\s+/g,' ').slice(0,50),a.href]).filter(x=>x[0]&&x[1].includes('wave.com')));
  const seen=new Set(); links.forEach(l=>{if(!seen.has(l[1])){seen.add(l[1]);console.log(l[0],'|',l[1]);}});
  console.log('---TEXT'); console.log(await p.evaluate(()=>document.body.innerText));
  console.log('---COLORS');
  console.log(JSON.stringify(await p.evaluate(()=>{
    const cs=getComputedStyle(document.documentElement); const vars={};
    for(const s of document.styleSheets){try{for(const r of s.cssRules){if(r.style)for(const n of r.style){if(n.startsWith('--')&&/color|primary|secondary|bg|brand/i.test(n))vars[n]=r.style.getPropertyValue(n).trim();}}}catch(e){}}
    const cnt={};document.querySelectorAll('*').forEach(e=>{const c=getComputedStyle(e);[c.backgroundColor,c.color].forEach(v=>{if(v&&!/rgba\(0, 0, 0, 0\)/.test(v))cnt[v]=(cnt[v]||0)+1;});});
    return {vars:Object.fromEntries(Object.entries(vars).slice(0,30)),top:Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,14)};
  })));
  console.log('---IMGS'); console.log((await p.evaluate(()=>[...document.images].map(i=>i.currentSrc||i.src).filter(s=>/logo|svg|png|jpg|webp/i.test(s)))).join('\n'));
  await b.close();
})();
