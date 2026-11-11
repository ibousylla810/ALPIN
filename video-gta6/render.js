// usage: node render.js <outDir> <startFrame> <endFrame> | node render.js --times t1,t2 <outDir> | node render.js --sfx <file>
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const FPS = 30; let times, outDir, startF=0;
  const a = process.argv;
  if (a[2]==='--times'){ times=a[3].split(',').map(Number); outDir=a[4]; }
  else if (a[2]==='--sfx'){ times=[]; }
  else { outDir=a[2]; startF=+a[3]; const endF=+a[4]; times=[]; for(let f=startF;f<endF;f++) times.push(f/FPS); }
  const b = await chromium.launch({args:['--allow-file-access-from-files','--force-device-scale-factor=1']});
  const p = await (await b.newContext({viewport:{width:1080,height:1920},deviceScaleFactor:1})).newPage();
  p.on('pageerror',e=>console.log('PAGEERROR',e.message)); p.on('console',m=>{ if(m.type()==='error') console.log('CONSOLE',m.text()); });
  await p.goto('file://'+path.resolve(__dirname,'index.html'));
  await p.evaluate(()=>window.__ready);
  if (a[2]==='--sfx'){ fs.writeFileSync(a[3], JSON.stringify(await p.evaluate(()=>window.__sfx))); await b.close(); return; }
  fs.mkdirSync(outDir,{recursive:true});
  for (let i=0;i<times.length;i++){
    await p.evaluate(t=>window.__seek(t), times[i]);
    const name = a[2]==='--times' ? `t_${times[i].toFixed(2)}.jpg` : `f_${String(startF+i).padStart(5,'0')}.jpg`;
    await p.screenshot({path:path.join(outDir,name),type:'jpeg',quality:92});
  }
  await b.close();
})();
