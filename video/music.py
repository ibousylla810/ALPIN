import numpy as np, wave
SR=44100; DUR=62.0; BPM=108; beat=60/BPM
n=int(SR*DUR); t=np.arange(n)/SR
L=np.zeros(n); R=np.zeros(n)
rng=np.random.default_rng(7)
def add(sig,start,pan=0.0,gain=1.0):
    i=int(start*SR); j=min(n,i+len(sig))
    if i>=n: return
    s=sig[:j-i]*gain
    L[i:j]+=s*(1-max(pan,0)); R[i:j]+=s*(1+min(pan,0))
def env(len_s,a=.01,r=.2):
    m=int(len_s*SR); e=np.ones(m); a_=int(a*SR); r_=int(r*SR)
    e[:a_]=np.linspace(0,1,a_); e[-r_:]*=np.linspace(1,0,r_); return e
def tone(f,len_s,harm=(1,.5,.25),a=.01,r=.3,detune=0.0):
    tt=np.arange(int(len_s*SR))/SR
    s=sum(h*np.sin(2*np.pi*f*(k+1)*(1+detune)*tt) for k,h in enumerate(harm))
    return s*env(len_s,a,r)
def kick():
    tt=np.arange(int(.35*SR))/SR; f=120*np.exp(-tt*22)+42
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*9)
def hat():
    tt=np.arange(int(.06*SR))/SR; x=rng.standard_normal(len(tt)); x=np.diff(x,prepend=0); return x*np.exp(-tt*90)
def clap():
    tt=np.arange(int(.22*SR))/SR; x=rng.standard_normal(len(tt)); x=np.convolve(x,np.ones(3)/3,'same'); return x*np.exp(-tt*22)
def nf(m): return 440*2**((m-69)/12)
chords=[(57,60,64),(53,57,60),(48,52,55),(55,59,62)]   # Am F C G
bars=int(DUR/(beat*4))+1
for b in range(bars):
    c=chords[b%4]; t0=b*beat*4
    # pad
    for m in c:
        for d in (-0.004,0.004):
            add(tone(nf(m),beat*4+.4,(1,.35,.15),a=.5,r=.8,detune=d),t0,pan=d*60,gain=.055)
    # basse
    root=c[0]-12
    for k in range(8):
        add(tone(nf(root),beat*.9,(1,.4),a=.005,r=.2),t0+k*beat/2,gain=.16 if k%2==0 else .09)
    # arpège
    for k in range(16):
        m=c[k%3]+12*(1 if k%6<3 else 2)
        add(tone(nf(m),beat*.5,(1,.3),a=.004,r=.25),t0+k*beat/4,pan=((k%4)-1.5)/4,gain=.05)
# batterie : intro douce -> groove complet à partir de 4,4 s (barre 3)
for k in range(int(DUR/beat)):
    tm=k*beat
    if tm>=beat*4*2-0.01:
        add(kick(),tm,gain=.55)
        if k%2==1: add(clap(),tm,gain=.12)
    if tm>=beat*4*1: add(hat(),tm+beat/2,gain=.09,pan=.3)
    if tm>=beat*4*2: add(hat(),tm,gain=.05,pan=-.3)
# riser avant chaque transition
for tt0 in (5,12.5,25,33.5,42.5,52.5):
    m=int(1.0*SR); x=rng.standard_normal(m); x=np.convolve(x,np.ones(8)/8,'same')*np.linspace(0,1,m)**2
    add(x,tt0-.95,gain=.10)
    k=int(.5*SR); tk=np.arange(k)/SR; add(np.sin(2*np.pi*(90*np.exp(-tk*6)+38)*tk)*np.exp(-tk*5),tt0,gain=.5)
# normalisation + fondus
m=np.max(np.abs(np.stack([L,R])))
L/=m; R/=m
fade=np.ones(n); fade[:int(SR*1.0)]=np.linspace(0,1,int(SR*1.0)); fade[-int(SR*2.5):]=np.linspace(1,0,int(SR*2.5))
st=(np.stack([L*fade,R*fade],1)*0.9*32767).astype('<i2')
with wave.open('audio/music.wav','wb') as w: w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes(st.tobytes())
print('ok')
