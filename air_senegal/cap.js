const { chromium } = require('playwright');
const fs=require('fs');
const pages=[
 ['01_accueil','https://flyairsenegal.com/'],
 ['02_reservation','https://flights.flyairsenegal.com/fr/'],
 ['03_destinations','https://flights.flyairsenegal.com/fr/sitemap/vols-entre-villes/page-1'],
 ['04_bagages','https://flyairsenegal.com/planifier/bagages-et-frais-de-service/'],
 ['05_fidelite','https://flyairsenegal.com/le-programme-teranga/'],
 ['06_contact','https://flyairsenegal.com/contact-4/']
];
(async () => {
  const b = await chromium.launch();
  for (const [name,url] of pages){
    for (const mode of ['mobile','bureau']){
      const ctx = await b.newContext(mode==='mobile'?{viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,ignoreHTTPSErrors:true,locale:'fr-FR'}:{viewport:{width:1440,height:900},deviceScaleFactor:1,ignoreHTTPSErrors:true,locale:'fr-FR'});
      const p = await ctx.newPage();
      try{
        const r = await p.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
        await p.waitForTimeout(5000);
        const body = await p.evaluate(()=>document.body.innerText);
        const blocked = /captcha|vérification de sécurité|verify you are human|un instant|access denied/i.test(body.slice(0,600));
        const h = await p.evaluate(()=>document.documentElement.scrollHeight);
        for(let y=0;y<Math.min(h,5000);y+=500){await p.evaluate(y=>window.scrollTo(0,y),y);await p.waitForTimeout(200);}
        await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(1200);
        await p.screenshot({path:`captures/${name}_${mode}.png`,fullPage:true});
        if(mode==='bureau') fs.writeFileSync(`texts/${name}.txt`,`URL: ${p.url()}\nSTATUS: ${r.status()}\n\n`+body);
        console.log(name,mode,r.status(),'h='+h,blocked?'BLOQUÉ?':'ok',p.url());
      }catch(e){console.log(name,mode,'ERREUR',e.message.slice(0,100));}
      await ctx.close();
    }
  }
  await b.close();
})();
