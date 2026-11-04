/* ===== S1 0–2.6 : hook gratuit ===== */
{const L=layer(B,10);show(L,0,2.65);
 waves(L,1180,0.1);
 const a=txt(L,'DÉPÔT ET RETRAIT',520,110,N);whip(a,0.1);
 const g=txt(L,'GRATUITS',700,220,Wt,'text-shadow:12px 12px 0 #0E0D5D');slam(g,1.25);
 const z=el('div','left:640px;top:250px;width:300px;height:300px;border-radius:50%;background:'+O+';display:flex;align-items:center;justify-content:center;font-weight:900;font-size:120px;color:#fff;box-shadow:14px 14px 0 #0E0D5D',L,'0F','a');
 tl.fromTo(z,{scale:0,rotate:-180},{scale:1,rotate:0,duration:.6,ease:'back.out(1.8)'},0.5);
 tl.to(z,{rotate:12,duration:1.5,ease:'sine.inOut'},1.1);
}
/* ===== S2 2.6–5.6 : marque ===== */
sweep(2.65,[N,O,Wt],'x');
{const L=layer(Wt,20);show(L,2.65,5.65);
 const lg=el('img','left:240px;top:300px;width:600px',L,null,'a');lg.src='assets/logo_wave4.png';
 tl.fromTo(lg,{scale:.2,rotate:-20,opacity:0},{scale:1,rotate:0,opacity:1,duration:.7,ease:'back.out(1.8)'},2.75);
 tl.to(lg,{y:-14,duration:.5,yoyo:true,repeat:3,ease:'sine.inOut'},3.5);
 const a=txt(L,'VOTRE ALLIÉ',640,130,N);
 tl.fromTo(a,{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.45,ease:'expo.out'},3.3);
 const b=txt(L,'MOBILE MONEY',800,140,B,'text-shadow:8px 8px 0 #0E0D5D');slam(b,3.9);
 const c=card(L,'assets/w_hero.png','left:150px;top:1060px;width:700px');
 tl.fromTo(c,{y:500,rotateX:60,opacity:0},{y:0,rotateX:8,opacity:1,duration:.6,ease:'expo.out'},4.4);
}
/* ===== S3 5.6–9.0 : factures (téléphone 3D) ===== */
sweep(5.65,[B,N],'y');
{const L=layer(N,30);show(L,5.65,9.05);
 waves(L,1420,5.7);
 const ph=el('div','left:270px;top:560px;width:540px;height:880px;border-radius:64px;background:#fff;border:16px solid #000;box-shadow:24px 24px 0 #1CC3FE;overflow:hidden',L,null,'a');
 const sc=el('img','position:absolute;left:0;top:60px;width:100%',ph);sc.src='assets/w_app.png';
 el('div','position:absolute;left:170px;top:14px;width:170px;height:34px;border-radius:20px;background:#000',ph);
 tl.fromTo(ph,{rotateY:80,rotateX:-15,z:-600,opacity:0},{rotateY:-12,rotateX:5,z:0,opacity:1,duration:.8,ease:'expo.out'},5.75);
 tl.to(ph,{rotateY:14,rotateX:-4,duration:2.5,ease:'sine.inOut'},6.55);
 tl.fromTo(sc,{scale:1},{scale:1.25,transformOrigin:'50% 30%',duration:2.5,ease:'power1.inOut'},6.5);
 const a=txt(L,'FACTURES',260,180,Wt,'text-shadow:10px 10px 0 #F47800');slam(a,5.9);
 const b=txt(L,'SANS FRAIS',440,110,B);bounce(b,6.9);
}
/* ===== S4 9.0–12.0 : crédit ===== */
sweep(9.05,[O,Wt],'x');
{const L=layer(O,40);show(L,9.05,12.05);
 const c=card(L,'assets/w_app.png','left:80px;top:620px;width:860px;height:560px');
 const im=c.querySelector('img');im.style.cssText='width:100%;position:absolute;left:0;top:0';
 tl.fromTo(c,{rotateX:-80,y:300,opacity:0},{rotateX:0,y:0,opacity:1,duration:.6,ease:'back.out(1.5)'},9.1);
 tl.to(im,{scale:2.3,x:-560,y:-560,transformOrigin:'0 0',duration:.9,ease:'expo.inOut'},10.0);
 const a=txt(L,'CRÉDIT',260,200,Wt,'text-shadow:12px 12px 0 #0E0D5D');whip(a,9.2);
 const b=txt(L,'INSTANTANÉ',470,120,N);whip(b,9.5,-1100);
 const t=txt(L,'TOUS RÉSEAUX',1280,130,Wt,'text-shadow:8px 8px 0 #0E0D5D');slam(t,10.6);
}
/* ===== S5 12.0–15.6 : marchands ===== */
sweep(12.05,[N,B],'y');
{const L=layer(B,50);show(L,12.05,15.65);
 const bg=el('div','inset:-60px;background:url(assets/w_photo.png) 50% 30%/cover;filter:blur(22px) brightness(.8)',L,null,'a');
 const c=card(L,'assets/w_photo.png','left:180px;top:640px;width:720px;height:784px');
 c.querySelector('img').style.cssText='width:100%;height:100%;object-fit:cover';
 tl.fromTo(c,{z:-1400,rotateZ:-25,opacity:0},{z:0,rotateZ:-3,opacity:1,duration:.7,ease:'expo.out'},12.1);
 tl.to(c,{rotateZ:2,rotateY:10,duration:2.6,ease:'sine.inOut'},12.8);
 const n=txt(L,'0K+',250,240,Wt,'text-shadow:14px 14px 0 #0E0D5D');const o={v:0};
 tl.fromTo(n,{scale:.3,opacity:0},{scale:1,opacity:1,duration:.35,ease:'back.out(2)'},12.25);
 tl.to(o,{v:100,duration:1.0,ease:'power2.out',onUpdate:()=>n.textContent=Math.round(o.v)+'K+'},12.3);
 const m=txt(L,'MARCHANDS ACTIFS',500,90,N);bounce(m,13.3);
}
/* ===== S6 15.6–19.0 : chiffres API ===== */
sweep(15.65,[O,N],'x');
{const L=layer(N,60);show(L,15.65,19.05);
 waves(L,1440,15.7);
 const S=[['1M+','UTILISATEURS ACTIFS','SUR LES API WAVE',B],['500K+','BÉNÉFICIAIRES','PAR MOIS',O]];
 S.forEach((s,i)=>{const w=el('div','left:80px;top:'+(300+i*560)+'px;width:860px;height:500px;transform-style:preserve-3d',L,null,'a');
  el('div','inset:0;border-radius:30px;background:'+s[3]+';border:8px solid #fff;box-shadow:20px 20px 0 #000;padding:50px;backface-visibility:hidden',w,'<div style="font-weight:900;font-size:200px;color:#fff;line-height:1;letter-spacing:.04em;text-shadow:10px 10px 0 #0E0D5D">'+s[0]+'</div><div style="margin-top:40px;font-weight:900;font-size:50px;letter-spacing:.1em;color:#0E0D5D">'+s[1]+'</div><div style="margin-top:10px;font-weight:700;font-size:40px;letter-spacing:.1em;color:#fff">'+s[2]+'</div>','a');
  el('div','inset:0;border-radius:30px;background:#fff;transform:rotateY(180deg);backface-visibility:hidden',w,null,'a');
  tl.fromTo(w,{rotateY:-180,z:-400,opacity:0},{rotateY:0,z:0,opacity:1,duration:.7,ease:'back.out(1.3)'},15.8+i*1.0);
  tl.to(w,{rotateY:i?-8:8,rotateX:4,duration:2,ease:'sine.inOut'},16.6+i*.6);
 });
}
/* ===== S7 19.0–22.2 : mission ===== */
sweep(19.05,[B,Wt],'y');
{const L=layer(Wt,70);show(L,19.05,22.25);
 waves(L,250,19.1);
 const a=txt(L,'L’AFRIQUE',380,180,N);
 tl.fromTo(a,{rotateX:-90,opacity:0,transformOrigin:'50% 100%'},{rotateX:0,opacity:1,duration:.45,ease:'back.out(2)'},19.2);
 const b=txt(L,'CASHLESS',580,200,B,'text-shadow:12px 12px 0 #0E0D5D');slam(b,20.2);
 const c=card(L,'assets/w_mission.png','left:150px;top:900px;width:740px');
 tl.fromTo(c,{x:1100,rotate:12},{x:0,rotate:-2,duration:.6,ease:'expo.out'},19.6);
 floatC(c,20.2,2);
 const p=txt(L,'PREMIER CONTINENT',1380,70,O);whip(p,20.8,-1100);
}
/* ===== S8 22.2–24.6 : sécurité ===== */
sweep(22.25,[N,O],'x');
{const L=layer(N,80);show(L,22.25,24.65);
 const sh=el('div','left:340px;top:560px;width:400px;height:470px',L,'<svg viewBox="0 0 100 118" width="400" height="470"><path d="M50 4 92 20v34c0 30-19 50-42 60C27 104 8 84 8 54V20z" fill="#1CC3FE" stroke="#fff" stroke-width="5"/><path d="M30 60l14 14 28-30" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>','a');
 tl.fromTo(sh,{scale:0,rotateY:180},{scale:1,rotateY:0,duration:.7,ease:'back.out(1.6)'},22.3);
 tl.to(sh,{scale:1.06,duration:.4,yoyo:true,repeat:3,ease:'sine.inOut'},23.0);
 const a=txt(L,'SÉCURITÉ',260,180,Wt,'text-shadow:10px 10px 0 #F47800');slam(a,22.4);
 const b=el('div','top:1140px;font-size:72px;color:'+B+';line-height:1.15',L,'STANDARDS<br>INTERNATIONAUX','T');
 tl.fromTo(b,{y:150,opacity:0},{y:0,opacity:1,duration:.45,ease:'back.out(1.7)'},23.1);
}
/* ===== S9 24.6–27.0 : mention ===== */
sweep(24.65,[B,Wt],'y');
{const L=layer(N,90);show(L,24.65,27.05);
 const band=el('div','left:0;top:600px;width:1080px;height:700px;background:#fff',L,null,'a');
 tl.fromTo(band,{scaleY:0},{scaleY:1,duration:.4,ease:'expo.out'},24.7);
 const a=txt(L,'CONCEPT',690,140,N);const b=txt(L,'NON OFFICIEL',850,110,B);
 const c=el('div','top:1040px;font-size:56px;color:'+N+';line-height:1.25',L,'NON AFFILIÉ<br>À WAVE','T');
 [a,b,c].forEach((n,i)=>tl.fromTo(n,{x:-1100,opacity:0},{x:0,opacity:1,duration:.4,ease:'expo.out'},24.8+i*.12));
 tl.to([a,b,c],{x:10,duration:.8,yoyo:true,repeat:1,ease:'sine.inOut'},25.4);
}
/* ===== S10 27.0–30.0 : fin ===== */
sweep(27.05,[O,N],'x');
{const L=layer(B,100);show(L,27.05,null);
 waves(L,1150,27.2);
 const a=txt(L,'ÉCRIS-MOI',360,170,Wt,'text-shadow:10px 10px 0 #0E0D5D');slam(a,27.1);
 const b=el('div','top:600px;font-size:70px;color:'+N+';line-height:1.2',L,'EN MESSAGE<br>PRIVÉ','T');
 tl.fromTo(b,{y:200,opacity:0},{y:0,opacity:1,duration:.45,ease:'back.out(1.8)'},27.5);
 const lb=el('img','left:80px;top:1290px;width:150px;height:150px;border-radius:50%;object-fit:contain;background:#FAF7F3;padding:14px;border:5px solid #fff',L,null,'a');lb.src='assets/logo_b.png';
 const hd=el('div','left:255px;top:1342px;font-size:44px;font-weight:900;color:#fff;letter-spacing:.04em;text-shadow:3px 3px 0 #0E0D5D',L,'@brahim_design221','a');
 tl.fromTo(lb,{rotateY:180,scale:.3,opacity:0},{rotateY:0,scale:1,opacity:1,duration:.7,ease:'back.out(1.6)'},27.9);
 tl.fromTo(hd,{x:-60,opacity:0},{x:0,opacity:1,duration:.5},28.1);
 tl.fromTo(a,{scale:1},{scale:1.05,duration:.4,yoyo:true,repeat:3,ease:'sine.inOut'},28.3);
}
tl.duration(30);
