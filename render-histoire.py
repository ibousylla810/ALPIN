import sys, os, math, subprocess, wave, json
SP = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SP)
import numpy as np
from PIL import Image
import render as R
from render import (tx, line_words, blit, anim, putxy, disc, barcode, qr, marks, eoc, eob,
                    W, H, FPS, LIGHT, BLACK, RED, FB, FL, FM, PAD, NOISE)

FD = R.FD
FBI, FLI, FMD = FD + 'InterDisplay-BoldItalic.otf', FD + 'InterDisplay-LightItalic.otf', FD + 'InterDisplay-Medium.otf'

# Début de chaque scène (secondes). À recaler sur la voix réelle via un fichier JSON optionnel.
SCENE_T = [0, 4.5, 9.5, 17, 24, 30.5, 36, 41.5, 44]
if os.path.exists(f'{SP}/timing.json'):
    SCENE_T = json.load(open(f'{SP}/timing.json'))
DUR = float(SCENE_T[-1])
TR = [SCENE_T[2] + 0.72 * (SCENE_T[3] - SCENE_T[2]),
      SCENE_T[3] + 0.70 * (SCENE_T[4] - SCENE_T[3]),
      SCENE_T[4] + 0.60 * (SCENE_T[5] - SCENE_T[4])]
TRD = 1.2

# ---------------- affiche ----------------
PAPER = (248, 245, 240)
TX = ['FESTIVAL', 'Musique · Danse · Expo', 'Samedi · 14 h', 'Entrée libre', 'Rejoignez-nous !']


def T(x, y, size, rot, alpha, color, font): return dict(x=x, y=y, size=size, rot=rot, alpha=alpha, color=color, font=font)
def Bk(x, y, w, h, alpha, color): return dict(x=x, y=y, w=w, h=h, alpha=alpha, color=color)


BLUE, GREEN, ORANGE, PURPLE, TEAL, GREY = (40, 70, 160), (30, 120, 70), (220, 130, 20), (110, 50, 140), (20, 130, 140), (165, 165, 165)
INK = (20, 20, 20)
TS = [
    [T(320, 150, 84, -4, 1, BLUE, FBI), T(300, 235, 52, 3, 1, GREY, FLI), T(335, 330, 56, -2, 1, ORANGE, FMD),
     T(285, 440, 52, 5, 1, PURPLE, FBI), T(335, 560, 54, -3, 1, TEAL, FB)],
    [T(320, 250, 104, 0, 1, BLUE, FB), T(320, 410, 40, 0, 1, GREY, FMD), T(320, 470, 36, 0, 1, ORANGE, FMD),
     T(320, 560, 36, 0, 0, PURPLE, FMD), T(320, 620, 36, 0, 0, TEAL, FMD)],
    [T(320, 250, 104, 0, 1, (255, 255, 255), FB), T(320, 410, 40, 0, 1, INK, FMD), T(320, 470, 36, 0, 1, INK, FMD),
     T(320, 560, 36, 0, 0, INK, FMD), T(320, 620, 36, 0, 0, INK, FMD)],
    [T(320, 300, 96, 0, 1, (255, 255, 255), FB), T(320, 570, 34, 0, 1, INK, FMD), T(320, 630, 30, 0, 1, INK, FMD),
     T(320, 560, 36, 0, 0, INK, FMD), T(320, 620, 36, 0, 0, INK, FMD)],
]
YEL, SKY, PINK, MINT, SAND = (245, 205, 90), (150, 200, 235), (235, 150, 170), (170, 225, 170), (230, 180, 120)
BS = [
    [Bk(320, 235, 600, 110, 1, YEL), Bk(170, 330, 300, 170, 1, SKY), Bk(480, 430, 240, 240, 1, PINK),
     Bk(300, 640, 520, 120, 1, MINT), Bk(540, 120, 130, 130, 1, SAND)],
    [Bk(320, 250, 600, 170, 1, YEL), Bk(170, 330, 300, 170, 1, SKY), Bk(480, 430, 240, 240, 1, PINK),
     Bk(300, 640, 520, 120, 1, MINT), Bk(540, 120, 130, 130, 1, SAND)],
    [Bk(320, 250, 600, 230, 1, RED), Bk(170, 330, 300, 170, 0, SKY), Bk(480, 430, 240, 240, 0, PINK),
     Bk(300, 640, 520, 120, 0, MINT), Bk(540, 120, 130, 130, 0, SAND)],
    [Bk(320, 300, 520, 210, 1, RED), Bk(170, 330, 300, 170, 0, SKY), Bk(480, 430, 240, 240, 0, PINK),
     Bk(300, 640, 520, 120, 0, MINT), Bk(540, 120, 130, 130, 0, SAND)],
]


