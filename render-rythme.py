import numpy as np, sys, math, subprocess, os, wave
from PIL import Image, ImageDraw, ImageFont

W, H, FPS, DUR = 1080, 1920, 30, 15.0
SP = os.path.dirname(os.path.abspath(__file__))
FD = '/usr/share/fonts/opentype/inter/'
FB, FL, FM = FD + 'InterDisplay-Bold.otf', FD + 'InterDisplay-Light.otf', FD + 'Inter-Medium.otf'
LIGHT, BLACK, RED = (229, 223, 226), (0, 0, 0), (208, 15, 18)
CUTS = [0.0, 2.2, 5.0, 8.1, 12.4, 15.0]
PAD = 40


def eoc(x): return 1 - (1 - x) ** 3
def eob(x): return 1 + 2.7 * (x - 1) ** 3 + 1.7 * (x - 1) ** 2


def advs(text, size, fp, track):
    f = ImageFont.truetype(fp, int(size))
    return f, [f.getlength(c) + track * size for c in text]


def tx(text, size, fp, track=-0.04):
    size = int(size)
    f, adv = advs(text, size, fp, track)
    w = int(sum(adv)) + 2 * PAD
    h, base = int(size * 1.5), int(size * 1.1)
    im = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(im)
    x = PAD
    for c, a in zip(text, adv):
        d.text((x, base), c, font=f, fill=255, anchor='ls')
        x += a
    return np.asarray(im, np.float32) / 255, base


def line_words(words, size, fp, maxw, track=-0.04):
    """Retourne (liste (arr, base, x_gauche_visible), taille) centrée, largeur visible <= maxw."""
    while True:
        sp = size * 0.28
        ms = [tx(w, size, fp, track) for w in words]
        ws = [m[0].shape[1] - 2 * PAD for m in ms]
        total = sum(ws) + sp * (len(words) - 1)
        if total <= maxw:
            break
        size -= 4
    x = (W - total) / 2
    out = []
    for (arr, base), w in zip(ms, ws):
        out.append((arr, base, x))
        x += w + sp
    return out, size


def blit(cv, arr, x, y, color=None, alpha=1.0):
    x, y = int(round(x)), int(round(y))
    h, w = arr.shape
    x0, y0, x1, y1 = max(x, 0), max(y, 0), min(x + w, W), min(y + h, H)
    if x0 >= x1 or y0 >= y1:
        return
    a = arr[y0 - y:y1 - y, x0 - x:x1 - x] * alpha
    reg = cv[y0:y1, x0:x1].astype(np.float32)
    if color is None:
        lum = reg.mean(axis=2, keepdims=True)
        col = np.where(lum < 110, 245.0, 14.0)
    else:
        col = np.array(color, np.float32)
    cv[y0:y1, x0:x1] = (reg * (1 - a[..., None]) + col * a[..., None]).astype(np.uint8)


def hblur(a, r):
    r = int(r)
    if r <= 0:
        return a
    acc = np.zeros_like(a)
    ks = list(range(-r, r + 1, 2))
    for s in ks:
        acc += np.roll(a, s, axis=1)
    return acc / len(ks)


def anim(arr, t, t0, dur=0.3, slide=60):
    p = (t - t0) / dur
    if p <= 0:
        return None
    pc = min(p, 1.0)
    n = (t - t0) * FPS
    if pc >= 1 and n >= 6:
        return arr, 0, 0, 1.0
    s = 0.7 + 0.3 * eob(pc)
    a = min(1.0, pc * 3)
    im = hblur(arr, 18 * (1 - n / 6)) if n < 6 else arr
    if abs(s - 1) > 1e-3:
        h, w = im.shape
        img = Image.fromarray((np.clip(im, 0, 1) * 255).astype(np.uint8)).resize(
            (max(1, int(w * s)), max(1, int(h * s))), Image.BICUBIC)
        im = np.asarray(img, np.float32) / 255
    dx = (arr.shape[1] - im.shape[1]) / 2
    dy = (arr.shape[0] - im.shape[0]) / 2 + (1 - eoc(pc)) * slide
    return im, dx, dy, a


