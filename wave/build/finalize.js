/* ---- transitions 3D entre scènes + fond animé ---- */
(function(){
 const D=.6, types=['cube','cubeV','zoom','swing','cube','flip','zoom','cubeV','cube'];
 LAY.forEach((o,i)=>{const nx=LAY[i+1];particles(o.L,o.t0,nx?nx.t0+D:30);});
 const fl=el('div','inset:0;background:#fff;z-index:99999;opacity:0;pointer-events:none',st,null,'a');
 for(let i=1;i<LAY.length;i++){
  const A=LAY[i-1].L,Bn=LAY[i].L,t=LAY[i].t0,ty=types[(i-1)%types.length],e='power3.inOut';
  tl.set(A,{display:'none'},t+D+.02);
  if(ty=='cube'){tl.set(A,{transformOrigin:'100% 50%'},t);tl.to(A,{xPercent:-100,rotateY:-90,duration:D,ease:e},t);
    tl.fromTo(Bn,{xPercent:100,rotateY:90,transformOrigin:'0% 50%'},{xPercent:0,rotateY:0,duration:D,ease:e},t);}
  if(ty=='cubeV'){tl.set(A,{transformOrigin:'50% 100%'},t);tl.to(A,{yPercent:-100,rotateX:90,duration:D,ease:e},t);
    tl.fromTo(Bn,{yPercent:100,rotateX:-90,transformOrigin:'50% 0%'},{yPercent:0,rotateX:0,duration:D,ease:e},t);}
  if(ty=='zoom'){tl.to(A,{scale:3,z:500,opacity:0,duration:D*.8,ease:'power3.in'},t);
    tl.fromTo(Bn,{scale:.25,rotateZ:-20,opacity:0},{scale:1,rotateZ:0,opacity:1,duration:D,ease:'expo.out'},t+.12);}
  if(ty=='swing'){tl.set(A,{transformOrigin:'0% 50%'},t);tl.to(A,{rotateY:-80,x:-200,opacity:0,duration:D,ease:e},t);
    tl.fromTo(Bn,{rotateY:80,x:300,z:-500,transformOrigin:'100% 50%'},{rotateY:0,x:0,z:0,duration:D,ease:e},t);}
  if(ty=='flip'){tl.to(A,{rotateX:-90,opacity:.2,duration:D/2,ease:'power3.in'},t);
    tl.fromTo(Bn,{rotateX:90,opacity:0},{rotateX:0,opacity:1,duration:D/2+.1,ease:'back.out(1.4)'},t+D/2);}
  tl.fromTo(fl,{opacity:0},{opacity:.35,duration:.08,yoyo:true,repeat:1,ease:'none'},t+D*.45);
  sfx('trans',t);
 }
 window.__sfx=SFX;
})();