def lerp(a, b, e): return a + (b - a) * e
def lerpc(a, b, e): return tuple(lerp(x, y, e) for x, y in zip(a, b))


def interp(a, b, e):
    out = {}
    for k in a:
        if k == 'font':
            out[k] = a[k] if e < 0.5 else b[k]
        elif k == 'color':
            out[k] = lerpc(a[k], b[k], e)
        else:
            out[k] = lerp(a[k], b[k], e)
    return out


TM = {}
for i, s in enumerate(TX):
    for fnt in (FBI, FLI, FMD, FB):
        TM[(i, fnt)] = tx(s, 200, fnt, -0.03)


def blitP(P, arr, x, y, color, alpha):
    x, y = int(round(x)), int(round(y))
    h, w = arr.shape
    ph, pw = P.shape[:2]
    x0, y0, x1, y1 = max(x, 0), max(y, 0), min(x + w, pw), min(y + h, ph)
    if x0 >= x1 or y0 >= y1:
        return
    a = (arr[y0 - y:y1 - y, x0 - x:x1 - x] * alpha)[..., None]
    P[y0:y1, x0:x1] = P[y0:y1, x0:x1] * (1 - a) + np.array(color, np.float32) * a


def draw_text(P, i, d):
    if d['alpha'] <= 0.01:
        return
    arr, base = TM[(i, d['font'])]
    k = d['size'] / 200
    img = Image.fromarray((arr * 255).astype(np.uint8))
    img = img.resize((max(1, int(img.size[0] * k)), max(1, int(img.size[1] * k))), Image.BICUBIC)
    pw, ph = img.size[0] / 2, (base - 72) * k
    Rr = int(max(img.size) * 0.75) + 4
    cvs = Image.new('L', (2 * Rr, 2 * Rr), 0)
    cvs.paste(img, (int(Rr - pw), int(Rr - ph)))
    if abs(d['rot']) > 0.01:
        cvs = cvs.rotate(d['rot'], resample=Image.BICUBIC, center=(Rr, Rr))
    blitP(P, np.asarray(cvs, np.float32) / 255, d['x'] - Rr, d['y'] - Rr, d['color'], d['alpha'])


_PC = {}


def poster(stage):
    key = round(stage, 3)
    if key in _PC:
        return _PC[key]
    s = int(min(stage, 2.9999))
    f = stage - s if stage < 3 else 1.0
    P = np.empty((800, 640, 3), np.float32)
    P[:] = PAPER
    for a, b in zip(BS[s], BS[s + 1]):
        d = interp(a, b, f)
        if d['alpha'] > 0.01:
            blitP(P, np.ones((int(d['h']), int(d['w'])), np.float32), d['x'] - d['w'] / 2, d['y'] - d['h'] / 2, d['color'], d['alpha'])
    for i, (a, b) in enumerate(zip(TS[s], TS[s + 1])):
        draw_text(P, i, interp(a, b, f))
    out = np.clip(P, 0, 255).astype(np.uint8)
    if len(_PC) > 80:
        _PC.clear()
    _PC[key] = out
    return out


def stage_at(t):
    return sum(eoc(min(1.0, max(0.0, (t - tr) / TRD))) for tr in TR)


def paste(cv, img, x, y):
    h, w = img.shape[:2]
    x0, y0, x1, y1 = max(x, 0), max(y, 0), min(x + w, W), min(y + h, H)
    if x0 < x1 and y0 < y1:
        cv[y0:y1, x0:x1] = img[y0 - y:y1 - y, x0 - x:x1 - x]


def place_poster(cv, P, x, y, sc, t, t0, shake=(0, 0)):
    p = (t - t0) / 0.35
    if p <= 0:
        return
    s = sc * (0.75 + 0.25 * eob(min(p, 1.0)))
    w, h = int(640 * s), int(800 * s)
    img = np.asarray(Image.fromarray(P).resize((w, h), Image.BICUBIC))
    px = int(x + 640 * sc / 2 - w / 2 + shake[0])
    py = int(y + 800 * sc / 2 - h / 2 + shake[1])
    blit(cv, np.ones((h, w), np.float32), px + 16, py + 20, (0, 0, 0), 0.25)
    paste(cv, img, px, py)