def putxy(cv, arr, x, y, t, t0, color=None, dur=0.3, slide=60, alpha=1.0):
    r = anim(arr, t, t0, dur, slide)
    if r is None:
        return
    im, dx, dy, a = r
    blit(cv, im, x + dx, y + dy, color, a * alpha)


def draw_line(cv, items, by, t, t0s, color=None):
    for (arr, base, x), t0 in zip(items, t0s):
        putxy(cv, arr, x - PAD, by - base, t, t0, color)


def disc(d):
    im = Image.new('L', (d * 2, d * 2), 0)
    ImageDraw.Draw(im).ellipse((0, 0, d * 2 - 1, d * 2 - 1), fill=255)
    return np.asarray(im.resize((d, d), Image.LANCZOS), np.float32) / 255


def rect_mask(w, h):
    return np.ones((h, w), np.float32)


def bust(w, h, lean=0.0, flip=False):
    S = 2
    im = Image.new('L', (w * S, h * S), 0)
    d = ImageDraw.Draw(im)
    hx, hy, r = w * (0.5 + lean), h * 0.36, w * 0.17
    d.ellipse(((hx - r) * S, (hy - r * 1.12) * S, (hx + r) * S, (hy + r * 1.12) * S), fill=255)
    d.rectangle(((hx - r * 0.45) * S, hy * S, (hx + r * 0.45) * S, h * 0.56 * S), fill=255)
    d.ellipse((w * 0.06 * S, h * 0.52 * S, w * 0.94 * S, h * 1.25 * S), fill=255)
    im = im.resize((w, h), Image.LANCZOS)
    if flip:
        im = im.transpose(Image.FLIP_LEFT_RIGHT)
    return np.asarray(im, np.float32) / 255


def zoom(arr, s):
    h, w = arr.shape
    img = Image.fromarray((arr * 255).astype(np.uint8)).resize((int(w * s), int(h * s)), Image.BICUBIC)
    a = np.asarray(img, np.float32) / 255
    y0, x0 = (a.shape[0] - h) // 2, (a.shape[1] - w) // 2
    return a[y0:y0 + h, x0:x0 + w]


def icon_image(n=640):
    S = 2
    im = Image.new('L', (n * S, n * S), 0)
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, n * S - 1, n * S - 1), outline=255, width=18 * S)
    d.ellipse((130 * S, 120 * S, 230 * S, 220 * S), fill=255)
    d.polygon([(40 * S, 590 * S), (260 * S, 300 * S), (420 * S, 590 * S)], fill=255)
    d.polygon([(280 * S, 590 * S), (460 * S, 360 * S), (600 * S, 590 * S)], fill=255)
    im = im.resize((n, n), Image.LANCZOS)
    return np.asarray(im, np.float32) / 255


def metronome_body():
    S = 2
    w, h = 520, 860
    im = Image.new('L', (w * S, h * S), 0)
    d = ImageDraw.Draw(im)
    d.polygon([(170 * S, 0), (350 * S, 0), (520 * S, 860 * S), (0, 860 * S)], fill=255)
    d.rectangle((246 * S, 90 * S, 274 * S, 640 * S), fill=0)
    im = im.resize((w, h), Image.LANCZOS)
    return np.asarray(im, np.float32) / 255


def metronome_rod(angle):
    S = 2
    w, h = 800, 900
    im = Image.new('L', (w * S, h * S), 0)
    d = ImageDraw.Draw(im)
    px, py, L = 400, 760, 640
    tip = (px + L * math.sin(angle), py - L * math.cos(angle))
    d.line([(px * S, py * S), (tip[0] * S, tip[1] * S)], fill=255, width=14 * S)
    ux, uy = math.sin(angle), -math.cos(angle)
    cx, cy = px + ux * L * 0.62, py + uy * L * 0.62
    nx, ny = -uy, ux
    pts = [(cx + ux * 30 + nx * 46, cy + uy * 30 + ny * 46), (cx + ux * 30 - nx * 46, cy + uy * 30 - ny * 46),
           (cx - ux * 30 - nx * 46, cy - uy * 30 - ny * 46), (cx - ux * 30 + nx * 46, cy - uy * 30 + ny * 46)]
    d.polygon([(a * S, b * S) for a, b in pts], fill=255)
    d.ellipse(((px - 22) * S, (py - 22) * S, (px + 22) * S, (py + 22) * S), fill=255)
    im = im.resize((w, h), Image.LANCZOS)
    return np.asarray(im, np.float32) / 255


