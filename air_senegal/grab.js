const { chromium } = require('playwright');
const T=[
 ['dest','https://flights.flyairsenegal.com/fr/sitemap/vols-entre-villes/page-1','278 résultats',1500],
 ['pay','https://flights.flyairsenegal.com/fr/','Orange Money',420],
 ['bag','https://flyairsenegal.com/planifier/bagages-et-frais-de-service/','deux bagages de 23',700],
 ['tiers','https://flyairsenegal.com/le-programme-teranga/','Teranga Diamond',900],
 ['vip','https://flyairsenegal.com/le-programme-teranga/','salon VIP',700],
 ['contact','https://flyairsenegal.com/contact-4/','07h à 21h',800],
];
(async()=>{
 const b=await chromium.launch();
 for(const [n,u,txt,hh] of T){
  const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,locale:'fr-FR'});
  const p=await ctx.newPage();
  await p.goto(u,{waitUntil:'domcontentloaded',timeout:60000}); await p.waitForTimeout(4000);
  await p.addStyleTag({content:'#cookie-law-info-bar,.cookie,[class*=cookie],[id*=cookie],[class*=Cookie]{display:none!important}'});
  const y=await p.evaluate(t=>{const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){if(n.textContent.includes(t)){const r=n.parentElement.getBoundingClientRect();if(r.height>0)return r.top+scrollY;}}return -1;},txt);
  const H=await p.evaluate(()=>document.documentElement.scrollHeight);
  const y0=Math.max(0,Math.min(y-hh*0.35,H-hh));
  await p.evaluate(y=>window.scrollTo(0,y),y0); await p.waitForTimeout(800);
  await p.screenshot({path:`build/assets/c_${n}.png`,fullPage:true,clip:{x:0,y:y0,width:390,height:hh}});
  console.log(n,'y=',Math.round(y),'H=',H);
  await ctx.close();
 }
 // heros
 for(const [n,u] of [['hero_bag','https://flyairsenegal.com/planifier/bagages-et-frais-de-service/'],['hero_ter','https://flyairsenegal.com/le-programme-teranga/']]){
  const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,locale:'fr-FR'});const p=await ctx.newPage();
  await p.goto(u,{waitUntil:'domcontentloaded',timeout:60000});await p.waitForTimeout(4000);
  await p.screenshot({path:`build/assets/c_${n}.png`,clip:{x:0,y:175,width:390,height:380}});await ctx.close();
 }
 await b.close();
})();
