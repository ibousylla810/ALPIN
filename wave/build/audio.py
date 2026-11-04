# Musique énergique + effets sonores, synthétisés (libres de droits), calés sur l'animation.
import numpy as np, wave, json
SR = 44100; DUR = 30.0; BPM = 124; beat = 60 / BPM
n = int(SR * DUR)
rng = np.random.default_rng(3)

def write(path, L, R):
    m = max(np.max(np.abs(L)), np.max(np.abs(R)), 1e-9)
    st = (np.stack([L, R], 1) / m * 0.89 * 32767).astype('<i2')
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes())

def env(m, a, r):
    e = np.ones(m); a = max(1, int(a * SR)); r = max(1, int(r * SR))
    e[:a] = np.linspace(0, 1, a); e[-r:] *= np.linspace(1, 0, r); return e

def add(buf, sig, t, g=1.0, pan=0.0):
    L, R = buf; i = int(t * SR)
    if i >= n or i + len(sig) <= 0: return
    j = min(n, i + len(sig)); s = sig[:j - i] * g
    L[i:j] += s * (1 - max(pan, 0)); R[i:j] += s * (1 + min(pan, 0))

def lp(x, k):  # passe-bas simple (moyenne glissante)
    return np.convolve(x, np.ones(k) / k, 'same')

def nf(m): return 440 * 2 ** ((m - 69) / 12)
def saw(f, d):
    t = np.arange(int(d * SR)) / SR
    return sum(np.sin(2 * np.pi * f * k * t) / k for k in range(1, 8))
def kick():
    t = np.arange(int(.32 * SR)) / SR; f = 150 * np.exp(-t * 28) + 45
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 8) * 1.2
def clap():
    t = np.arange(int(.2 * SR)) / SR; x = rng.standard_normal(len(t))
    return lp(x, 2) * (np.exp(-t * 25) + .5 * np.exp(-np.maximum(t - .012, 0) * 30) * (t > .012))
def hat(o=False):
    d = .18 if o else .05; t = np.arange(int(d * SR)) / SR
    x = np.diff(rng.standard_normal(len(t) + 1)); return x * np.exp(-t * (18 if o else 90))

# ---------------- MUSIQUE ----------------
mus = [np.zeros(n), np.zeros(n)]
prog = [(54, 57, 61), (50, 54, 57), (57, 61, 64), (52, 56, 59)]   # F#m D A E
bars = int(DUR / (beat * 4)) + 1
for b in range(bars):
    t0 = b * beat * 4; c = prog[b % 4]
    brk = 24.6 <= t0 < 27.0          # pause pendant la mention
    for k in range(4):
        tb = t0 + k * beat
        if tb < .7: continue           # intro : riser seul
        if not brk: add(mus, kick(), tb, .9)
        if k % 2 == 1: add(mus, clap(), tb, .35)
        for h in range(4):
            add(mus, hat(h == 2), tb + h * beat / 4, .10 if h % 2 else .06, pan=.3 if h % 2 else -.3)
    # basse sur les contre-temps
    for k in range(8):
        tb = t0 + k * beat / 2 + beat / 4
        if tb < .7: continue
        s = saw(nf(c[0] - 24), beat * .45); s = lp(s, 30) * env(len(s), .005, .08)
        add(mus, s, tb, .22 if not brk else .1)
    # nappe + arpège
    for m in c:
        s = lp(saw(nf(m), beat * 4), 60) * env(int(beat * 4 * SR), .3, .4)
        add(mus, s, t0, .03, pan=-.2); add(mus, s, t0 + .01, .03, pan=.2)
    for k in range(16):
        tb = t0 + k * beat / 4
        if tb < .7: continue
        m = c[k % 3] + (12 if k % 8 < 4 else 24)
        s = lp(saw(nf(m), beat * .22), 6) * env(int(beat * .22 * SR), .002, .1)
        add(mus, s, tb, .045, pan=((k % 4) - 1.5) / 3)
fade = np.ones(n); fade[-int(SR * 1.2):] = np.linspace(1, 0, int(SR * 1.2))
mus = [x * fade for x in mus]
write('audio_music.wav', *mus)

# ---------------- EFFETS SONORES ----------------
fx = [np.zeros(n), np.zeros(n)]
def whoosh(d=.45):
    m = int(d * SR); x = rng.standard_normal(m); e = np.sin(np.linspace(0, np.pi, m)) ** 2
    k = np.linspace(40, 3, m).astype(int); y = np.array([x[max(0, i - kk):i + 1].mean() for i, kk in enumerate(k)])
    return y * e * 3
WH = whoosh()
def impact():
    t = np.arange(int(.7 * SR)) / SR; f = 90 * np.exp(-t * 9) + 32
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 4.5)
    nz = lp(rng.standard_normal(len(t)), 3) * np.exp(-t * 30)
    return sub * 1.3 + nz * .5
IM = impact()
def pop():
    t = np.arange(int(.12 * SR)) / SR; f = 1200 * np.exp(-t * 35) + 380
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 30)
def swish():
    m = int(.3 * SR); x = np.diff(rng.standard_normal(m + 1)); return x * np.sin(np.linspace(0, np.pi, m)) ** 3 * .8
def riser(d=.75):
    m = int(d * SR); t = np.arange(m) / SR; x = lp(rng.standard_normal(m), 4) * (t / d) ** 2
    tone = np.sin(2 * np.pi * np.cumsum(200 + 900 * (t / d) ** 2) / SR) * (t / d) ** 2 * .3
    return x + tone
def ding():
    t = np.arange(int(.6 * SR)) / SR
    return (np.sin(2 * np.pi * 1318 * t) + .6 * np.sin(2 * np.pi * 1975 * t)) * np.exp(-t * 6) * .6
def tick():
    t = np.arange(int(.02 * SR)) / SR; return np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 300)

for typ, t, ex in json.load(open('sfx.json')):
    if typ == 'whoosh': add(fx, WH, t - .05, .5, pan=.2)
    elif typ == 'trans': add(fx, WH, t - .12, .8); add(fx, IM, t + .3, .55)
    elif typ == 'impact': add(fx, IM, t, .8)
    elif typ == 'pop': add(fx, pop(), t, .45)
    elif typ == 'swish': add(fx, swish(), t, .5)
    elif typ == 'riser': add(fx, riser(), t, .7)
    elif typ == 'ding': add(fx, ding(), t, .5)
    elif typ == 'ticks':
        for k in range(14): add(fx, tick(), t + ex * (k / 14) ** .7, .35)
write('audio_sfx.wav', *fx)
print('ok')