def ring_mask(t, rv, D=860, R=400, N=90):
    S = 2
    im = Image.new('L', (D * S, D * S), 0)
    d = ImageDraw.Draw(im)
    for i in range(int(N * rv)):
        a = 2 * math.pi * i / N + 0.35 * t
        x, y = D / 2 + R * math.cos(a), D / 2 + R * math.sin(a)
        d.ellipse(((x - 7) * S, (y - 7) * S, (x + 7) * S, (y + 7) * S), fill=255)
    im = im.resize((D, D), Image.LANCZOS)
    return np.asarray(im, np.float32) / 255


def barcode(w, h, seed):
    rng = np.random.default_rng(seed)
    im = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(im)
    x = 0
    while x < w:
        bw = int(rng.choice([2, 2, 3, 4, 6]))
        d.rectangle((x, 0, min(x + bw - 1, w - 1), h - 1), fill=255)
        x += bw + int(rng.choice([2, 3, 4]))
    return np.asarray(im, np.float32) / 255


def qr(seed, n=11, c=6):
    rng = np.random.default_rng(seed)
    g = rng.integers(0, 2, (n, n))
    for ox, oy in [(0, 0), (n - 3, 0), (0, n - 3)]:
        g[oy:oy + 3, ox:ox + 3] = 1
        g[oy + 1, ox + 1] = 0
    im = np.kron(g, np.ones((c, c))).astype(np.float32)
    return im


def marks():
    m = np.zeros((46, 46), np.float32)
    m[:3, :] = 1
    m[:, :3] = 1
    return m


def build_details(i):
    items = []
    mk = marks()
    items += [(mk, 70, 285), (mk[:, ::-1], 894, 285), (mk[::-1, :], 70, 1494), (mk[::-1, ::-1], 894, 1494)]
    items.append((barcode(170, 46, 10 + i), 136, {0: 1440, 1: 1440, 2: 1400, 3: 345}[i]))
    items.append((qr(20 + i), 800, 300))
    for txt, x, y in [(f'RYTHME — 0{i+1}/04', 136, 318), ('9:16 · 30 FPS', 136, 1394 if i % 2 == 0 else 1480),
                      ('BRAHIM DESIGN 221', 700, 1520), ('→', 870, 1478)]:
        arr, base = tx(txt, 15, FM, 0.06)
        items.append((arr, x - PAD, y - base))
    return items


# ---------- assets ----------
CIRCLE = disc(800)
BUST1 = bust(800, 800, 0.0)
BUST3 = bust(760, 960, 0.0, flip=True)
ICON = icon_image(640)
BODY = metronome_body()
RECT3 = rect_mask(760, 960)
RECT2 = rect_mask(640, 640)
DETAILS = [build_details(i) for i in range(4)]
GHOST = {
    0: tx('3', 1700, FB, -0.04),
    1: tx('MOT', 620, FB, -0.05),
    2: tx('0', 1700, FB, -0.04),
    3: tx('RYTHME', 430, FB, -0.05),
}
SM = lambda txt: tx(txt, 74, FL, -0.02)
NOISE = [np.random.default_rng(i).normal(0, 1, (H, W, 1)).astype(np.float32) for i in range(6)]
BIG_FONT = FB
BIG_MAX = 940
L1 = line_words(['pour'], 170, FB, BIG_MAX)
L1b = line_words(['accrocher.'], 170, FB, BIG_MAX)
L2 = line_words(['par', 'image.'], 170, FB, BIG_MAX)
L3 = line_words(['remplissage.'], 170, FB, BIG_MAX)
L4 = line_words(['le', 'rythme.'], 170, FB, BIG_MAX)
SM1 = line_words(['3', 'secondes'], 74, FL, 700, -0.02)
SM2 = line_words(['1', 'mot'], 74, FL, 700, -0.02)
SM3 = line_words(['Zéro'], 74, FL, 700, -0.02)
SM4 = line_words(['Garde'], 74, FL, 700, -0.02)
BRAND = tx('BRAHIM DESIGN 221', 62, FL, 0.14)
DOT = disc(26)


