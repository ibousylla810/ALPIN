/* ---- outils « pro » : 3D, sons, particules ---- */
const LAY=[]; const SFX=[];
function sfx(type,t,extra){SFX.push([type,+t.toFixed(3),extra||0]);}
// graine fixe => rendu identique à chaque image
let _seed=7; function rnd(){_seed=(_seed*16807)%2147483647;return (_seed-1)/2147483646;}
// téléphone en volume : face, dos, 4 tranches
function phone3d(p,x,y,w,h,imgs,T){T=T||36;const R=Math.round(w*0.12);
  const wr=el('div','left:'+x+'px;top:'+y+'px;width:'+w+'px;height:'+h+'px;transform-style:preserve-3d',p,null,'a');
  const side='background:linear-gradient(90deg,#05051f,#2b2a7a 50%,#05051f);position:absolute;';
  el('div',side+'left:'+(w-T/2)+'px;top:'+R+'px;width:'+T+'px;height:'+(h-2*R)+'px;transform:rotateY(90deg)',wr);
  el('div',side+'left:'+(-T/2)+'px;top:'+R+'px;width:'+T+'px;height:'+(h-2*R)+'px;transform:rotateY(-90deg)',wr);
  el('div',side+'left:'+R+'px;top:'+(-T/2)+'px;width:'+(w-2*R)+'px;height:'+T+'px;transform:rotateX(90deg)',wr);
  el('div',side+'left:'+R+'px;top:'+(h-T/2)+'px;width:'+(w-2*R)+'px;height:'+T+'px;transform:rotateX(-90deg)',wr);
  const back=el('div','position:absolute;inset:0;border-radius:'+R+'px;background:linear-gradient(160deg,#1CC3FE,#0E0D5D);transform:translateZ(-'+(T/2)+'px) rotateY(180deg);backface-visibility:hidden;display:flex;align-items:center;justify-content:center',wr);
  const bl=el('img','width:45%;border-radius:24px',back);bl.src='assets/logo_wave4.png';
  const fr=el('div','position:absolute;inset:0;border-radius:'+R+'px;background:#fff;border:14px solid #000;overflow:hidden;transform:translateZ('+(T/2)+'px);backface-visibility:hidden',wr);
  let top=50;const ims=imgs.map(s=>{const i=el('img','position:absolute;left:0;top:'+top+'px;width:100%',fr);i.src=s;top+=Math.round((w-28)*(s.includes('hero')?350/780:440/720));return i;});
  el('div','position:absolute;left:'+(w/2-80)+'px;top:12px;width:160px;height:32px;border-radius:18px;background:#000',fr);
  const gl=el('div','position:absolute;inset:0;background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,.55) 45%,transparent 60%);transform:translateX(-120%)',fr);
  return {w:wr,imgs:ims,glare:gl};
}
function glare(P,t){tl.fromTo(P.glare,{xPercent:-120},{xPercent:120,duration:.7,ease:'power2.inOut'},t);}
// titre lettre par lettre en 3D
function letters3d(n,t){const s=n.textContent;n.innerHTML=s.split('').map(c=>'<span style="display:inline-block">'+(c==' '?'&nbsp;':c)+'</span>').join('');n.style.perspective='900px';
  tl.fromTo(n.children,{rotateX:-110,y:80,z:-300,opacity:0},{rotateX:0,y:0,z:0,opacity:1,duration:.55,stagger:.035,ease:'back.out(2)'},t);sfx('whoosh',t);}
// particules de fond
function particles(L,t0,t1){const cols=['#1CC3FE','#F47800','#ffffff','#0E0D5D'];
  for(let i=0;i<14;i++){const s=10+rnd()*46,x=rnd()*1080,y=300+rnd()*1500,c=cols[i%4];
    const d=el('div','left:'+x+'px;top:'+y+'px;width:'+s+'px;height:'+s+'px;border-radius:'+(i%3?'50%':'8px')+';background:'+c+';opacity:.35',L,null,'a');
    tl.fromTo(d,{y:0,rotate:0},{y:-(200+rnd()*400),rotate:180,duration:(t1-t0)+.8,ease:'none'},t0);}}
