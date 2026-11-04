// usage: node render.js <outDir> <startFrame> <endFrame> | node render.js --times t1,t2,... <outDir>
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const FPS = 30;
  let times, outDir, startF=0;
  if (process.argv[2]==='--times'){ times = process.argv[3].split(',').map(Number); outDir = process.argv[4]; }
  else { outDir = process.argv[2]; startF = +process.argv[3]; const endF=+process.argv[4]; times=[]; for(let f=startF;f<endF;f++) times.push(f/FPS); }
  fs.mkdirSync(outDir,{recursive:true});
  const b = await chromium.launch({args:['--allow-file-access-from-files','--force-device-scale-factor=1']});
  const p = await (await b.newContext({viewport:{width:1080,height:1920},deviceScaleFactor:1})).newPage();
  p.on('pageerror',e=>console.log('PAGEERROR',e.message)); p.on('console',m=>{ if(m.type()==='error') console.log('CONSOLE',m.text()); });
  await p.goto('file://'+path.resolve(__dirname,process.env.PAGE||'index.html'));
  await p.evaluate(()=>window.__ready);
  for (let i=0;i<times.length;i++){
    await p.evaluate(t=>window.__seek(t), times[i]);
    const name = (process.argv[2]==='--times') ? `t_${times[i].toFixed(2)}.jpg` : `f_${String(startF+i).padStart(5,'0')}.jpg`;
    await p.screenshot({path:path.join(outDir,name),type:'jpeg',quality:93});
  }
  await b.close();
})();