# ---------------- légendes ----------------
def cap(kind, words, fr, y, end=None): return dict(kind=kind, words=words, fr=fr, y=y, end=end)


SPEC = [
    [cap('s', ['Cette', 'affiche', 'est', 'belle.'], [.04, .10, .16, .22], 1090),
     cap('b', ['Personne', 'ne'], [.42, .55], 1250), cap('b', ['la', 'regarde.'], [.66, .78], 1410)],
    [cap('s', ['Le', 'designer', 'a', 'tout', 'mis :'], [.02, .08, .15, .20, .27], 1090),
     cap('b', ['3', 'polices,'], [.38, .50], 1250), cap('b', ['6', 'couleurs.'], [.62, .74], 1410)],
    [cap('s', ['Erreur', '1'], [.02, .10], 1090),
     cap('b', ['Tout', 'crier'], [.20, .27], 1250, .70), cap('b', ['en', 'même', 'temps.'], [.30, .36, .42], 1410, .70),
     cap('b', ['Un', 'seul'], [.74, .80], 1250), cap('b', ['message.'], [.84], 1410)],
    [cap('s', ['Erreur', '2'], [.02, .10], 1090),
     cap('b', ['Pas', 'de'], [.17, .22], 1250, .68), cap('b', ['contraste.'], [.27], 1410, .68),
     cap('b', ['Une', 'seule'], [.72, .78], 1250), cap('b', ['couleur', 'forte.'], [.84, .92], 1410)],
    [cap('s', ['Erreur', '3'], [.02, .10], 1090),
     cap('b', ['Pas', "d'espace."], [.20, .28], 1250, .60),
     cap('b', ['Laisse', 'respirer'], [.66, .72], 1250), cap('b', ["l'œil."], [.84], 1410)],
    [cap('s', ['Même', 'contenu.'], [.0, .08], 920, .76),
     cap('b', ['Un', 'message,'], [.28, .34], 1070, .76), cap('b', ['un', 'accent,'], [.42, .48], 1210, .76),
     cap('b', ['de', "l'air."], [.56, .62], 1350, .76), cap('b', ['On', 'la', 'regarde.'], [.80, .85, .90], 1210)],
    [cap('s', ['Faire', 'du', 'design,'], [.0, .07, .14], 1090, .70),
     cap('b', ["c'est", 'choisir'], [.28, .34], 1250, .70), cap('b', ['ce', "qu'on", 'enlève.'], [.42, .48, .55], 1410, .70),
     cap('b', ['Brahim', 'Design', '221.'], [.72, .80, .88], 1330)],
]
for sc in SPEC:
    sz = min([line_words(c['words'], 170, FB, 940)[1] for c in sc if c['kind'] == 'b'])
    for c in sc:
        c['items'] = line_words(c['words'], sz, FB, 940)[0] if c['kind'] == 'b' else line_words(c['words'], 74, FL, 700, -0.02)[0]


def draw_caps(cv, t, k):
    ss, dur = SCENE_T[k], SCENE_T[k + 1] - SCENE_T[k]
    for c in SPEC[k]:
        if c['end'] is not None and t >= ss + c['end'] * dur:
            continue
        for (arr, base, x), fr in zip(c['items'], c['fr']):
            putxy(cv, arr, x - PAD, c['y'] - base, t, ss + fr * dur - 2 / FPS)


# ---------------- décor ----------------
def build_details(i, full=True):
    mk = marks()
    items = [(mk, 70, 285), (mk[:, ::-1], 894, 285), (mk[::-1, :], 70, 1494), (mk[::-1, ::-1], 894, 1494)]
    labs = [('9:16 · 30 FPS', 136, 1520), ('BRAHIM DESIGN 221', 700, 1520), ('→', 870, 1506)]
    if full:
        items += [(barcode(120, 46, 30 + i), 136, 345)]
        if i not in (2, 3, 4):
            items.append((qr(40 + i), 800, 300))
        labs.append((f'ÉTAPE 0{i+1}/07', 136, 318))
    for txt, x, y in labs:
        arr, base = tx(txt, 15, FM, 0.06)
        items.append((arr, x - PAD, y - base))
    return items


