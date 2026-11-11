# Musique synthwave + effets sonores + voix -> audio/mix.wav. Lit audio/sfx.json et audio/timing.json
import numpy as np, wave, json, subprocess
SR=44100; T=json.load(open('audio/timing.json')); DUR=T['END']; SFX=json.load(open('audio/sfx.json'))
n=int(SR*DUR)+SR; rng=np.random.default_rng(11)
def bus(): return [np.zeros(n),np.zeros(n)]
music,fx,voice=bus(),bus(),bus()
def add(b,sig,start,pan=0.0,g=1.0):
    i=int(start*SR)
    if i>=n or i<0: return
    j=min(n,i+len(sig)); s=sig[:j-i]*g
    b[0][i:j]+=s*(1-max(pan,0)); b[1][i:j]+=s*(1+min(pan,0))
tt=lambda d:np.arange(int(d*SR))/SR
def env(d,a=.005,r=.1):
    m=int(d*SR); e=np.ones(m); a_=max(1,int(a*SR)); r_=max(1,int(r*SR)); e[:a_]=np.linspace(0,1,a_); e[-r_:]*=np.linspace(1,0,r_); return e
def lp(x,k):  # passe-bas simple (moyenne glissante)
    return np.convolve(x,np.ones(k)/k,'same')
def noise(d): return rng.standard_normal(int(d*SR))
def sweep(d,f0,f1,curve=2):
    t=tt(d); f=f0+(f1-f0)*(t/d)**curve; return np.sin(2*np.pi*np.cumsum(f)/SR)
# --- bibliothèque d'effets ---
def s_whoosh(d=.7):
    x=noise(d); t=tt(d); k=np.sin(np.pi*t/d)**2
    y=lp(x,6)*k + (lp(x,40)-lp(x,300))*0.0
    return (lp(x,3)-lp(x,60))*k*3
def s_boom(d=1.4):
    t=tt(d); f=90*np.exp(-t*5)+34; return (np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*3.2)+lp(noise(d),40)*np.exp(-t*9)*.8)
def s_hit(d=.5):
    t=tt(d); return np.tanh(3*np.sin(2*np.pi*np.cumsum(180*np.exp(-t*30)+55)/SR))*np.exp(-t*10)+ (noise(d)*np.exp(-t*40))*.4
def s_glitch(d=.45):
    out=np.zeros(int(d*SR)); pos=0
    while pos<len(out):
        L=int(rng.uniform(.012,.05)*SR); f=rng.choice([180,420,900,1800,3200]); t=np.arange(L)/SR
        seg=np.sign(np.sin(2*np.pi*f*t))*.5+rng.standard_normal(L)*.3*rng.random()
        out[pos:pos+L]=seg[:len(out)-pos]; pos+=L+int(rng.uniform(0,.03)*SR)
    return out*np.linspace(1,.3,len(out))
def s_riser(d=1.2):
    t=tt(d); x=lp(noise(d),4)*(t/d)**2; return x*1.5+sweep(d,200,1800,2.5)*(t/d)**3*.4
def s_swell(d=1.4):
    t=tt(d); return (lp(noise(d),30)*np.sin(np.pi*t/d)**2)*2.5
def s_tick(d=.12):
    t=tt(d); return np.sin(2*np.pi*1900*t)*np.exp(-t*60)+noise(d)*np.exp(-t*80)*.3
def s_pop(d=.18):
    t=tt(d); return np.sin(2*np.pi*(500+900*np.exp(-t*30))*t)*np.exp(-t*22)
def s_ding(d=.8):
    t=tt(d); return (np.sin(2*np.pi*1318*t)+.5*np.sin(2*np.pi*1975*t)+.25*np.sin(2*np.pi*2637*t))*np.exp(-t*6)*.6
def s_stamp(d=.35):
    t=tt(d); return (np.sin(2*np.pi*(120*np.exp(-t*25)+50)*t)*1.4+noise(d)*.7)*np.exp(-t*18)
def s_siren(d=1.6):
    t=tt(d); f=700+300*np.sin(2*np.pi*1.2*t); return np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*.25*np.sin(np.pi*t/d)
def s_shutter(d=.55):
    out=np.zeros(int(d*SR))
    for k,tm in enumerate((0,.07,.14,.22,.31,.42)):
        c=s_tick(.05)*1.4; i=int(tm*SR); out[i:i+len(c)]+=c
    return out+ (lp(noise(d),8)*np.exp(-tt(d)*7))*.6
def s_click(d=.1):
    t=tt(d); return (np.sin(2*np.pi*2400*t)*np.exp(-t*90)+noise(d)*np.exp(-t*120)*.5)
def s_shine(d=.9):
    t=tt(d); return (sweep(d,1200,5200,1)*np.sin(np.pi*t/d)**2)*.35
def s_rewind(d=.7):
    t=tt(d); return sweep(d,3000,300,.7)*.3*np.sin(np.pi*t/d)+lp(noise(d),2)*.2*np.sin(np.pi*t/d)
