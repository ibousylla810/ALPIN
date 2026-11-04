const { chromium } = require('playwright'); const path=require('path'); const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+path.resolve('index.html'));await p.evaluate(()=>window.__ready);
const s=await p.evaluate(()=>window.__sfx);fs.writeFileSync('sfx.json',JSON.stringify(s));console.log(s.length,JSON.stringify(s).slice(0,400));await b.close();})();
