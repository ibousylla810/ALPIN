/* ===== S1 0–2.6 : destinations ===== */
{const L=layer(RU,10);show(L,0,2.65);
 const D=[['DAKAR','d_dakar.jpg',0.05],['PARIS','d_paris.jpg',0.65],['ABIDJAN','d_abidjan.jpg',1.25],['BAMAKO','d_bamako.jpg',1.85]];
 D.forEach((d,i)=>{
  const ph=el('div','left:0;top:0;width:1080px;height:1920px;background:url(assets/'+d[1]+') center/cover',L,null,'a');
  el('div','inset:0;background:linear-gradient(180deg,rgba(193,18,20,.35),rgba(193,18,20,.15) 40%,rgba(42,42,42,.75))',ph,null,'a');
  const t=d[2];
  const fx=[{x:1080},{y:-1920},{x:-1080},{scale:2.2,opacity:0}][i];
  tl.fromTo(ph,Object.assign({scale:1.25},fx),{x:0,y:0,scale:1.05,opacity:1,duration:.32,ease:'expo.out'},t);
  tl.to(ph,{scale:1.0,duration:.6,ease:'none'},t+.32);
  const n=txt(L,d[0],760,190,Wt,'text-shadow:12px 12px 0 #C11214');
  tl.set(n,{opacity:0},0);slam(n,t+.05);if(i<3)tl.set(n,{opacity:0},D[i+1][2]);
 });
 stripes(L,1180,0.2);
}
/* ===== S2 2.6–5.6 : marque + 278 liaisons ===== */
sweep(2.65,[Y,G,RU],'x');
{const L=layer(Wt,20);show(L,2.65,5.65);
 const lg=el('img','left:140px;top:300px;width:800px',L,null,'a');lg.src='assets/logo_color4.png';
 tl.fromTo(lg,{clipPath:'inset(0 100% 0 0)',x:-40},{clipPath:'inset(0 0% 0 0)',x:0,duration:.6,ease:'expo.out'},2.75);
 stripes(L,520,2.95);
 const n=txt(L,'0',700,320,RU,'text-shadow:14px 14px 0 #FBD925');const o={v:0};
 tl.fromTo(n,{rotateX:-90,opacity:0},{rotateX:0,opacity:1,duration:.4,ease:'back.out(2)'},3.4);
 tl.to(o,{v:278,duration:1.0,ease:'power2.out',onUpdate:()=>n.textContent=Math.round(o.v)},3.45);
 const l=txt(L,'LIAISONS',1080,140,K);whip(l,4.2);
 const c=card(L,'assets/k_dest.png','left:560px;top:1230px;width:380px;height:300px');
 tl.fromTo(c,{y:500,rotate:15,opacity:0},{y:0,rotate:-4,opacity:1,duration:.5,ease:'back.out(1.6)'},4.5);
}
/* ===== S3 5.6–9.0 : l'équipage ===== */
sweep(5.65,[K,RU],'y');
{const L=layer(K,30);show(L,5.65,9.05);
 const bg=el('div','inset:-80px;background:url(assets/crew.jpg) 55% 50%/cover;filter:blur(26px) brightness(.55)',L,null,'a');
 const c=card(L,'assets/crew.jpg','left:80px;top:560px;width:860px;height:404px');
 c.querySelector('img').style.cssText='width:100%;height:100%;object-fit:cover';
 tl.fromTo(c,{rotateY:75,z:-600,opacity:0},{rotateY:0,z:0,opacity:1,duration:.75,ease:'expo.out'},5.75);
 tl.to(c,{rotateY:-8,rotateX:5,scale:1.04,duration:2.6,ease:'sine.inOut'},6.5);
 tl.fromTo(c.querySelector('img'),{scale:1.3},{scale:1.05,duration:3.2,ease:'power2.out'},5.75);
 const a=txt(L,'DERRIÈRE CHAQUE VOL',300,110,Wt,'text-shadow:8px 8px 0 #C11214');
 tl.fromTo(a,{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.5,ease:'expo.out'},5.85);
 const b=el('div','top:1080px;font-size:66px;color:'+Y+';line-height:1.18;text-shadow:6px 6px 0 #C11214',L,'DES HOMMES ET<br>DES FEMMES ENGAGÉS','T');
 tl.fromTo(b,{y:120,opacity:0},{y:0,opacity:1,duration:.5,ease:'back.out(1.7)'},6.9);
}
/* ===== S4 9.0–12.4 : réservation + paiement ===== */
sweep(9.05,[RU,Wt],'x');
{const L=layer(Wt,40);show(L,9.05,12.45);
 const bg=el('div','left:-200px;top:-200px;width:1500px;height:2400px;background:repeating-linear-gradient(-30deg,#fff 0 60px,#fbeaea 60px 120px)',L,null,'a');
 tl.fromTo(bg,{x:0},{x:-138,duration:3.4,ease:'none'},9.05);
 const ph=el('div','left:290px;top:560px;width:500px;height:960px;border-radius:64px;background:#111;border:14px solid #2A2A2A;box-shadow:24px 24px 0 #C11214;overflow:hidden;transform-style:preserve-3d',L,null,'a');
 const s1=el('img','position:absolute;left:0;top:40px;width:100%',ph);s1.src='assets/k_form.png';
 const s2=el('img','position:absolute;left:0;top:560px;width:100%',ph);s2.src='assets/k_pay.png';
 el('div','position:absolute;inset:0;background:linear-gradient(180deg,#fff 0,#fff 40px,transparent 40px)',ph);
 tl.fromTo(ph,{rotateY:-70,rotateX:20,y:400,opacity:0},{rotateY:-14,rotateX:6,y:0,opacity:1,duration:.8,ease:'expo.out'},9.15);
 tl.to(ph,{rotateY:14,rotateX:-4,duration:2.6,ease:'sine.inOut'},9.95);
 tl.to([s1,s2],{y:-330,duration:.8,ease:'power3.inOut'},10.7);
 const a=txt(L,'RÉSERVEZ EN LIGNE',300,110,RU,'text-shadow:7px 7px 0 #FBD925');whip(a,9.25);out(a,10.65);
 const b=txt(L,'ORANGE MONEY',300,130,K,'text-shadow:7px 7px 0 #FBD925');slam(b,10.75);
 const v=el('div','left:80px;top:440px;font-size:44px;font-weight:900;letter-spacing:.12em;color:'+G,L,'VISA · MASTERCARD','a');
 tl.fromTo(v,{y:-60,opacity:0},{y:0,opacity:1,duration:.4,ease:'back.out(2)'},11.3);
}
/* ===== S5 12.4–15.4 : bagages ===== */
sweep(12.45,[Y,K],'y');
{const L=layer(K,50);show(L,12.45,15.45);
 const h=el('div','inset:0;background:url(assets/c_hero_bag.png) center/cover',L,null,'a');
 tl.fromTo(h,{scale:2,filter:'blur(16px)'},{scale:1.2,filter:'blur(2px)',duration:.6,ease:'expo.out'},12.45);
 tl.to(h,{scale:1.35,rotate:2,duration:2.4,ease:'none'},13.05);
 el('div','inset:0;background:linear-gradient(180deg,rgba(193,18,20,.86),rgba(42,42,42,.92))',L,null,'a');
 const t=txt(L,'EN SOUTE',290,90,Y);bounce(t,12.6);
 const big=txt(L,'2 × 23 KG',430,200,Wt,'text-shadow:12px 12px 0 #DF231E');slam(big,13.0);
 const c=card(L,'assets/k_bag.png','left:160px;top:820px;width:720px');
 tl.fromTo(c,{rotateX:-90,y:200,opacity:0,transformOrigin:'50% 0%'},{rotateX:0,y:0,opacity:1,duration:.6,ease:'back.out(1.6)'},13.9);
 floatC(c,14.5,0.9);
}
/* ===== S6 15.4–19.4 : Teranga ===== */
sweep(15.45,[G,Y],'x');
{const L=layer(RU,60);show(L,15.45,19.45);
 const h=el('div','inset:0;background:url(assets/c_hero_ter.png) center/cover;opacity:.3',L,null,'a');
 tl.fromTo(h,{scale:1.6,rotate:-4},{scale:1.15,rotate:0,duration:4,ease:'power1.out'},15.45);
 const t=txt(L,'TERANGA',290,170,Wt,'text-shadow:10px 10px 0 #2A2A2A');
 tl.fromTo(t,{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.45,ease:'expo.out'},15.55);
 stripes(L,500,15.75);
 const names=['IVORY','SILVER','GOLD','DIAMOND'];
 names.forEach((n,i)=>{const x=80+(i%2)*440,y=640+Math.floor(i/2)*320;
  const w=el('div','left:'+x+'px;top:'+y+'px;width:420px;height:290px;transform-style:preserve-3d',L,null,'a');
  el('div','inset:0;border-radius:24px;background:'+(i==3?K:i==2?Y:'#fff')+';border:6px solid #fff;box-shadow:16px 16px 0 #2A2A2A;display:flex;align-items:flex-end;padding:28px;backface-visibility:hidden;font-weight:900;font-size:56px;letter-spacing:.08em;color:'+(i==3?'#fff':RU),w,'<div><div style="font-size:24px;letter-spacing:.2em;color:'+(i==3?Y:K)+'">TERANGA</div>'+n+'</div>','a');
  el('div','inset:0;border-radius:24px;background:'+G+';border:6px solid #fff;transform:rotateY(180deg);backface-visibility:hidden',w,null,'a');
  tl.fromTo(w,{rotateY:-180,opacity:0,z:-300},{rotateY:0,opacity:1,z:0,duration:.6,ease:'back.out(1.3)'},15.9+i*.2);
  tl.to(w,{rotateY:i%2?-14:14,rotateX:8,duration:2,ease:'sine.inOut'},17.0);
  tl.to(w,{y:-60,opacity:.0,duration:.3,ease:'power2.in'},18.25+i*.04);
 });
 const m=txt(L,'MILES · 3 ANS',1330,110,Y,'text-shadow:7px 7px 0 #2A2A2A');whip(m,16.9);out(m,18.2);
 const v=txt(L,'SALON VIP',900,190,Y,'text-shadow:12px 12px 0 #2A2A2A');slam(v,18.3);
 const d=txt(L,'AÉROPORT DE DAKAR',1140,70,Wt);bounce(d,18.55);
}
/* ===== S7 19.4–22.2 : équipe contact ===== */
sweep(19.45,[Wt,G],'y');
{const L=layer(G,70);show(L,19.45,22.25);
 const c=card(L,'assets/agents.jpg','left:250px;top:620px;width:580px;height:880px');
 c.querySelector('img').style.cssText='width:100%;height:100%;object-fit:cover';
 tl.fromTo(c,{z:-1200,rotateZ:-20,opacity:0},{z:0,rotateZ:-3,opacity:1,duration:.65,ease:'expo.out'},19.5);
 tl.to(c,{rotateZ:2,rotateY:10,duration:2.1,ease:'sine.inOut'},20.15);
 const h=txt(L,'7H — 21H',290,200,Wt,'text-shadow:12px 12px 0 #2A2A2A');
 tl.fromTo(h,{rotateX:90,opacity:0},{rotateX:0,opacity:1,duration:.5,ease:'back.out(1.8)'},19.65);
 const j=txt(L,'CHAQUE JOUR',520,100,Y,'text-shadow:7px 7px 0 #2A2A2A');whip(j,20.6,-1100);
}
/* ===== S8 22.2–24.6 : signature de marque ===== */
sweep(22.25,[RU,Y,G],'x');
{const L=layer(Wt,80);show(L,22.25,24.65);
 const lg=el('img','left:140px;top:330px;width:800px',L,null,'a');lg.src='assets/logo_color4.png';
 tl.fromTo(lg,{scale:.4,opacity:0,rotate:-8},{scale:1,opacity:1,rotate:0,duration:.6,ease:'back.out(1.7)'},22.3);
 stripes(L,560,22.5);
 const a=txt(L,'COMMENCEZ',760,140,RU);const b=txt(L,'UNE NOUVELLE',920,110,K);const c=txt(L,'AVENTURE',1060,160,G,'text-shadow:8px 8px 0 #FBD925');
 [a,b,c].forEach((n,i)=>tl.fromTo(n,{y:160,opacity:0,rotateX:-60},{y:0,opacity:1,rotateX:0,duration:.45,ease:'back.out(1.6)'},22.75+i*.25));
}
/* ===== S9 24.6–27.0 : mention ===== */
sweep(24.65,[K,RU],'y');
{const L=layer(RU,90);show(L,24.65,27.05);
 const band=el('div','left:0;top:600px;width:1080px;height:700px;background:#fff',L,null,'a');
 tl.fromTo(band,{scaleY:0},{scaleY:1,duration:.4,ease:'expo.out'},24.7);
 const a=txt(L,'CONCEPT',690,140,RU);const b=txt(L,'NON OFFICIEL',850,110,K);
 const c=el('div','top:1040px;font-size:52px;color:'+RU+';line-height:1.25',L,'NON AFFILIÉ<br>À AIR SÉNÉGAL','T');
 [a,b,c].forEach((n,i)=>tl.fromTo(n,{x:-1100,opacity:0},{x:0,opacity:1,duration:.4,ease:'expo.out'},24.8+i*.12));
 tl.to([a,b,c],{x:10,duration:.8,yoyo:true,repeat:1,ease:'sine.inOut'},25.4);
}
/* ===== S10 27.0–30.0 : fin ===== */
sweep(27.05,[K,G],'x');
{const L=layer(RU,100);show(L,27.05,null);
 stripes(L,1150,27.2);
 const a=txt(L,'ÉCRIS-MOI',360,170,Wt,'text-shadow:10px 10px 0 #2A2A2A');slam(a,27.1);
 const b=el('div','top:600px;font-size:70px;color:'+Y+';line-height:1.2;text-shadow:6px 6px 0 #2A2A2A',L,'EN MESSAGE<br>PRIVÉ','T');
 tl.fromTo(b,{y:200,opacity:0},{y:0,opacity:1,duration:.45,ease:'back.out(1.8)'},27.5);
 const lb=el('img','left:80px;top:1290px;width:150px;height:150px;border-radius:50%;object-fit:contain;background:#FAF7F3;padding:14px;border:5px solid #fff',L,null,'a');lb.src='assets/logo_b.png';
 const hd=el('div','left:255px;top:1342px;font-size:44px;font-weight:900;color:#fff;letter-spacing:.04em',L,'@brahim_design221','a');
 tl.fromTo(lb,{rotateY:180,scale:.3,opacity:0},{rotateY:0,scale:1,opacity:1,duration:.7,ease:'back.out(1.6)'},27.9);
 tl.fromTo(hd,{x:-60,opacity:0},{x:0,opacity:1,duration:.5},28.1);
 tl.fromTo(a,{scale:1},{scale:1.05,duration:.4,yoyo:true,repeat:3,ease:'sine.inOut'},28.3);
}
tl.duration(30);