DETAILS = [build_details(i, i not in (5,)) for i in range(7)]
GH = {0: ('?', 1500, 330, 1700), 1: ('6', 1700, 330, 1700), 2: ('1', 1700, 330, 1700), 3: ('2', 1700, 330, 1700),
      4: ('3', 1700, 330, 1700), 6: ('MOINS', 400, -100, 1400)}
GHOST = {k: (tx(v[0], v[1], FB, -0.04), v[2], v[3]) for k, v in GH.items()}
CIRCLE780, CIRCLE700, DOT = disc(780), disc(700), disc(26)
FRAME = np.zeros((688, 560), np.float32)
FRAME[:6], FRAME[-6:], FRAME[:, :6], FRAME[:, -6:] = 1, 1, 1, 1
BRAND = tx('BRAHIM DESIGN 221', 62, FL, 0.14)
TAGS = {2: 'ERREUR 1', 3: 'ERREUR 2', 4: 'ERREUR 3'}
TAGM = {k: tx(v, 30, FB, 0.06) for k, v in TAGS.items()}
TAGM['avant'] = tx('AVANT', 30, FB, 0.06)
TAGM['apres'] = tx('APRÈS', 30, FB, 0.06)


def tag(cv, key, x, y, t, t0, col):
    putxy(cv, np.ones((58, 250), np.float32), x, y, t, t0, col, dur=0.25, slide=0)
    arr, base = TAGM[key]
    vis = arr.shape[1] - 2 * PAD
    putxy(cv, arr, x + (250 - vis) / 2 - PAD, y + 29 + 11 - base, t, t0, (255, 255, 255), dur=0.25, slide=0)


def scene_of(t):
    for k in range(8):
        if SCENE_T[k] <= t < SCENE_T[k + 1]:
            return k
    return 7


def frame(f):
    t = f / FPS
    k = scene_of(t)
    ss, se = SCENE_T[k], SCENE_T[k + 1]
    prog = (t - ss) / (se - ss)
    light = k in (0, 2, 4, 6)
    cv = np.empty((H, W, 3), np.uint8)
    cv[:] = LIGHT if light else BLACK
    gcol = (120, 115, 118) if light else (210, 210, 210)
    if k in GHOST:
        (garr, gbase), gx, gy = GHOST[k]
        putxy(cv, garr, gx, gy - gbase, t, ss, gcol, dur=0.5, slide=0, alpha=0.30)
    if k < 7 and t > ss + 0.12:
        for arr, x, y in DETAILS[k]:
            blit(cv, arr, x, y, None, 0.9)
    sc = 0.8 * (1 + 0.05 * prog)
    if k == 0:
        putxy(cv, CIRCLE780, 150, 260, t, ss, RED, dur=0.4, slide=0)
        place_poster(cv, poster(0), 284, 330, sc, t, ss + 0.15)
    elif k == 1:
        putxy(cv, np.ones((640, 512), np.float32), 344, 390, t, ss, RED, dur=0.35, slide=0)
        sh = (3 * math.sin(t * 40), 2 * math.cos(t * 33))
        place_poster(cv, poster(0), 284, 330, sc, t, ss + 0.1, sh)
    elif k in (2, 3, 4):
        putxy(cv, FRAME, 260, 306, t, ss, RED, dur=0.3, slide=0)
        place_poster(cv, poster(stage_at(t)), 284, 330, sc, t, ss)
        tag(cv, k, 284, 270, t, ss + 0.1, RED)
    elif k == 5:
        sc6 = 0.58
        place_poster(cv, poster(0), 135, 330, sc6, t, ss + 0.05)
        place_poster(cv, poster(3), 540, 330, sc6, t, ss + 0.25)
        putxy(cv, FRAME[:520, :430], 515, 305, t, ss + 0.3, RED, dur=0.3, slide=0) if False else None
        tag(cv, 'avant', 135, 262, t, ss + 0.1, (90, 90, 90))
        tag(cv, 'apres', 540, 262, t, ss + 0.3, RED)
    elif k == 6:
        putxy(cv, CIRCLE700, 190, 300, t, ss, RED, dur=0.4, slide=0)
        place_poster(cv, poster(3), 361, 426, 0.56, t, ss + 0.15)
    else:
        r = anim(DOT, t, ss + 0.1, 0.3, 0)
        if r:
            im, dx, dy, a = r
            blit(cv, im, 540 - 13 + dx, 880 + dy, RED, a)
        putxy(cv, BRAND[0], (W - BRAND[0].shape[1]) / 2, 960 - BRAND[1], t, ss + 0.25, (245, 245, 245), dur=0.6, slide=20)
        lw = int(300 * eoc(min(1.0, max(0.0, (t - ss - 0.5) / 0.5))))
        if lw > 0:
            blit(cv, np.ones((3, lw), np.float32), 540 - lw / 2, 1010, RED)
    if k < 7:
        draw_caps(cv, t, k)
    amp = 5.0 if light else 3.0
    if k == 7:
        amp = 2.0
    return np.clip(cv.astype(np.float32) + NOISE[f % 6] * amp, 0, 255).astype(np.uint8)


