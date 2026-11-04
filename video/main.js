/* Paps — motion design 62 s, 1080x1920. Timeline GSAP déterministe (window.__seek(t)). */
(function(){
const W = window.W, stage = document.getElementById('stage');
const START = {s1:0,s2:5,s3:12.5,s4:25,s5:33.5,s6:42.5,s7:52.5}, END = 62;
const VO    = {s1:0.6,s2:5.8,s3:13.3,s4:25.8,s5:34.3,s6:43.3,s7:53.3};
const C = {navy:'#252E5E',deep:'#141a44',cyan:'#2E9BC6',orange:'#F7941D',lime:'#D8E52A'};
const IMG = n => `url(assets/${n})`;
const tl = gsap.timeline({paused:true, defaults:{ease:'power3.out'}});

/* ---------- helpers ---------- */
function el(tag, css, parent, html){
  const d = document.createElement(tag);
  if (css) d.style.cssText = css;
  if (html != null) d.innerHTML = html;
  (parent || stage).appendChild(d);
  return d;
}
function scene(id, z, bg){
  const d = el('div','z-index:'+(z*10)+';background:'+(bg||C.deep), stage);
  d.className = 'scene'; d.id = id; return d;
}
const wt = (sk, i) => VO[sk] + W[sk][i][1];          // temps absolu du mot i
const rel = (sk) => (t) => START[sk] + t;             // temps relatif -> absolu
/* ligne de texte masquée qui monte */
function maskLine(parent, css, html){
  const m = el('div', css, parent); m.className = 'mask ub';
  const s = el('span', '', m, html); return s;
}
function riseIn(span, t, d){ tl.fromTo(span,{yPercent:115,rotate:3},{yPercent:0,rotate:0,duration:d||0.7,ease:'power4.out'},t); }
function pop(node, t, o){ tl.fromTo(node, Object.assign({scale:.55,opacity:0,y:60},o&&o.from||{}), Object.assign({scale:1,opacity:1,y:0,duration:.7,ease:'back.out(1.6)'},o&&o.to||{}), t); }
function orbs(parent, list){ list.forEach(o=>{ const d=el('div',`width:${o.s}px;height:${o.s}px;left:${o.x}px;top:${o.y}px;background:${o.c};opacity:${o.o||.5}`,parent); d.className='orb'; if(o.drift) tl.to(d,{x:o.drift[0],y:o.drift[1],duration:o.dur||12,ease:'sine.inOut'},START[parent.id]); }); }
function trans(sc, sid, color, from, to, t0, dur){
  const z = parseInt(sc.style.zIndex);
  const col = el('div','z-index:'+(z-5)+';background:'+color, stage); col.className='tcol';
  const ease = 'power3.inOut';
  tl.fromTo(col,{clipPath:from},{clipPath:to,duration:dur,ease},t0);
  tl.fromTo(sc, {clipPath:from},{clipPath:to,duration:dur,ease},t0+0.14);
}
const SVG = {
  box:'<svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="#fff" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"><path d="M8 20 32 8l24 12v26L32 58 8 46z"/><path d="M8 20l24 12 24-12M32 32v26"/></svg>',
  courier:'<svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="#fff" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"><circle cx="32" cy="17" r="9"/><path d="M22 10h20M14 58V47a18 18 0 0 1 36 0v11z"/><path d="M23 41h18v11H23z"/></svg>',
  truck:'<svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="#fff" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"><path d="M4 14h34v30H4zM38 24h12l10 10v10H38z"/><circle cx="16" cy="48" r="5" fill="#252E5E"/><circle cx="48" cy="48" r="5" fill="#252E5E"/><path d="M12 29l6 6 11-12"/></svg>',
  cart:'<svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="#fff" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"><path d="M4 10h8l7 30h32l6-22H15"/><circle cx="24" cy="52" r="4"/><circle cx="46" cy="52" r="4"/><path d="M30 22l5 5 9-10"/></svg>',
  user:'<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3.2"/><path d="M5.8 18.5c1.6-2.6 4-3.6 6.2-3.6s4.6 1 6.2 3.6"/></svg>',
  map:'<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#252E5E" stroke-width="2" stroke-linejoin="round"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14"/></svg>',
  apps:'<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#252E5E" stroke-width="2" stroke-linejoin="round"><rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/></svg>'
};

/* ================= SCÈNE 1 — Accroche (0–5 s) ================= */
(function(){
  const id='s1', S=START[id], sc = scene(id, 1, C.deep);
  const ph = el('div','inset:0;background:'+IMG('Paps-slider-12-1.jpg')+' 60% 50%/auto 100% no-repeat;transform-origin:62% 55%', sc); ph.className='abs';
  el('div','inset:0;background:linear-gradient(180deg,rgba(20,26,68,.62) 0%,rgba(20,26,68,0) 28%,rgba(20,26,68,.55) 52%,rgba(20,26,68,.96) 80%,#141a44 100%)',sc).className='abs';
  tl.fromTo(ph,{scale:1.22},{scale:1.02,duration:5.2,ease:'power2.out'},0);
  // formes diagonales
  const b1 = el('div','left:-200px;top:1010px;width:1500px;height:10px;background:'+C.orange+';transform:rotate(-8deg);transform-origin:left center',sc); b1.className='abs';
  tl.fromTo(b1,{scaleX:0},{scaleX:1,duration:1.1,ease:'power4.out'},0.7);
  const logo = el('img','left:80px;top:290px;width:300px', sc); logo.src='assets/logo-paps-white-4x.png'; logo.className='abs';
  tl.fromTo(logo,{scale:.5,opacity:0,rotate:-12,transformOrigin:'left center'},{scale:1,opacity:1,rotate:0,duration:.9,ease:'back.out(1.7)'},0.15);
  const t = el('div','left:80px;top:1060px;width:920px;font-size:136px;line-height:1.0',sc); t.className='abs';
  const l1 = maskLine(t,'', 'Votre allié'), l2 = maskLine(t,'', 'logistique,'), l3 = maskLine(t,'color:'+C.orange, 'c’est Paps.');
  riseIn(l1, wt(id,0)-.12); riseIn(l2, wt(id,2)-.12); riseIn(l3, wt(id,3)-.05, .8);
  tl.fromTo(t,{x:0},{x:0,duration:1},0); // ancre
  const chip = el('div','left:80px;top:1560px;font-size:36px;letter-spacing:.14em;text-transform:uppercase;color:#cfe9f5;font-weight:500',sc,'Transport &amp; logistique · Afrique francophone'); chip.className='abs';
  tl.fromTo(chip,{opacity:0,y:30},{opacity:1,y:0,duration:.8},3.0);
  tl.to(sc,{scale:1.0,duration:.01},0);
})();

/* ================= SCÈNE 2 — Interlocuteur unique (5–12,5 s) ================= */
(function(){
  const id='s2', S=START[id], sc = scene(id, 2, C.navy);
  el('div','inset:0;background:radial-gradient(900px 700px at 100% 0%,rgba(46,155,198,.45),transparent 60%),radial-gradient(800px 800px at 0% 100%,rgba(247,148,29,.18),transparent 60%),'+C.navy,sc).className='abs';
  const h = el('div','left:80px;top:250px;width:920px;font-size:104px;line-height:1.02',sc); h.className='abs';
  const a = maskLine(h,'','Un seul'), b = maskLine(h,'','interlocuteur'), c = maskLine(h,'color:'+C.cyan+';font-size:84px;margin-top:6px','de bout en bout.');
  riseIn(a, wt(id,0)-.1); riseIn(b, wt(id,2)-.15); riseIn(c, wt(id,3)-.1);
  // ligne de route + nœuds
  const ys=[845,1175,1505];
  const line = el('div','left:88px;top:845px;width:8px;height:660px;border-radius:4px;background:linear-gradient(180deg,'+C.cyan+','+C.orange+');transform-origin:top',sc); line.className='abs';
  tl.fromTo(line,{scaleY:0},{scaleY:1,duration:wt(id,14)-wt(id,8)+.4,ease:'none'},wt(id,8)-.2);
  const flags = [
    'background:linear-gradient(90deg,#00853F 33%,#FDEF42 33% 66%,#E31B23 66%)',
    'background:linear-gradient(90deg,#F77F00 33%,#fff 33% 66%,#009E60 66%)',
    'background:linear-gradient(90deg,#008751 40%,transparent 40%),linear-gradient(180deg,#FCD116 50%,#E8112D 50%)'
  ];
  const data = [['Sénégal','Paps-sn-1-768x500.jpg',8],['Côte d’Ivoire','Paps-ci-2-768x500.jpg',10],['Bénin','Paps-benin-2-768x500.jpg',14]];
  data.forEach((d,i)=>{
    const tt = wt(id,d[2])-.2;
    const card = el('div','left:150px;top:'+(ys[i]-145)+'px;width:850px;height:290px;box-shadow:0 30px 70px rgba(0,0,0,.4)',sc); card.className='card';
    const im = el('div','inset:-30px;background:'+IMG(d[1])+' center/cover',card); im.className='abs';
    el('div','inset:0;background:linear-gradient(90deg,rgba(20,26,68,.92) 0%,rgba(20,26,68,.55) 55%,rgba(20,26,68,.1) 100%)',card).className='abs';
    const fl = el('div','left:44px;top:58px;width:78px;height:54px;border-radius:8px;box-shadow:0 0 0 3px rgba(255,255,255,.85);'+flags[i],card); fl.className='abs';
    const nm = el('div','left:44px;top:128px;font-size:76px;line-height:1',card,d[0]); nm.className='abs ub';
    const sub = el('div','left:46px;top:216px;font-size:30px;letter-spacing:.16em;text-transform:uppercase;color:#bfe6f6;font-weight:500',card,'Paps est présent'); sub.className='abs';
    tl.fromTo(card,{x:900,rotate:6,opacity:0},{x:0,rotate:0,opacity:1,duration:.85,ease:'power4.out'},tt);
    tl.fromTo(im,{scale:1.35},{scale:1.02,duration:3,ease:'power2.out'},tt);
    const node = el('div','left:'+(92-26)+'px;top:'+(ys[i]-26)+'px;width:52px;height:52px;border-radius:50%;background:#fff;border:10px solid '+(i==2?C.orange:C.cyan)+';box-shadow:0 0 0 0 rgba(46,155,198,.6)',sc); node.className='abs';
    tl.fromTo(node,{scale:0},{scale:1,duration:.5,ease:'back.out(2.4)'},tt);
    const ring = el('div','left:'+(92-26)+'px;top:'+(ys[i]-26)+'px;width:52px;height:52px;border-radius:50%;border:4px solid '+C.cyan,sc); ring.className='abs';
    tl.fromTo(ring,{scale:1,opacity:.9},{scale:3.2,opacity:0,duration:1.1,ease:'power2.out'},tt+.1);
  });
})();

/* ================= SCÈNE 3 — Services (12,5–25 s) ================= */
(function(){
  const id='s3', S=START[id], sc = scene(id, 3, C.deep);
  const bg = el('div','inset:-60px;background:'+IMG('Paps-slider-02.jpg')+' 40% 50%/cover',sc); bg.className='abs';
  el('div','inset:0;background:linear-gradient(180deg,rgba(20,26,68,.88),rgba(37,46,94,.84))',sc).className='abs';
  tl.fromTo(bg,{scale:1.25,x:-30},{scale:1.02,x:30,duration:12.5,ease:'none'},S);
  const h = el('div','left:80px;top:250px;width:920px;font-size:78px;line-height:1.04',sc); h.className='abs';
  const a = maskLine(h,'','Une solution'), b = maskLine(h,'color:'+C.cyan,'de bout en bout');
  riseIn(a,S+.45); riseIn(b,S+.62);
  const items=[
    ['Messagerie','Courriers et colis en porte-à-porte ou points relais.',SVG.box,0,-5],
    ['Mise à disposition','Un coursier et un véhicule dédiés.',SVG.courier,1,4],
    ['Tournée régulière','Distribution régulière sur un circuit.',SVG.truck,4,-4],
    ['Paps Easy Colis','La chaîne des e-commerçants, jusqu’au dernier km.',SVG.cart,6,5]
  ];
  items.forEach((it,i)=>{
    const x = i%2?560:80, y = i<2?500:930;
    const c = el('div',`left:${x}px;top:${y}px;width:440px;height:400px;background:rgba(255,255,255,.09);border:2px solid rgba(255,255,255,.18);box-shadow:0 24px 60px rgba(0,0,0,.35)`,sc); c.className='card';
    const ic = el('div','left:32px;top:30px;width:104px;height:104px;border-radius:30px;background:linear-gradient(135deg,'+C.cyan+',#1f6f96);display:flex;align-items:center;justify-content:center',c,it[2]); ic.className='abs';
    const ti = el('div','left:32px;top:160px;width:390px;font-size:39px;line-height:1.05;white-space:nowrap',c,it[0]); ti.className='abs ub';
    const de = el('div','left:32px;top:226px;width:380px;font-size:34px;line-height:1.22;color:#e3edf8;font-weight:400',c,it[1]); de.className='abs';
    const t = wt(id,it[3])-.12;
    tl.fromTo(c,{scale:.55,opacity:0,y:80,rotate:it[4]},{scale:1,opacity:1,y:0,rotate:0,duration:.75,ease:'back.out(1.5)'},t);
    tl.fromTo(ic,{rotate:-25,scale:.4},{rotate:0,scale:1,duration:.7,ease:'back.out(2)'},t+.1);
    // surbrillance orange pendant que le mot est prononcé
    tl.to(c,{borderColor:C.orange,boxShadow:'0 0 0 6px rgba(247,148,29,.28),0 24px 60px rgba(0,0,0,.35)',duration:.18},t+.2);
    tl.to(c,{borderColor:'rgba(255,255,255,.18)',boxShadow:'0 0 0 0px rgba(247,148,29,0),0 24px 60px rgba(0,0,0,.35)',duration:.5},t+1.1);
    tl.fromTo(c,{y:0},{y:-10,duration:1.8,ease:'sine.inOut',yoyo:true,repeat:3},t+1.0);
  });
  // panneau « chaîne logistique »
  const t0 = wt(id,12)-.15;
  const p = el('div','left:80px;top:1375px;width:920px;height:290px;box-shadow:0 30px 70px rgba(0,0,0,.45)',sc); p.className='card';
  const pim = el('div','inset:-20px;background:'+IMG('Paps-slider-PAPSER-Warehouse-5.jpg')+' 70% 50%/cover',p); pim.className='abs';
  el('div','inset:0;background:linear-gradient(90deg,rgba(20,26,68,.95) 0%,rgba(20,26,68,.7) 60%,rgba(20,26,68,.35) 100%)',p).className='abs';
  const pt = el('div','left:44px;top:30px;width:760px;font-size:46px;line-height:1.08',p,'Toute votre chaîne logistique, <span style="color:'+C.orange+'">jusqu’au dernier km</span>'); pt.className='abs ub';
  const tr = el('div','left:70px;top:202px;width:780px;height:10px;border-radius:5px;background:rgba(255,255,255,.25)',p); tr.className='abs';
  const fill = el('div','left:70px;top:202px;width:780px;height:10px;border-radius:5px;background:linear-gradient(90deg,'+C.cyan+','+C.orange+');transform-origin:left',p); fill.className='abs';
  const labs=['Approvisionnement','Entrepôt','Dernier km'];
  labs.forEach((l,i)=>{
    const nx = 70 + i*390;
    const n = el('div',`left:${nx-17}px;top:190px;width:34px;height:34px;border-radius:50%;background:#fff;border:8px solid ${C.cyan}`,p); n.className='abs';
    const tx = el('div',`left:${nx-(i==2?170:i==0?0:65)}px;top:238px;width:${i==1?130:200}px;font-size:28px;font-weight:600;color:#fff;${i==2?'text-align:right;':i==1?'text-align:center;':''}`,p,l); tx.className='abs';
    const tt = wt(id,12)+ (i==0?(wt(id,17)-wt(id,12)):i==1?(wt(id,17)-wt(id,12)+0.8):(wt(id,19)-wt(id,12)+0.15));
    tl.fromTo([n,tx],{opacity:0,y:14},{opacity:1,y:0,duration:.4},t0+.5+i*.2);
    tl.to(n,{borderColor:C.orange,scale:1.3,duration:.3,ease:'back.out(2)'},wt(id,12)+(i==0?(wt(id,17)-wt(id,12)):i==1?(wt(id,18)-wt(id,12)):(wt(id,19)-wt(id,12))));
  });
  tl.fromTo(p,{y:300,opacity:0,scale:.92},{y:0,opacity:1,scale:1,duration:.9,ease:'power4.out'},t0);
  tl.fromTo(fill,{scaleX:0},{scaleX:1,duration:wt(id,20)-wt(id,17)+.4,ease:'power1.inOut'},wt(id,17)-.1);
  tl.fromTo(pim,{scale:1.25},{scale:1.02,duration:3.5,ease:'power2.out'},t0);
})();

/* ================= SCÈNE 4 — Applications (25–33,5 s) ================= */
(function(){
  const id='s4', S=START[id], sc = scene(id, 4, C.navy);
  el('div','inset:0;background:radial-gradient(1000px 900px at 50% 70%,rgba(46,155,198,.55),transparent 62%),radial-gradient(700px 600px at 0% 0%,rgba(247,148,29,.2),transparent 60%),#1b2250',sc).className='abs';
  const h = el('div','left:80px;top:250px;width:920px;font-size:92px;line-height:1.02',sc); h.className='abs';
  const a = maskLine(h,'','Une suite'), b = maskLine(h,'color:'+C.cyan,'d’applications');
  riseIn(a,wt(id,0)-.1); riseIn(b,wt(id,2)-.25);
  // téléphone
  const stagew = el('div','left:0;top:0;width:1080px;height:1920px;perspective:1800px',sc); stagew.className='abs';
  const ph = el('div','left:270px;top:470px;width:540px;height:1140px;border-radius:78px;background:#0b1030;border:3px solid #3a4786;box-shadow:0 60px 120px rgba(0,0,0,.55),0 0 0 14px #11183f, inset 0 0 0 2px #000;transform-style:preserve-3d',stagew); ph.className='abs';
  const scr = el('div','left:20px;top:20px;width:500px;height:1100px;border-radius:60px;overflow:hidden;background:#fff',ph); scr.className='abs';
  const sw = 500, sh = sw*(14400/780);
  const strip = el('div','left:0;top:0;width:'+sw+'px;height:'+sh+'px;background:'+IMG('m-strip.jpg')+' 0 0/'+sw+'px '+sh+'px no-repeat',scr); strip.className='abs';
  const k = sw/390; // px par px CSS (rendu @2 dans la bande => 1 css px = 1.2821 px écran)
  const css2px = css => css*(sw/390);
  const notch = el('div','left:170px;top:14px;width:160px;height:38px;border-radius:22px;background:#0b1030',scr); notch.className='abs';
  tl.fromTo(ph,{rotateY:-34,rotateX:12,y:260,opacity:0,scale:.8},{rotateY:0,rotateX:0,y:0,opacity:1,scale:1,duration:1.3,ease:'power4.out'},S+.35);
  tl.fromTo(ph,{rotateY:0},{rotateY:8,duration:6.5,ease:'sine.inOut'},S+1.7);
  // défilement des vraies captures (hero -> services -> mission)
  tl.fromTo(strip,{y:0},{y:-css2px(900),duration:3.0,ease:'power2.inOut'},S+1.0);
  tl.to(strip,{y:-css2px(1800),duration:2.0,ease:'power2.inOut'},S+4.1);
  tl.to(strip,{y:-css2px(3330),duration:2.2,ease:'power2.inOut'},S+6.0);
  // pastilles flottantes
  function chip(txt,icon,css,tm,dark){
    const c = el('div',`${css};padding:20px 34px 20px 24px;font-size:42px;${dark?'background:#fff;color:'+C.navy:'background:'+C.orange+';color:#fff'};box-shadow:0 24px 50px rgba(0,0,0,.4)`,sc,(icon||'')+'<span>'+txt+'</span>'); c.className='pill';
    tl.fromTo(c,{scale:.3,opacity:0,x:dark?-80:80},{scale:1,opacity:1,x:0,duration:.8,ease:'back.out(1.8)'},tm);
    tl.fromTo(c,{y:0},{y:-16,duration:1.6,ease:'sine.inOut',yoyo:true,repeat:4},tm+.8);
    return c;
  }
  chip('Suite d’applications',SVG.apps,'left:36px;top:700px',wt(id,2)-.1,true);
  chip('Espace Client',SVG.user,'left:520px;top:1030px',wt(id,5)-.15,false);
  chip('Suivi de commande',SVG.map,'left:60px;top:1390px',wt(id,9)-.15,true);
  // ondes
  [wt(id,5),wt(id,9)].forEach((tm,i)=>{
    const r = el('div',`left:${i?200:700}px;top:${i?1440:1080}px;width:60px;height:60px;border-radius:50%;border:4px solid ${i?'#fff':C.orange}`,sc); r.className='abs';
    tl.fromTo(r,{scale:.4,opacity:.9},{scale:5,opacity:0,duration:1.3,ease:'power2.out'},tm);
  });
})();

/* ================= SCÈNE 5 — Mission (33,5–42,5 s) ================= */
(function(){
  const id='s5', S=START[id], sc = scene(id, 5, C.navy);
  el('div','inset:0;background:radial-gradient(900px 800px at 100% 100%,rgba(46,155,198,.5),transparent 60%),radial-gradient(700px 700px at 0% 30%,rgba(247,148,29,.12),transparent 60%),'+C.navy,sc).className='abs';
  const h = el('div','left:80px;top:240px;width:920px;font-size:156px;line-height:.98',sc); h.className='abs';
  const a = maskLine(h,'','Notre'), b = maskLine(h,'color:'+C.cyan,'Mission');
  riseIn(a,wt(id,0)-.1,.8); riseIn(b,wt(id,1)-.15,.8);
  const words = 'aider les flottes indépendantes à se développer et les organisations à réduire leurs coûts grâce à une logistique plus intelligente'.split(' ');
  const key = new Set([2,3,9,10,13,14,19]);
  const tx = el('div','left:80px;top:640px;width:920px;font-size:60px;line-height:1.28;font-weight:500',sc); tx.className='abs';
  words.forEach((w,i)=>{
    const s = el('span','display:inline-block;margin-right:.28em;opacity:.22',tx,w);
    const hi = key.has(i);
    const tm = wt(id,i+2)-.05;
    tl.to(s,{opacity:1,color:hi?'#5cc8f0':'#fff',fontWeight:hi?700:500,duration:.25,ease:'none'},tm);
    tl.fromTo(s,{y:0},{y:-8,duration:.18,yoyo:true,repeat:1,ease:'sine.out'},tm);
  });
  const ph = [['Logistique-Innovante-4-4.jpg','Logistique innovante',80],['Experts-1.jpg','Experts',400],['Papser-600x391.jpg','Papsers',720]];
  ph.forEach((p,i)=>{
    const c = el('div',`left:${p[2]}px;top:1290px;width:280px;height:360px;box-shadow:0 26px 60px rgba(0,0,0,.45)`,sc); c.className='card';
    const im = el('div','inset:-20px;background:'+IMG(p[0])+(i==2?' 38% 50%':' 50% 50%')+'/cover',c); im.className='abs';
    el('div','inset:0;background:linear-gradient(180deg,rgba(20,26,68,0) 45%,rgba(20,26,68,.92) 100%)',c).className='abs';
    const lb = el('div','left:20px;bottom:20px;font-size:31px;line-height:1.05;width:240px',c,p[1]); lb.className='abs ub';
    const tm = S+2.0+i*0.9;
    tl.fromTo(c,{clipPath:'circle(0% at 50% 50%)',y:60,scale:.85},{clipPath:'circle(95% at 50% 50%)',y:0,scale:1,duration:.9,ease:'power3.out'},tm);
    tl.fromTo(im,{scale:1.4},{scale:1.04,duration:3.2,ease:'power2.out'},tm);
    tl.fromTo(c,{y:0},{y:-12,duration:1.7,ease:'sine.inOut',yoyo:true,repeat:2},tm+.9);
  });
})();

/* ================= SCÈNE 6 — UPS, ambition, partenaires (42,5–52,5 s) ================= */
(function(){
  const id='s6', S=START[id], sc = scene(id, 6, C.deep);
  el('div','inset:0;background:radial-gradient(900px 800px at 0% 100%,rgba(46,155,198,.45),transparent 60%),radial-gradient(800px 700px at 100% 0%,rgba(247,148,29,.2),transparent 60%),#181f52',sc).className='abs';
  const card = el('div','left:80px;top:250px;width:920px;height:520px;box-shadow:0 34px 80px rgba(0,0,0,.5)',sc); card.className='card';
  const im = el('div','inset:-30px;background:'+IMG('UPS-PAPS-4.jpg')+' 50% 35%/cover',card); im.className='abs';
  el('div','inset:0;background:linear-gradient(180deg,rgba(20,26,68,0) 38%,rgba(20,26,68,.95) 100%)',card).className='abs';
  const ub = el('div','left:44px;bottom:100px;font-size:84px;line-height:1',card,'UPS <span style="color:'+C.orange+'">&amp;</span> Paps'); ub.className='abs ub';
  const us = el('div','left:46px;bottom:44px;font-size:36px;color:#d6e4f2;font-weight:500',card,'Deux fois plus de forces'); us.className='abs';
  tl.fromTo(card,{y:-200,opacity:0,scale:.9},{y:0,opacity:1,scale:1,duration:.95,ease:'power4.out'},wt(id,0)-.2);
  tl.fromTo(im,{scale:1.35},{scale:1.03,duration:3.5,ease:'power2.out'},wt(id,0)-.2);
  tl.fromTo([ub,us],{opacity:0,y:40},{opacity:1,y:0,duration:.7,stagger:.12},wt(id,1)-.1);
  // ambition + ondes
  const bx = el('div','left:80px;top:850px;width:920px;height:440px',sc); bx.className='abs';
  const tm = wt(id,9)-.15;
  [0,1,2].forEach(i=>{
    const r = el('div','left:560px;top:150px;width:240px;height:240px;border-radius:50%;border:4px solid '+(i==1?C.orange:C.cyan),bx); r.className='abs';
    tl.fromTo(r,{scale:.2,opacity:.8},{scale:3.2,opacity:0,duration:2.2,ease:'power1.out'},tm+.6+i*.7);
  });
  const l1 = el('div','left:0;top:0;font-size:34px;letter-spacing:.2em;text-transform:uppercase;color:'+C.cyan+';font-weight:600',bx,'Notre ambition'); l1.className='abs';
  tl.fromTo(l1,{opacity:0,x:-40},{opacity:1,x:0,duration:.6},tm);
  const h = el('div','left:0;top:62px;width:920px;font-size:96px;line-height:1.02',bx); h.className='abs';
  const h1 = maskLine(h,'','Toute l’Afrique'), h2 = maskLine(h,'color:'+C.orange,'francophone');
  riseIn(h1,wt(id,14)-.2); riseIn(h2,wt(id,17)-.2,.8);
  const flags = [['Sénégal','#00853F'],['Côte d’Ivoire',C.orange],['Bénin','#E8112D']];
  flags.forEach((f,i)=>{
    const p = el('div',`left:${[0,205,490][i]}px;top:345px;padding:12px 26px;font-size:32px;background:rgba(255,255,255,.1);border:2px solid rgba(255,255,255,.35);color:#fff`,bx,`<span style="width:16px;height:16px;border-radius:50%;background:${f[1]};display:inline-block"></span>${f[0]}`); p.className='pill';
    tl.fromTo(p,{opacity:0,y:30,scale:.8},{opacity:1,y:0,scale:1,duration:.6,ease:'back.out(1.8)'},wt(id,5)-.2+i*.2);
  });
  const plus = el('div','left:735px;top:345px;padding:12px 26px;font-size:32px;background:'+C.orange+';color:#fff;font-weight:700',bx,'+ de pays'); plus.className='pill';
  tl.fromTo(plus,{opacity:0,scale:.5},{opacity:1,scale:1,duration:.6,ease:'back.out(2)'},wt(id,15));
  // partenaires
  const pl = el('div','left:80px;top:1350px;font-size:50px',sc,'Ils nous font confiance.'); pl.className='abs ub';
  tl.fromTo(pl,{opacity:0,x:-60},{opacity:1,x:0,duration:.7},wt(id,5)-.1);
  const mq = el('div','left:0;top:1450px;width:1080px;height:210px;overflow:hidden',sc); mq.className='abs';
  const logos=['3x-logo-jumia.png','3x-dhl-logo.png','3x-logo-boa.png','3x-orange-logo.png','3x-eiffage-logo.png','3x-logo-decathlon.png'];
  const row = el('div','left:0;top:0;height:210px;width:'+(logos.length*2*300)+'px;display:flex;gap:30px',mq); row.className='abs';
  [...logos,...logos].forEach(l=>{ const b = el('div','flex:0 0 270px;height:170px;margin-top:20px;border-radius:26px;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 14px 34px rgba(0,0,0,.3)',row); const i = el('img','width:210px;height:auto',b); i.src='assets/'+l; });
  tl.fromTo(mq,{opacity:0,y:80},{opacity:1,y:0,duration:.8},wt(id,5)+.05);
  tl.fromTo(row,{x:40},{x:-(logos.length*300),duration:8.2,ease:'none'},wt(id,5)+.05);
})();

/* ================= SCÈNE 7 — Appel à l’action (52,5–62 s) ================= */
(function(){
  const id='s7', S=START[id], sc = scene(id, 7, C.deep);
  el('div','inset:0;background:radial-gradient(1000px 900px at 50% 0%,rgba(46,155,198,.6),transparent 60%),radial-gradient(900px 700px at 50% 100%,rgba(247,148,29,.3),transparent 60%),#141a44',sc).className='abs';
  const logo = el('img','left:290px;top:260px;width:500px',sc); logo.src='assets/logo-paps-white-4x.png'; logo.className='abs';
  tl.fromTo(logo,{scale:.3,opacity:0,rotate:-14},{scale:1,opacity:1,rotate:0,duration:1.1,ease:'back.out(1.6)'},wt(id,0)-.15);
  tl.fromTo(logo,{y:0},{y:-10,duration:2,ease:'sine.inOut',yoyo:true,repeat:3},wt(id,0)+1);
  const h = el('div','left:80px;top:470px;width:920px;font-size:96px;line-height:1.02;text-align:center',sc); h.className='abs';
  const a = maskLine(h,'display:block;text-align:center','Une expérience'), b = maskLine(h,'text-align:center;color:'+C.cyan,'de logistique'), c = maskLine(h,'text-align:center;color:'+C.orange,'unique');
  riseIn(a,wt(id,1)-.15); riseIn(b,wt(id,3)-.15); riseIn(c,wt(id,5)-.2,.8);
  const ph = el('div','left:80px;top:860px;width:920px;height:380px;box-shadow:0 30px 70px rgba(0,0,0,.5)',sc); ph.className='card';
  const pi = el('div','inset:-20px;background:'+IMG('Papser-600x391.jpg')+' 50% 30%/cover',ph); pi.className='abs';
  el('div','inset:0;background:linear-gradient(180deg,rgba(20,26,68,0) 55%,rgba(20,26,68,.7) 100%)',ph).className='abs';
  tl.fromTo(ph,{clipPath:'inset(0% 50% 0% 50% round 36px)',opacity:0},{clipPath:'inset(0% 0% 0% 0% round 36px)',opacity:1,duration:.95,ease:'power4.inOut'},wt(id,1)+.3);
  tl.fromTo(pi,{scale:1.4},{scale:1.04,duration:6,ease:'power1.out'},wt(id,1)+.3);
  const btn = el('div','left:80px;top:1300px;width:920px;height:130px;border-radius:26px;background:'+C.orange+';font-size:54px;justify-content:center;color:#fff;box-shadow:0 20px 50px rgba(247,148,29,.5)',sc,'Demander un devis  →'); btn.className='pill ub';
  pop(btn, wt(id,6)-.15);
  tl.fromTo(btn,{scale:1},{scale:1.04,duration:.5,yoyo:true,repeat:5,ease:'sine.inOut'},wt(id,6)+.8);
  const pa = el('div','left:80px;top:1465px;font-size:36px;padding:18px 36px;background:rgba(255,255,255,.12);border:2px solid rgba(255,255,255,.4);color:#fff',sc,SVG.user.replace(/width="40" height="40"/,'width="36" height="36"')+'Espace Client'); pa.className='pill';
  const pb = el('div','left:480px;top:1465px;font-size:36px;padding:18px 36px;background:rgba(255,255,255,.12);border:2px solid rgba(255,255,255,.4);color:#fff',sc,'Suivi de commande'); pb.className='pill';
  tl.fromTo([pa,pb],{opacity:0,y:40},{opacity:1,y:0,duration:.6,stagger:.15,ease:'back.out(1.6)'},wt(id,8)-.1);
  const url = el('div','left:0;top:1580px;width:1080px;text-align:center;font-size:64px;color:#fff',sc,'papslogistics<span style="color:'+C.cyan+'">.com</span>'); url.className='abs ub';
  tl.fromTo(url,{opacity:0,y:40,letterSpacing:'.2em'},{opacity:1,y:0,letterSpacing:'0em',duration:.9,ease:'power3.out'},wt(id,10)-.1);
  // flash blanc d'entrée + fondu de sortie
  const fl = el('div','inset:0;background:#fff;z-index:99999;opacity:0;pointer-events:none',stage);
  tl.fromTo(fl,{opacity:0},{opacity:.85,duration:.18,ease:'power1.in'},START.s7-.02);
  tl.to(fl,{opacity:0,duration:.5,ease:'power2.out'},START.s7+.16);
  const out = el('div','inset:0;background:#0d1230;z-index:100000;opacity:0;pointer-events:none',stage);
  tl.fromTo(out,{opacity:0},{opacity:1,duration:.5,ease:'power1.in'},END-.5);
})();

/* ---------- transitions entre scènes ---------- */
const sc = id => document.getElementById(id);
const D = .85;
trans(sc('s2'),'s2',C.orange,'polygon(100% 0%,100% 0%,100% 100%,100% 100%)','polygon(-60% 0%,100% 0%,100% 100%,-120% 100%)',START.s2-.05,D);
trans(sc('s3'),'s3',C.cyan,'circle(0% at 50% 62%)','circle(150% at 50% 62%)',START.s3-.05,D);
trans(sc('s4'),'s4',C.orange,'inset(100% 0% 0% 0%)','inset(0% 0% 0% 0%)',START.s4-.05,D);
trans(sc('s5'),'s5',C.cyan,'circle(0% at 0% 0%)','circle(165% at 0% 0%)',START.s5-.05,D);
trans(sc('s6'),'s6',C.orange,'polygon(0% 0%,0% 0%,0% 100%,0% 100%)','polygon(0% 0%,160% 0%,220% 100%,0% 100%)',START.s6-.05,D);
// s7 : zoom traversant
tl.fromTo(sc('s7'),{opacity:0,scale:1.35},{opacity:1,scale:1,duration:.8,ease:'power3.out'},START.s7);

tl.duration(END);
window.__tl = tl;
window.__seek = t => { tl.time(t,false); return true; };
/* préchargement */
const urls=[...document.querySelectorAll('img')].map(i=>i.src);
document.querySelectorAll('div').forEach(d=>{const m=/url\(["']?([^"')]+)/.exec(d.style.background||d.style.backgroundImage||''); if(m) urls.push(new URL(m[1],location.href).href);});
window.__ready = Promise.all([document.fonts.ready, ...[...new Set(urls)].map(u=>new Promise(r=>{const i=new Image();i.onload=i.onerror=r;i.src=u;}))]).then(()=>{tl.time(0);return true;});
})();