def plan_of(t):
    for i in range(5):
        if CUTS[i] <= t < CUTS[i + 1]:
            return i
    return 4


def frame(f):
    t = f / FPS
    p = plan_of(t)
    ps, pe = CUTS[p], CUTS[p + 1]
    prog = (t - ps) / (pe - ps)
    light = p in (0, 2)
    cv = np.empty((H, W, 3), np.uint8)
    cv[:] = LIGHT if light else BLACK

    if p < 4:
        gcol = (120, 115, 118) if light else (210, 210, 210)
        garr, gbase = GHOST[p]
        gx = {0: 330, 1: -60, 2: 380, 3: -300}[p]
        gy = {0: 1700, 1: 1060, 2: 1700, 3: 1080}[p]
        putxy(cv, garr, gx, gy - gbase, t, ps, gcol, dur=0.5, slide=0, alpha=0.30)

    if p == 0:
        putxy(cv, CIRCLE, 140, 400, t, ps, RED, dur=0.4, slide=0)
        sub = zoom(BUST1, 1 + 0.08 * prog) * CIRCLE
        putxy(cv, sub, 140, 400, t, ps + 0.15, (14, 14, 14), dur=0.4, slide=40)
        draw_line(cv, SM1[0], 1000, t, [ps + 0.10, ps + 0.30])
        draw_line(cv, L1[0], 1190, t, [ps + 0.55])
        draw_line(cv, L1b[0], 1370, t, [ps + 0.95])
    elif p == 1:
        putxy(cv, RECT2, 260, 600, t, ps, RED, dur=0.35, slide=0)
        putxy(cv, zoom(ICON, 1 + 0.08 * prog), 220, 540, t, ps + 0.1, (225, 225, 225), dur=0.4, slide=40)
        draw_line(cv, SM2[0], 1085, t, [ps + 0.15, ps + 0.30])
        draw_line(cv, L2[0], 1290, t, [ps + 0.65, ps + 0.95])
    elif p == 2:
        wp = eoc(min(1.0, (t - ps) / 0.45))
        wcols = max(1, int(760 * wp))
        blit(cv, RECT3[:, :wcols], 160, 420, RED)
        sub = zoom(BUST3, 1 + 0.08 * prog)[:, :wcols]
        if t > ps + 0.25:
            putxy(cv, zoom(BUST3, 1 + 0.08 * prog), 160, 420, t, ps + 0.25, (14, 14, 14), dur=0.4, slide=40)
        draw_line(cv, SM3[0], 1110, t, [ps + 0.15])
        draw_line(cv, L3[0], 1300, t, [ps + 0.60])
    elif p == 3:
        rv = eoc(min(1.0, (t - ps) / 0.9))
        blit(cv, ring_mask(t, rv), 110, 470, RED)
        putxy(cv, BODY, 280, 470, t, ps + 0.05, (225, 225, 225), dur=0.4, slide=40)
        if t > ps + 0.3:
            rod = metronome_rod(0.42 * math.cos(2 * math.pi * t))
            blit(cv, rod, 140, 470, None, 1.0)
        draw_line(cv, SM4[0], 1250, t, [ps + 0.15])
        draw_line(cv, L4[0], 1410, t, [ps + 0.60, ps + 0.90])
    else:
        r = anim(DOT, t, ps + 0.1, 0.3, 0)
        if r:
            im, dx, dy, a = r
            blit(cv, im, 540 - 13 + dx, 880 + dy, RED, a)
        putxy(cv, BRAND[0], (W - BRAND[0].shape[1]) / 2, 960 - BRAND[1], t, ps + 0.25, (245, 245, 245), dur=0.6, slide=20)
        lw = int(300 * eoc(min(1.0, max(0.0, (t - ps - 0.5) / 0.5))))
        if lw > 0:
            blit(cv, np.ones((3, lw), np.float32), 540 - lw / 2, 1010, RED)

    if p < 4 and t > ps + 0.12:
        for arr, x, y in DETAILS[p]:
            blit(cv, arr, x, y, None, 0.9)

    amp = 5.0 if light else 3.0
    if p == 4:
        amp = 2.0
    out = np.clip(cv.astype(np.float32) + NOISE[f % 6] * amp, 0, 255).astype(np.uint8)
    return out