def make_audio(path):
    sr = 44100
    n = int(sr * DUR)
    a = np.zeros(n, np.float64)
    rng = np.random.default_rng(1)

    def add(sig, t0, g=1.0):
        i = int(t0 * sr)
        j = min(n, i + len(sig))
        if 0 <= i < n:
            a[i:j] += sig[:j - i] * g

    tt = np.arange(int(0.3 * sr)) / sr
    kick = np.sin(2 * np.pi * (48 * tt + 120 * (1 - np.exp(-30 * tt)) / 30)) * np.exp(-9 * tt)
    th = np.arange(int(0.08 * sr)) / sr
    hat = np.diff(rng.normal(0, 1, len(th) + 1)) * np.exp(-60 * th)
    k = 0
    while k * 0.5 < SCENE_T[7] - 0.2:
        add(kick, k * 0.5, 0.45)
        add(hat, k * 0.5 + 0.25, 0.12)
        k += 1
    th2 = np.arange(int(0.6 * sr)) / sr
    boom = np.sin(2 * np.pi * 60 * th2) * np.exp(-5 * th2)
    tw = np.arange(int(0.4 * sr)) / sr
    for c in SCENE_T[1:8]:
        add(boom, c, 0.6)
        add(np.diff(rng.normal(0, 1, len(tw) + 1)) * (tw / 0.4) ** 2, c - 0.4, 0.10)
    for c in TR:
        add(np.diff(rng.normal(0, 1, len(tw) + 1)) * (tw / 0.4) ** 2, c - 0.2, 0.12)
        add(boom, c + 0.2, 0.4)
    ts = np.arange(n) / sr
    a += sum(np.sin(2 * np.pi * f * ts) for f in (110, 164.8, 220)) * 0.05 * np.minimum(1, ts / 1.5)
    a *= np.minimum(1, (DUR - ts) / 0.8)
    a = a / np.abs(a).max() * 0.6
    pcm = (a * 32767).astype('<i2')
    with wave.open(path, 'wb') as wf:
        wf.setnchannels(2); wf.setsampwidth(2); wf.setframerate(sr)
        wf.writeframes(np.repeat(pcm[:, None], 2, axis=1).tobytes())


if __name__ == '__main__':
    mode = sys.argv[1]
    if mode == 'keys':
        times = [1.8, 7.5, 16.5, 22.8, 29.0, 34.5, 39.5, 43.0]
        tiles = []
        for tm in times:
            im = Image.fromarray(frame(int(tm * FPS)))
            im.save(f'{SP}/k2_{tm}.png')
            tiles.append(im.resize((360, 640), Image.LANCZOS))
        sheet = Image.new('RGB', (1440, 1280))
        for i, im in enumerate(tiles):
            sheet.paste(im, ((i % 4) * 360, (i // 4) * 640))
        sheet.save(f'{SP}/sheet2.png')
    else:
        out = sys.argv[2]
        wav = f'{SP}/music2.wav'
        make_audio(wav)
        tmp = out.replace('.mp4', '.tmp.mp4')
        cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS),
               '-i', '-', '-i', wav, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-crf', '23', '-preset', 'veryfast',
               '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-t', str(DUR), '-movflags', '+faststart', tmp]
        pr = subprocess.Popen(cmd, stdin=subprocess.PIPE)
        for f in range(int(DUR * FPS)):
            pr.stdin.write(frame(f).tobytes())
        pr.stdin.close()
        if pr.wait() == 0:
            os.replace(tmp, out)
            print('OK', out)
        else:
            print('FFmpeg a échoué')
            sys.exit(1)
