// téléphone réaliste : cadre titane, boutons, île dynamique, ombre douce, vraie épaisseur 3D
function phone3d(p,x,y,w,h,imgs,T){T=T||30;const R=Math.round(w*0.16);
  const sh=el('div','left:'+(x+w*0.1)+'px;top:'+(y+h-30)+'px;width:'+(w*0.8)+'px;height:70px;border-radius:50%;background:rgba(14,13,93,.35);filter:blur(28px)',p,null,'a');
  const wr=el('div','left:'+x+'px;top:'+y+'px;width:'+w+'px;height:'+h+'px;transform-style:preserve-3d',p,null,'a');
  const metal='linear-gradient(90deg,#3a3a3e,#9a9aa0 30%,#55555a 55%,#2a2a2e)';
  const sd=(css)=>el('div','position:absolute;background:'+metal+';'+css,wr);
  sd('left:'+(w-T/2)+'px;top:'+R+'px;width:'+T+'px;height:'+(h-2*R)+'px;transform:rotateY(90deg)');
  const lf=sd('left:'+(-T/2)+'px;top:'+R+'px;width:'+T+'px;height:'+(h-2*R)+'px;transform:rotateY(-90deg)');
  [[.08,.06],[.18,.1],[.31,.1]].forEach(b=>el('div','position:absolute;left:6px;top:'+(b[0]*h)+'px;width:'+(T-12)+'px;height:'+(b[1]*h)+'px;border-radius:6px;background:linear-gradient(90deg,#222,#777,#222)',lf));
  sd('left:'+R+'px;top:'+(-T/2)+'px;width:'+(w-2*R)+'px;height:'+T+'px;transform:rotateX(90deg)');
  sd('left:'+R+'px;top:'+(h-T/2)+'px;width:'+(w-2*R)+'px;height:'+T+'px;transform:rotateX(-90deg)');
  const back=el('div','position:absolute;inset:0;border-radius:'+R+'px;background:linear-gradient(150deg,#4a4a50,#1c1c1f 60%,#3a3a3e);transform:translateZ(-'+(T/2)+'px) rotateY(180deg);backface-visibility:hidden;display:flex;align-items:center;justify-content:center',wr);
  const bl=el('img','width:34%;border-radius:22px;opacity:.9',back);bl.src='assets/logo_wave4.png';
  const fr=el('div','position:absolute;inset:0;border-radius:'+R+'px;padding:9px;background:linear-gradient(135deg,#b8b8be,#3a3a3e 22%,#1c1c1f 50%,#4a4a50 80%,#c8c8ce);transform:translateZ('+(T/2)+'px);backface-visibility:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.3)',wr);
  const bez=el('div','position:absolute;inset:9px;border-radius:'+(R-9)+'px;background:#000;padding:10px',fr);
  const scr=el('div','position:absolute;inset:10px;border-radius:'+(R-19)+'px;overflow:hidden;background:#f5f6fa',bez);
  const im=el('img','position:absolute;left:0;top:0;width:100%',scr);im.src='assets/w_screen.png';
  el('div','position:absolute;left:50%;top:'+(w*0.035)+'px;width:'+(w*0.3)+'px;height:'+(w*0.075)+'px;margin-left:-'+(w*0.15)+'px;border-radius:40px;background:#000',scr);
  const gl=el('div','position:absolute;inset:0;background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.45) 48%,transparent 62%);transform:translateX(-120%)',scr);
  return {w:wr,imgs:[im,im],glare:gl,shadow:sh};
}