def make_audio(path):
    sr = 44100
    n = int(sr * DUR)
    a = np.zeros(n, np.float64)
    rng = np.random.default_rng(1)

    def add(sig, t0, g=1.0):
        i = int(t0 * sr)
        j = min(n, i + len(sig))
        if i < n:
            a[i:j] += sig[:j - i] * g

    tt = np.arange(int(0.3 * sr)) / sr
    kick = np.sin(2 * np.pi * (48 * tt + 120 * (1 - np.exp(-30 * tt)) / 30)) * np.exp(-9 * tt)
    th = np.arange(int(0.08 * sr)) / sr
    hat = np.diff(rng.normal(0, 1, len(th) + 1)) * np.exp(-60 * th)
    k = 0
    while k * 0.5 < 12.4:
        add(kick, k * 0.5, 0.9)
        add(hat, k * 0.5 + 0.25, 0.25)
        k += 1
    th2 = np.arange(int(0.6 * sr)) / sr
    boom = np.sin(2 * np.pi * 60 * th2) * np.exp(-5 * th2)
    for c in CUTS[1:5]:
        add(boom, c, 0.7)
        tw = np.arange(int(0.35 * sr)) / sr
        wh = np.diff(rng.normal(0, 1, len(tw) + 1)) * (tw / 0.35) ** 2
        add(wh, c - 0.35, 0.12)
    ts = np.arange(n) / sr
    pad = sum(np.sin(2 * np.pi * f * ts) for f in (110, 164.8, 220)) * 0.04
    pad *= np.minimum(1, ts / 1.5)
    a += pad
    a *= np.minimum(1, (DUR - ts) / 0.8)
    a = a / np.abs(a).max() * 0.8
    pcm = (a * 32767).astype('<i2')
    st = np.repeat(pcm[:, None], 2, axis=1)
    with wave.open(path, 'wb') as wf:
        wf.setnchannels(2); wf.setsampwidth(2); wf.setframerate(sr)
        wf.writeframes(st.tobytes())


if __name__ == '__main__':
    mode = sys.argv[1]
    if mode == 'keys':
        times = [0.4, 1.9, 3.9, 6.9, 10.5, 13.6]
        tiles = []
        for tm in times:
            im = Image.fromarray(frame(int(tm * FPS)))
            im.save(f'{SP}/key_{tm}.png')
            tiles.append(im.resize((360, 640), Image.LANCZOS))
        sheet = Image.new('RGB', (1080, 1280))
        for i, im in enumerate(tiles):
            sheet.paste(im, ((i % 3) * 360, (i // 3) * 640))
        sheet.save(f'{SP}/sheet.png')
    else:
        out = sys.argv[2]
        wav = f'{SP}/music.wav'
        make_audio(wav)
        tmp = out.replace('.mp4', '.tmp.mp4')
        cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS),
               '-i', '-', '-i', wav, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-crf', '18', '-preset', 'veryfast',
               '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-t', str(DUR), '-movflags', '+faststart', tmp]
        pr = subprocess.Popen(cmd, stdin=subprocess.PIPE)
        for f in range(int(DUR * FPS)):
            pr.stdin.write(frame(f).tobytes())
        pr.stdin.close()
        rc = pr.wait()
        if rc == 0:
            os.replace(tmp, out)
            print('OK', out)
        else:
            print('FFmpeg a échoué', rc)
            sys.exit(1)