LIB=dict(whoosh=s_whoosh,boom=s_boom,hit=s_hit,glitch=s_glitch,riser=s_riser,swell=s_swell,tick=s_tick,pop=s_pop,ding=s_ding,stamp=s_stamp,siren=s_siren,shutter=s_shutter,click=s_click,shine=s_shine,rewind=s_rewind)
PAN=dict(whoosh=.0)
for k,e in enumerate(SFX):
    f=LIB[e['type']]; sig=f(); pan=-.35 if e['type'] in('whoosh','pop','ding') and k%2 else (.35 if e['type'] in('whoosh','pop','ding') else 0)
    sig=sig/ max(1e-6,np.max(np.abs(sig)))
    add(fx,sig,e['t'],pan,.55*e['g'])
# --- musique : 104 BPM, Am F C G, basse + arpège + pad + batterie ---
BPM=104; beat=60/BPM
def nf(m): return 440*2**((m-69)/12)
def tone(f,d,harm=(1,.4,.2),a=.01,r=.2,det=0):
    t=tt(d); return sum(h*np.sin(2*np.pi*f*(i+1)*(1+det)*t) for i,h in enumerate(harm))*env(d,a,r)
def saw(f,d,a=.005,r=.15):
    t=tt(d); return (2*((f*t)%1)-1)*env(d,a,r)
def kick():
    t=tt(.4); return np.sin(2*np.pi*np.cumsum(130*np.exp(-t*24)+45)/SR)*np.exp(-t*8)
def snare():
    t=tt(.25); return (noise(.25)*np.exp(-t*20)*.8+np.sin(2*np.pi*190*t)*np.exp(-t*25)*.5)
def hat():
    t=tt(.05); x=np.diff(noise(.05),prepend=0); return x*np.exp(-t*100)
chords=[(57,60,64),(53,57,60),(48,52,55),(55,59,62)]
bars=int(DUR/(beat*4))+2
kicks=[]
for b in range(bars):
    c=chords[b%4]; t0=b*beat*4
    for m in c:
        for d in (-.004,.004): add(music,tone(nf(m),beat*4+.3,(1,.3,.1),a=.4,r=.6,det=d),t0,pan=d*60,g=.05)
    root=c[0]-24
    for k in range(8): add(music,saw(nf(root),beat*.45,r=.1)*np.exp(-tt(beat*.45)*3),t0+k*beat/2,g=.20 if k%2==0 else .11)
    for k in range(16):
        m=c[k%3]+12*(1 if k%6<3 else 2)
        add(music,tone(nf(m),beat*.4,(1,.35),a=.003,r=.2),t0+k*beat/4+ (0.02 if k%2 else 0),pan=((k%4)-1.5)/4,g=.045)
    if t0>=beat*4:  # batterie à partir de la 2e mesure
        for k in range(4):
            tm=t0+k*beat; add(music,kick(),tm,g=.55); kicks.append(tm)
            if k%2==1: add(music,snare(),tm,g=.22)
            add(music,hat(),tm+beat/2,g=.10,pan=.3)
            if t0>=beat*8: add(music,hat(),tm+beat/4,g=.04,pan=-.3); add(music,hat(),tm+beat*3/4,g=.04,pan=-.3)
# sidechain léger sur les kicks
sc=np.ones(n)
for tm in kicks:
    i=int(tm*SR); L=int(.18*SR); 
    if i+L<n: sc[i:i+L]=np.minimum(sc[i:i+L],np.linspace(.5,1,L))
music=[m*sc for m in music]
# --- voix off (alignée sur START+LEAD) ---
for k,st in T['START'].items():
    out=subprocess.check_output(['ffmpeg','-loglevel','error','-i',f'audio/{k}.mp3','-f','f32le','-ac','1','-ar',str(SR),'-'])
    v=np.frombuffer(out,dtype='<f4').astype(np.float64); add(voice,v,st+T['LEAD'],0,1.0)
# ducking de la musique sous la voix
vm=np.abs(voice[0]); k=int(.15*SR); env_v=np.convolve(vm,np.ones(k)/k,'same'); duck=1-.45*np.clip(env_v/ (np.max(env_v)*.4),0,1)
music=[m*duck for m in music]
# mixage
L=music[0]*.9+fx[0]*1.0+voice[0]*1.15; R=music[1]*.9+fx[1]*1.0+voice[1]*1.15
fade=np.ones(n); a=int(.5*SR); fade[:a]=np.linspace(0,1,a); e=int(.9*SR); end=int(DUR*SR); fade[end-e:end]=np.linspace(1,0,e); fade[end:]=0
m=np.max(np.abs(np.stack([L,R]))); L=L/m*fade; R=R/m*fade
st=(np.stack([L[:end],R[:end]],1)*0.89*32767).astype('<i2')
with wave.open('audio/mix.wav','wb') as w: w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes(st.tobytes())
print('mix ok',DUR,len(SFX),'sfx')
