/* GTA VI — Short 9:16 (1080x1920, ~40 s). Timeline GSAP déterministe : window.__seek(t). Vidéo de fan, aucun asset Rockstar. */
(function(){
const W=window.W, T=window.T, stage=document.getElementById('stage');
const START=T.START, END=T.END, LEAD=T.LEAD;
const C={pink:'#ff2d95',orange:'#ff9a3c',cyan:'#19e6ff',purple:'#2a0a5e',deep:'#12062b',yellow:'#ffe45e',red:'#ff2a3d',blue:'#2a6bff'};
const tl=gsap.timeline({paused:true,defaults:{ease:'power3.out'}});
const SFX=[]; const sfx=(type,t,g)=>SFX.push({type,t:Math.max(0,+t.toFixed(3)),g:g==null?1:g});
window.__sfx=SFX;

function el(tag,css,parent,html){const d=document.createElement(tag);if(css)d.style.cssText=css;if(html!=null)d.innerHTML=html;(parent||stage).appendChild(d);return d;}
function ab(css,parent,html,cls){const d=el('div',css,parent,html);d.className='abs'+(cls?' '+cls:'');return d;}
function scene(id,z,bg){const d=el('div','z-index:'+(z*10)+';background:'+(bg||C.deep),stage);d.className='scene';d.id=id;return d;}
const wt=(sk,i)=>START[sk]+LEAD+W[sk][i][1];
function maskLine(parent,css,html){const m=el('div',css,parent);m.className='mask ub';const s=el('span','',m,html);return s;}
function riseIn(span,t,d){tl.fromTo(span,{yPercent:120,rotate:4,skewX:-10},{yPercent:0,rotate:0,skewX:0,duration:d||.6,ease:'power4.out'},t);}
function pop(node,t,o){tl.fromTo(node,Object.assign({scale:.4,opacity:0,y:50},o&&o.from||{}),Object.assign({scale:1,opacity:1,y:0,duration:.55,ease:'back.out(2)'},o&&o.to||{}),t);}

/* ---------- décors réutilisables ---------- */
function sun(sc,x,y,size,id){
  const s=ab(`left:${x-size/2}px;top:${y-size/2}px;width:${size}px;height:${size}px;border-radius:50%;background:linear-gradient(180deg,#ffe45e 0%,#ff9a3c 40%,#ff2d95 100%);-webkit-mask-image:repeating-linear-gradient(180deg,#000 0,#000 ${size*.1}px,transparent ${size*.1}px,transparent ${size*.125}px);-webkit-mask-size:100% 100%;box-shadow:0 0 160px rgba(255,45,149,.7)`,sc);
  return s;}
function grid(sc,top,color,id){
  const g=ab(`left:-60%;width:220%;top:${top}px;height:${1920-top+400}px;transform:perspective(520px) rotateX(64deg);transform-origin:50% 0;background-image:repeating-linear-gradient(90deg,${color} 0,${color} 3px,transparent 3px,transparent 110px),repeating-linear-gradient(0deg,${color} 0,${color} 3px,transparent 3px,transparent 110px);-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 25%);opacity:.9`,sc);
  tl.fromTo(g,{backgroundPosition:'0px 0px'},{backgroundPosition:'0px 880px',duration:END,ease:'none'},START[id]);
  ab(`left:0;top:${top}px;width:1080px;height:3px;background:${color};box-shadow:0 0 30px ${color}`,sc);
  return g;}
const PALM='<svg viewBox="0 0 400 700" width="100%" height="100%"><path d="M198 700 C190 520 200 360 214 220 L226 222 C214 370 214 520 224 700Z" fill="#0a0420"/><g fill="#0a0420"><path d="M214 220 C130 150 60 170 10 250 C80 205 150 200 214 232Z"/><path d="M214 220 C150 110 80 90 20 130 C90 130 150 160 214 228Z"/><path d="M214 220 C230 100 290 40 360 50 C300 80 262 140 222 230Z"/><path d="M214 220 C290 150 360 170 394 250 C330 205 270 200 220 232Z"/><path d="M214 220 C190 120 200 50 240 0 C236 70 232 140 220 232Z"/></g></svg>';
function palm(sc,x,bottom,h,flip,delay){
  const p=ab(`left:${x}px;bottom:${bottom}px;width:${h*.57}px;height:${h}px;transform-origin:50% 100%;${flip?'scale(-1,1)':''}`,sc,PALM);
  const w=p.firstChild; w.style.transformOrigin='50% 100%';
  tl.fromTo(w,{rotate:-2.5},{rotate:2.5,duration:2.2,ease:'sine.inOut',yoyo:true,repeat:Math.ceil(END/2.2)},START[sc.id]+(delay||0));
  return p;}
function sky(sc,stops){ab(`inset:0;background:linear-gradient(180deg,${stops})`,sc);}
function stars(sc,n,seed){let s=seed||7;const r=()=>{s=(s*9301+49297)%233280;return s/233280;};
  for(let i=0;i<n;i++){const d=ab(`left:${r()*1080}px;top:${r()*900}px;width:${2+r()*3}px;height:${2+r()*3}px;border-radius:50%;background:#fff;opacity:${.3+r()*.7}`,sc);
    tl.to(d,{opacity:.1,duration:.6+r()*1.2,yoyo:true,repeat:Math.ceil(END/1.2),ease:'sine.inOut'},START[sc.id]+r());}}

/* ================= S1 — Accroche : compte à rebours ================= */
(function(){
  const id='s1',S=START[id],sc=scene(id,1,'#05020f');
  ab('inset:0;background:radial-gradient(900px 900px at 50% 48%,rgba(255,45,149,.35),transparent 65%),radial-gradient(700px 600px at 50% 100%,rgba(25,230,255,.18),transparent 60%),#05020f',sc);
  const lab=ab('left:0;top:300px;width:1080px;text-align:center;font-size:40px;letter-spacing:.5em;color:'+C.cyan+';font-weight:600',sc,'GTA VI · COMPTE À REBOURS');
  tl.fromTo(lab,{opacity:0},{opacity:1,duration:.1,yoyo:true,repeat:5,ease:'steps(1)'},S+.05);
  tl.set(lab,{opacity:1},S+.7);
  sfx('tick',S+.12,.7);
  // le chiffre 8 avec décalage RVB
  const mk=(css,txt,cls)=>ab(`left:0;top:450px;width:1080px;text-align:center;font-size:880px;line-height:1;${css}`,sc,txt,'ub '+(cls||''));
  const c1=mk(`color:${C.cyan};mix-blend-mode:screen`,'8'), c2=mk(`color:${C.pink};mix-blend-mode:screen`,'8'), c0=mk('','8','chrome');
  const t8=wt(id,1)-.05;
  tl.set([c0,c1,c2],{opacity:0},0);
  tl.fromTo(c0,{opacity:1,scale:2.4,rotate:-8},{scale:1,rotate:0,duration:.5,ease:'power4.out'},t8);
  tl.fromTo(c1,{opacity:.9,x:0,scale:2.4},{x:-26,scale:1,duration:.5,ease:'power4.out'},t8);
  tl.fromTo(c2,{opacity:.9,x:0,scale:2.4},{x:26,scale:1,duration:.5,ease:'power4.out'},t8);
  sfx('hit',t8,1);sfx('boom',t8,.8);
  const jours=ab('left:0;top:1280px;width:1080px;text-align:center;font-size:150px;line-height:1',sc,'JOURS','ub');
  const jr=wt(id,2)-.1; pop(jours,jr); sfx('pop',jr,.8);
  // glitch sur « tout change »
  const g=wt(id,3)-.05;
  const bars=[0,1,2,3,4].map(i=>ab(`left:0;top:${380+i*210}px;width:1080px;height:${70+i*10}px;background:${i%2?C.cyan:C.pink};mix-blend-mode:screen;opacity:0`,sc));
  bars.forEach((b,i)=>{tl.to(b,{opacity:.65,x:(i%2?-1:1)*(120+i*40),duration:.06,yoyo:true,repeat:3,ease:'steps(1)'},g+i*.04);});
  [c0,c1,c2,jours].forEach((n,i)=>tl.to(n,{x:(i%2?-1:1)*18,duration:.05,yoyo:true,repeat:5,ease:'steps(1)'},g));
  sfx('glitch',g,1);
  const tc=ab('left:0;top:1450px;width:1080px;text-align:center;font-size:110px;line-height:1;color:#fff',sc,'','ub');
  const m1=maskLine(tc,'text-align:center','TOUT '), m2=maskLine(tc,'text-align:center;color:'+C.yellow,'CHANGE');
  m1.parentNode.style.display='inline-block'; m2.parentNode.style.display='inline-block'; m2.parentNode.style.marginLeft='.25em';
  riseIn(m1,wt(id,3)-.05,.5); riseIn(m2,wt(id,4)-.1,.55);
  sfx('swell',S+1.1,.7);
})();

/* ================= S2 — Date + logo ================= */
(function(){
  const id='s2',S=START[id],sc=scene(id,2,C.deep);
  sky(sc,'#12062b 0%,#3a0b6e 35%,#c2185b 62%,#ff6a3d 78%,#ffb347 100%');
  stars(sc,40,3);
  const s=sun(sc,540,1010,820,id);
  tl.fromTo(s,{y:520,opacity:0},{y:0,opacity:1,duration:1.6,ease:'power3.out'},S+.15);
  grid(sc,1180,'rgba(25,230,255,.8)',id);
  palm(sc,-90,0,980,false,0); palm(sc,730,0,1100,true,.6);
  const d19=ab('left:0;top:150px;width:1080px;text-align:center;font-size:430px;line-height:1',sc,'19','ub chrome');
  const nov=ab('left:0;top:600px;width:1080px;text-align:center;font-size:92px;color:#fff;letter-spacing:.08em',sc,'','ub neon');
  const a=maskLine(nov,'display:inline-block;margin-right:.3em','NOVEMBRE'), b=maskLine(nov,'display:inline-block;color:'+C.cyan,'2026');
  const t19=wt(id,1)-.1;
  tl.fromTo(d19,{opacity:0,scale:1.8,y:-80},{opacity:1,scale:1,y:0,duration:.55,ease:'power4.out'},t19); sfx('hit',t19,.9);
  riseIn(a,wt(id,2)-.05,.5); riseIn(b,wt(id,5)-.1,.5); sfx('pop',wt(id,5)-.1,.7);
  // titre GTA VI
  const tt=wt(id,6)-.12;
  const ttl=ab('left:0;top:880px;width:1080px;text-align:center;font-size:300px;line-height:1;filter:drop-shadow(0 12px 30px rgba(0,0,0,.55))',sc,'GTA VI','ub chrome');
  tl.fromTo(ttl,{opacity:0,scale:3,letterSpacing:'.3em'},{opacity:1,scale:1,letterSpacing:'-.01em',duration:.7,ease:'power4.out'},tt);
  const shine=ab('left:-300px;top:850px;width:160px;height:420px;background:linear-gradient(100deg,transparent,rgba(255,255,255,.85),transparent);transform:skewX(-20deg);mix-blend-mode:overlay',sc);
  tl.fromTo(shine,{x:0},{x:1800,duration:.9,ease:'power2.inOut'},tt+.55);
  sfx('boom',tt,1);sfx('hit',tt,.8);sfx('shine',tt+.55,.7);
  const fl=ab('inset:0;background:#fff;opacity:0',sc); tl.fromTo(fl,{opacity:.8},{opacity:0,duration:.35},tt);
  const sub=ab('left:0;top:1230px;width:1080px;text-align:center;font-size:52px;font-weight:600;letter-spacing:.35em;color:#fff',sc,'ARRIVE ENFIN');
  tl.fromTo(sub,{opacity:0,y:30},{opacity:1,y:0,duration:.6},wt(id,8)-.1);
  sfx('riser',S+1.6,.6);
})();

/* ================= S3 — Vice City / Leonida ================= */
(function(){
  const id='s3',S=START[id],sc=scene(id,3,C.deep);
  sky(sc,'#0b0420 0%,#2a0a5e 38%,#d6277f 66%,#ff8a3d 82%,#12062b 100%');
  stars(sc,50,11);
  sun(sc,780,880,560,id);
  // skyline néon en 2 plans de parallaxe
  const far=ab('left:-80px;top:700px;width:1240px;height:520px',sc), near=ab('left:-120px;top:780px;width:1320px;height:620px',sc);
  const B1=[[0,150,230],[110,90,330],[200,140,260],[340,100,410],[440,130,300],[570,90,380],[660,150,240],[810,110,340],[920,130,280],[1050,100,360],[1150,90,250]];
  B1.forEach((b,i)=>{ab(`left:${b[0]}px;bottom:0;width:${b[1]}px;height:${b[2]}px;background:linear-gradient(180deg,#3a1170,#1a0840);box-shadow:inset 0 0 0 2px rgba(255,45,149,.35)`,far);});
  const B2=[[0,170,300],[150,130,470],[270,160,350],[410,120,540],[520,170,380],[670,140,500],[790,160,330],[930,130,450],[1050,170,360],[1190,130,300]];
  B2.forEach((b,i)=>{
    const d=ab(`left:${b[0]}px;bottom:0;width:${b[1]}px;height:${b[2]}px;background:linear-gradient(180deg,#1c0a45,#0a0420);box-shadow:inset 0 0 0 3px ${i%2?C.cyan:C.pink},0 0 30px ${i%2?'rgba(25,230,255,.5)':'rgba(255,45,149,.5)'}`,near);
    for(let r=0;r<Math.floor(b[2]/60);r++)for(let c=0;c<Math.floor(b[1]/45);c++){ if(((r*7+c*3+i)%3)===0) ab(`left:${14+c*40}px;top:${16+r*58}px;width:20px;height:28px;background:${(r+c+i)%2?C.yellow:C.cyan};opacity:.85`,d); }
  });
  tl.fromTo(far,{x:60},{x:-60,duration:END-START[id]+4,ease:'none'},S);
  tl.fromTo(near,{x:100},{x:-140,duration:7,ease:'none'},S);
  ab('left:0;top:1380px;width:1080px;height:540px;background:linear-gradient(180deg,#0a0420,#12062b)',sc);
  grid(sc,1380,'rgba(255,45,149,.75)',id);
  palm(sc,-110,0,1200,false,0); palm(sc,760,-40,1000,true,.9);
  const r=ab('left:70px;top:190px;font-size:46px;letter-spacing:.35em;color:#fff;font-weight:600',sc,'RETOUR À');
  tl.fromTo(r,{opacity:0,x:-40},{opacity:1,x:0,duration:.5},wt(id,0)-.05);
  const h=ab('left:70px;top:250px;width:940px;font-size:215px;line-height:.95;filter:drop-shadow(0 10px 24px rgba(0,0,0,.5))',sc);
  const l1=maskLine(h,'','<span class="chrome">VICE</span>'), l2=maskLine(h,'','<span class="chrome">CITY</span>');
  riseIn(l1,wt(id,2)-.1,.55); riseIn(l2,wt(id,3)-.12,.55); sfx('whoosh',wt(id,2)-.2,.6);sfx('hit',wt(id,2),.6);
  const lo=ab('left:70px;top:720px;width:940px;font-size:122px;line-height:1;color:'+C.cyan,sc,'','ub neon');
  const lm=maskLine(lo,'','LEONIDA'); riseIn(lm,wt(id,7)-.15,.6); sfx('whoosh',wt(id,7)-.2,.5);sfx('hit',wt(id,7)-.05,.6);
  const chips=[['SOLEIL',C.orange,8],['NÉONS',C.cyan,9],['CHAOS',C.pink,11]];
  chips.forEach((c,i)=>{
    const p=ab(`left:${[70,360,640][i]}px;top:${1500+(i%2)*10}px;padding:20px 40px;font-size:56px;font-weight:700;background:${c[1]};color:#12062b;box-shadow:0 0 50px ${c[1]};transform:rotate(${[-4,3,-3][i]}deg)`,sc,c[0]);
    p.className='pill ub'; p.style.position='absolute';
    pop(p,wt(id,c[2])-.1); sfx('pop',wt(id,c[2])-.1,.9);
  });
  sfx('swell',S+3.0,.6);
})();

/* ================= S4 — Lucia & Jason ================= */
(function(){
  const id='s4',S=START[id],sc=scene(id,4,'#0a0420');
  ab('inset:0;background:radial-gradient(900px 900px at 50% 40%,rgba(120,40,200,.4),transparent 65%),#0a0420',sc);
  // gyrophares
  const lr=ab('left:-300px;top:-200px;width:900px;height:2300px;background:radial-gradient(closest-side,rgba(255,42,61,.55),transparent);',sc);
  const lb=ab('left:480px;top:-200px;width:900px;height:2300px;background:radial-gradient(closest-side,rgba(42,107,255,.55),transparent);',sc);
  tl.fromTo(lr,{opacity:0},{opacity:1,duration:.38,yoyo:true,repeat:Math.ceil((END-S)/.38),ease:'steps(1)'},S);
  tl.fromTo(lb,{opacity:1},{opacity:0,duration:.38,yoyo:true,repeat:Math.ceil((END-S)/.38),ease:'steps(1)'},S);
  const hh=ab('left:70px;top:190px;width:940px;font-size:128px;line-height:1',sc,'','ub');
  const m=maskLine(hh,'','DEUX <span style="color:'+C.yellow+'">HÉROS</span>'); riseIn(m,wt(id,0)-.1,.6); sfx('whoosh',wt(id,0)-.2,.6);
  const card=(x,name,ini,col,tw,dir)=>{
    const c=ab(`left:${x}px;top:440px;width:440px;height:760px;border-radius:40px;background:linear-gradient(160deg,${col} 0%,#1a0840 85%);box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 60px ${col}66;overflow:hidden;border:3px solid rgba(255,255,255,.35)`,sc);
    ab(`left:0;top:30px;width:440px;text-align:center;font-size:520px;line-height:1;color:rgba(255,255,255,.92);`,c,ini,'ub');
    ab('left:0;bottom:0;width:440px;height:200px;background:linear-gradient(180deg,transparent,rgba(10,4,32,.95))',c);
    ab('left:0;bottom:36px;width:440px;text-align:center;font-size:84px;line-height:1',c,name,'ub');
    tl.fromTo(c,{x:dir*700,rotate:dir*12,opacity:0},{x:0,rotate:dir*-2,opacity:1,duration:.7,ease:'back.out(1.3)'},tw-.2);
    sfx('whoosh',tw-.25,.6);sfx('hit',tw+.3,.8);
    tl.fromTo(c,{y:0},{y:-14,duration:1.4,yoyo:true,repeat:5,ease:'sine.inOut'},tw+.5);
  };
  card(70,'LUCIA','L',C.pink,wt(id,2),-1); card(570,'JASON','J',C.cyan,wt(id,4),1);
  const and=ab('left:490px;top:760px;width:100px;font-size:100px;text-align:center;color:#fff',sc,'&','ub neon');
  pop(and,wt(id,3)); 
  const tag=(txt,t,top,rot,col)=>{const p=ab(`left:70px;top:${top}px;padding:18px 44px;font-size:70px;background:${col};color:#12062b;transform:rotate(${rot}deg);box-shadow:0 14px 40px rgba(0,0,0,.5);border:4px solid #12062b`,sc,txt,'ub'); tl.fromTo(p,{scale:2.4,opacity:0,rotate:rot*3},{scale:1,opacity:1,rotate:rot,duration:.28,ease:'power4.in'},t-.3);
    tl.fromTo(sc,{x:0},{x:0},t); sfx('stamp',t,.9);};
  tag('BRAQUAGES',wt(id,6),1250,-3,C.yellow); 
  const t2=ab('left:330px;top:1360px;padding:18px 44px;font-size:70px;background:'+C.pink+';color:#fff;transform:rotate(3deg);box-shadow:0 14px 40px rgba(0,0,0,.5);border:4px solid #12062b',sc,'LOYAUTÉ','ub');
  tl.fromTo(t2,{scale:2.4,opacity:0,rotate:9},{scale:1,opacity:1,rotate:3,duration:.28,ease:'power4.in'},wt(id,9)-.3); sfx('stamp',wt(id,9),.9);
  // bande de chantier
  const tape=ab('left:-100px;top:1510px;width:1300px;height:150px;background:repeating-linear-gradient(-45deg,'+C.yellow+' 0 40px,#12062b 40px 80px);transform:rotate(-4deg);box-shadow:0 10px 40px rgba(0,0,0,.6)',sc);
  const tt=ab('left:-100px;top:1530px;width:1300px;height:110px;transform:rotate(-4deg);display:flex;align-items:center;justify-content:center',sc);
  const tx=el('div','background:#12062b;color:'+C.yellow+';font-size:62px;padding:6px 32px;white-space:nowrap',tt,'AUCUN RETOUR EN ARRIÈRE'); tx.className='ub';
  const tw=wt(id,11)-.2;
  tl.fromTo([tape,tt],{x:1500},{x:0,duration:.55,ease:'power4.out'},tw); sfx('whoosh',tw,.7); sfx('hit',tw+.45,.9);
  sfx('siren',S+.2,.5);
})();

/* ================= S5 — Plateformes + hype ================= */
(function(){
  const id='s5',S=START[id],sc=scene(id,5,C.deep);
  ab('inset:0;background:radial-gradient(1000px 900px at 50% 20%,rgba(255,45,149,.45),transparent 60%),radial-gradient(900px 800px at 50% 100%,rgba(25,230,255,.3),transparent 60%),#12062b',sc);
  // lignes de vitesse
  for(let i=0;i<14;i++){const l=ab(`left:${(i*83)%1080}px;top:-400px;width:${3+i%3*2}px;height:${300+(i%4)*120}px;background:linear-gradient(180deg,transparent,rgba(255,255,255,.55));opacity:.5`,sc);
    tl.fromTo(l,{y:0},{y:2400,duration:.9+(i%5)*.2,ease:'none',repeat:Math.ceil((END-S)/1),},S+(i%7)*.13);}
  const lab=ab('left:70px;top:200px;font-size:48px;letter-spacing:.35em;color:'+C.cyan+';font-weight:600',sc,'DISPONIBLE SUR');
  tl.fromTo(lab,{opacity:0,x:-40},{opacity:1,x:0,duration:.5},wt(id,0)-.05);
  const plat=(top,txt,sub,col,tw,dir)=>{
    const c=ab(`left:70px;top:${top}px;width:940px;height:300px;border-radius:44px;background:linear-gradient(110deg,${col}33,#1a0840 70%);border:4px solid ${col};box-shadow:0 0 70px ${col}77;overflow:hidden`,sc);
    ab('left:50px;top:40px;font-size:150px;line-height:1.05;color:#fff',c,txt,'ub');
    ab('left:54px;bottom:34px;font-size:44px;color:'+col+';font-weight:600;letter-spacing:.2em',c,sub);
    tl.fromTo(c,{x:dir*1100,skewX:dir*-14},{x:0,skewX:0,duration:.65,ease:'power4.out'},tw-.15); sfx('whoosh',tw-.2,.7);sfx('hit',tw+.3,.7);};
  plat(300,'PS5','PLAYSTATION 5',C.blue,wt(id,1),-1);
  plat(640,'XBOX','SERIES X|S','#7dff3a',wt(id,4),1);
  const h=ab('left:70px;top:1020px;width:940px;font-size:96px;line-height:1.02',sc,'','ub');
  const words='LE LANCEMENT LE PLUS ATTENDU DE LA DÉCENNIE'.split(' ');
  const sp=words.map((w,i)=>{const s=el('span','display:inline-block;margin-right:.22em;opacity:.18',h,w); return s;});
  const lw=[6,7,8,9,10,11,12,13];
  sp.forEach((s,i)=>{const t=wt(id,lw[i])-.03; tl.to(s,{opacity:1,color:(i==4||i==7)?C.yellow:'#fff',duration:.15,ease:'none'},t); tl.fromTo(s,{y:0,scale:1},{y:-10,scale:1.08,duration:.14,yoyo:true,repeat:1},t);});
  // jauge de hype
  const bar=ab('left:70px;top:1420px;width:940px;height:60px;border-radius:30px;background:rgba(255,255,255,.12);border:3px solid rgba(255,255,255,.4);overflow:hidden',sc);
  const fill=ab('left:0;top:0;width:940px;height:60px;border-radius:30px;background:linear-gradient(90deg,'+C.cyan+','+C.pink+','+C.yellow+');transform-origin:0 50%;transform:scaleX(0)',bar);
  const cnt=ab('left:70px;top:1500px;font-size:120px;line-height:1;color:#fff',sc,'HYPE 0%','ub neon');
  const o={v:0}, t0=wt(id,6)-.1;
  tl.fromTo(fill,{scaleX:0},{scaleX:1,duration:2.6,ease:'power2.inOut'},t0);
  tl.to(o,{v:100,duration:2.6,ease:'power2.inOut',onUpdate(){cnt.textContent='HYPE '+Math.round(o.v)+'%';}},t0);
  sfx('riser',t0,.9);
  tl.fromTo(cnt,{scale:1},{scale:1.12,duration:.12,yoyo:true,repeat:1},t0+2.6);sfx('hit',t0+2.6,1);sfx('boom',t0+2.6,.8);
})();

/* ================= S6 — Check-list ================= */
(function(){
  const id='s6',S=START[id],sc=scene(id,6,C.pink);
  ab('inset:0;background:linear-gradient(160deg,#ff2d95 0%,#7a1fff 55%,#2a0a5e 100%)',sc);
  const st=ab('left:-200px;top:-200px;width:1500px;height:2400px;background:repeating-linear-gradient(-30deg,rgba(255,255,255,.08) 0 60px,transparent 60px 120px)',sc);
  tl.fromTo(st,{x:0},{x:-208,duration:END,ease:'none'},S);
  const hh=ab('left:70px;top:200px;font-size:60px;letter-spacing:.3em;font-weight:600',sc,'CHECK-LIST DU JOUR J');
  tl.fromTo(hh,{opacity:0,y:-30},{opacity:1,y:0,duration:.5},S+.1);
  const rows=[['MANETTE','CHARGÉE',0,2],['CONSOLE','PRÊTE',3,5],['WEEK-END','LIBÉRÉ',6,8]];
  rows.forEach((r,i)=>{
    const top=360+i*390;
    const c=ab(`left:70px;top:${top}px;width:900px;height:320px;border-radius:44px;background:#12062b;border:4px solid #fff;box-shadow:12px 12px 0 ${[C.cyan,C.yellow,C.pink][i]}`,sc);
    ab('left:60px;top:44px;font-size:84px;line-height:1.05;color:#fff',c,r[0]+'<br><span style="color:'+[C.cyan,C.yellow,'#ff7ac0'][i]+'">'+r[1]+'</span>','ub');
    const box=ab('right:50px;top:90px;width:140px;height:140px;border-radius:30px;border:6px solid #fff;background:rgba(255,255,255,.1)',c);
    box.innerHTML='<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M22 54 L42 74 L80 28" fill="none" stroke="#7dff3a" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>';
    const path=box.querySelector('path');
    tl.fromTo(c,{x:(i%2?1:-1)*1200,rotate:(i%2?1:-1)*6},{x:0,rotate:0,duration:.6,ease:'power4.out'},wt(id,r[2])-.15);
    sfx('whoosh',wt(id,r[2])-.2,.6);
    const tc=wt(id,r[3])-.02;
    tl.to(path,{strokeDashoffset:0,duration:.22,ease:'power2.out'},tc);
    tl.fromTo(box,{scale:1},{scale:1.25,duration:.12,yoyo:true,repeat:1,backgroundColor:'rgba(125,255,58,.35)'},tc);
    sfx('ding',tc,.9);
  });
})();

/* ================= S7 — Appel à l'action ================= */
(function(){
  const id='s7',S=START[id],sc=scene(id,7,C.deep);
  sky(sc,'#12062b 0%,#3a0b6e 32%,#c2185b 60%,#ff6a3d 78%,#ffb347 100%');
  stars(sc,40,5);
  const s=sun(sc,540,900,760,id); tl.fromTo(s,{scale:.5,opacity:0},{scale:1,opacity:1,duration:.9,ease:'power3.out'},S+.1);
  grid(sc,1100,'rgba(25,230,255,.8)',id);
  palm(sc,-90,0,980,false,.2); palm(sc,730,0,1100,true,.7);
  const d=ab('left:0;top:210px;width:1080px;text-align:center;font-size:250px;line-height:1',sc,'19.11','ub chrome');
  const y=ab('left:0;top:470px;width:1080px;text-align:center;font-size:120px;line-height:1;color:'+C.cyan+';letter-spacing:.12em',sc,'2026','ub neon');
  const t0=wt(id,0)-.1;
  tl.fromTo(d,{opacity:0,scale:2.2},{opacity:1,scale:1,duration:.6,ease:'power4.out'},t0); sfx('hit',t0,.9);sfx('boom',t0,1);
  tl.fromTo(y,{opacity:0,y:40,letterSpacing:'.6em'},{opacity:1,y:0,letterSpacing:'.12em',duration:.7},wt(id,1)-.05);
  const tt=ab('left:0;top:760px;width:1080px;text-align:center;font-size:260px;line-height:1;filter:drop-shadow(0 10px 28px rgba(0,0,0,.5))',sc,'GTA VI','ub chrome');
  tl.fromTo(tt,{opacity:0,y:80},{opacity:1,y:0,duration:.7},wt(id,1)+.2);
  // bouton S'abonner
  const bt=wt(id,2)-.15;
  const btn=ab('left:90px;top:1180px;width:900px;height:170px;border-radius:40px;background:'+C.red+';box-shadow:0 20px 60px rgba(255,42,61,.55);display:flex;align-items:center;justify-content:center;gap:28px;font-size:76px;color:#fff',sc,'','ub');
  const bell=el('span','display:inline-block;transform-origin:50% 10%',btn,'<svg viewBox="0 0 64 64" width="90" height="90" fill="#fff"><path d="M32 6c-3 0-5 2-5 5-8 2-13 9-13 18v10l-6 8h48l-6-8V29c0-9-5-16-13-18 0-3-2-5-5-5zM26 54c0 4 3 6 6 6s6-2 6-6z"/></svg>');
  const lbl=el('span','',btn,"ABONNE-TOI");
  pop(btn,bt); sfx('pop',bt,.9);
  tl.fromTo(bell,{rotate:-22},{rotate:22,duration:.12,yoyo:true,repeat:7,ease:'sine.inOut'},bt+.5);
  tl.to(btn,{scale:.92,duration:.1,yoyo:true,repeat:1},wt(id,5)-.1);
  tl.set(btn,{backgroundColor:'#2a2a2a'},wt(id,5));
  tl.call(()=>{},null,0);
  const done=ab('left:90px;top:1180px;width:900px;height:170px;border-radius:40px;background:#fff;color:#12062b;display:flex;align-items:center;justify-content:center;font-size:76px;opacity:0',sc,'ABONNÉ ✓','ub');
  tl.set(done,{opacity:1},wt(id,5)); sfx('click',wt(id,5),1); sfx('ding',wt(id,6),.8);
  const note=ab('left:0;top:1420px;width:1080px;text-align:center;font-size:36px;font-weight:600;color:rgba(255,255,255,.85);letter-spacing:.08em',sc,'Vidéo de fan · non officielle');
  tl.fromTo(note,{opacity:0},{opacity:1,duration:.6},wt(id,6));
  const out=el('div','inset:0;background:#000;z-index:100000;opacity:0;pointer-events:none',stage);
  tl.fromTo(out,{opacity:0},{opacity:1,duration:.6,ease:'power1.in'},END-.6);
})();

/* ---------- surcouches globales : scanlines + vignette ---------- */
(function(){
  const o=el('div','inset:0;z-index:99990;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.10) 0 2px,transparent 2px 5px),radial-gradient(ellipse at 50% 50%,transparent 55%,rgba(0,0,0,.55) 100%)',stage);
  o.className='abs';
})();

/* ================= TRANSITIONS (toutes différentes) ================= */
const sc=id=>document.getElementById(id);
const flash=(t,col,peak,dur)=>{const f=el('div','inset:0;z-index:99980;pointer-events:none;opacity:0;background:'+(col||'#fff'),stage);tl.fromTo(f,{opacity:peak||.9},{opacity:0,duration:dur||.4,ease:'power2.out'},t);};
const shake=(t,amp,n)=>{const a=amp||14;tl.fromTo(stage,{x:0,y:0},{x:a,y:-a*.6,duration:.04,yoyo:true,repeat:n||7,ease:'steps(1)'},t);tl.set(stage,{x:0,y:0},t+.04*((n||7)+1));};

// 1→2 : GLITCH par tranches + secousse + éclair
(function(){const t=START.s2-.12;
  const s2=sc('s2');
  // révélation par bandes aléatoires (approx. via clip-path animé + décalage x)
  tl.fromTo(s2,{clipPath:'polygon(0 0,0 0,0 100%,0 100%)'},{clipPath:'polygon(0 0,100% 0,100% 100%,0 100%)',duration:.32,ease:'steps(6)'},t);
  tl.fromTo(s2,{x:-70},{x:0,duration:.32,ease:'steps(5)'},t);
  flash(t,'#ff2d95',.8,.3); shake(t,16,9);
  sfx('glitch',t-.05,1.2); sfx('boom',t+.25,.9);
})();
// 2→3 : WHIP PAN avec flou de mouvement
(function(){const t=START.s3-.2, a=sc('s2'), b=sc('s3');
  tl.fromTo(b,{x:1080,filter:'blur(40px)'},{x:0,filter:'blur(0px)',duration:.55,ease:'power4.inOut'},t);
  tl.fromTo(a,{x:0,filter:'blur(0px)'},{x:-1080,filter:'blur(40px)',duration:.55,ease:'power4.inOut'},t);
  sfx('whoosh',t-.05,1.2);
})();
// 3→4 : BANDE DIAGONALE rose + zoom punch + flash
(function(){const t=START.s4-.2, b=sc('s4'), z=parseInt(b.style.zIndex);
  const band=el('div','z-index:'+(z+1)+';background:linear-gradient(90deg,'+C.pink+','+C.yellow+');left:-300px;top:-300px;width:1700px;height:2500px;transform:rotate(18deg) translateX(-2000px)',stage);band.className='abs';
  tl.to(band,{x:2600,duration:.7,ease:'power3.inOut'},t);
  tl.fromTo(b,{clipPath:'polygon(0 0,0 0,0 100%,0 100%)'},{clipPath:'polygon(0 0,170% 0,100% 100%,0 100%)',duration:.7,ease:'power3.inOut'},t+.12);
  tl.fromTo(b,{scale:1.25},{scale:1,duration:.5,ease:'power3.out'},t+.3);
  flash(t+.35,'#ffe45e',.5,.3); sfx('whoosh',t,1.1); sfx('siren',t+.1,.4);
})();
// 4→5 : OBTURATEUR (barres verticales) + clic
(function(){const t=START.s5-.15, b=sc('s5'), n=8, w=1080/n;
  const poly=(o)=>{let p=[];for(let i=0;i<n;i++){const x0=i*w,x1=x0+w*o;p.push(`${x0}px 0px,${x1}px 0px,${x1}px 1920px,${x0}px 1920px`);}return p;};
  // une seule clip-path avec polygones multiples impossible -> barres via mask
  const mk=o=>`linear-gradient(90deg,${Array.from({length:n},(_,i)=>`#000 ${i*w}px,#000 ${i*w+w*o}px,transparent ${i*w+w*o}px,transparent ${(i+1)*w}px`).join(',')})`;
  const st={v:0};
  tl.fromTo(st,{v:0.001},{v:1,duration:.55,ease:'power3.inOut',onUpdate(){const m=mk(Math.min(1,st.v));b.style.webkitMaskImage=m;b.style.maskImage=m;},onComplete(){b.style.webkitMaskImage='none';b.style.maskImage='none';}},t);
  tl.set(b,{webkitMaskImage:'none'},t+.56);
  sfx('shutter',t,1.1); flash(t+.5,'#fff',.35,.25);
})();
// 5→6 : IRIS circulaire + éclair blanc
(function(){const t=START.s6-.15, b=sc('s6');
  tl.fromTo(b,{clipPath:'circle(0% at 50% 50%)'},{clipPath:'circle(110% at 50% 50%)',duration:.6,ease:'power3.inOut'},t);
  tl.fromTo(b,{rotate:-8,scale:1.3},{rotate:0,scale:1,duration:.7,ease:'power3.out'},t);
  flash(t+.05,'#ffffff',.7,.35); sfx('riser',t-.9,.7); sfx('hit',t+.1,1);sfx('whoosh',t,.9);
})();
// 6→7 : ZOOM TRAVERSANT + flash final
(function(){const t=START.s7-.2, a=sc('s6'), b=sc('s7');
  tl.fromTo(a,{scale:1,opacity:1},{scale:3,opacity:0,duration:.45,ease:'power3.in'},t);
  tl.fromTo(b,{scale:.5,opacity:0},{scale:1,opacity:1,duration:.7,ease:'power4.out'},t+.25);
  flash(t+.3,'#ffffff',1,.5); shake(t+.3,12,5);
  sfx('rewind',t-.1,.8); sfx('boom',t+.3,1.2); sfx('shine',t+.35,.7);
})();

tl.duration(END);
window.__tl=tl; window.__seek=t=>{tl.time(t,false);return true;};
const urls=[...document.querySelectorAll('img')].map(i=>i.src);
window.__ready=Promise.all([document.fonts.ready]).then(()=>{tl.time(0);return true;});
})();
