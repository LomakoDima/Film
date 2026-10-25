"""Procedural soundtrack for the film: music + SFX, synthesised from scratch.

Nothing sampled, nothing licensed: every sound is generated here with numpy.
Timing comes from src/timeline.json so audio and picture stay in lockstep.
120 BPM at 30 fps means one beat = 15 frames; every scene cut lands on a beat.

Usage: python3 audio/make_soundtrack.py  ->  public/soundtrack.wav
"""
import json
import pathlib
import wave

import numpy as np
from scipy.signal import butter, sosfilt

ROOT = pathlib.Path(__file__).resolve().parent.parent
T = json.loads((ROOT / "src" / "timeline.json").read_text())
SR = 44100
FPS = T["fps"]
DUR = T["total"] / FPS
N = int(DUR * SR)
BEAT = 60 / T["bpm"]
rng = np.random.default_rng(7)

music = np.zeros((N, 2))
sfx = np.zeros((N, 2))


def sec(frame):
    return frame / FPS


def scene(name, local):
    return T["scenes"][name][0] + local


def env(n, a=0.002, d=0.2, curve=4.0):
    t = np.arange(n) / SR
    att = np.clip(t / max(a, 1e-4), 0, 1)
    return att * np.exp(-curve * t / max(d, 1e-4))


def lp(x, hz, order=2):
    return sosfilt(butter(order, hz, "low", fs=SR, output="sos"), x)


def hp(x, hz, order=2):
    return sosfilt(butter(order, hz, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def add(buf, t, x, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N or i + len(x) <= 0:
        return
    j = min(N, i + len(x))
    seg = x[: j - i] * gain
    buf[i:j, 0] += seg * np.sqrt(0.5 * (1 - pan))
    buf[i:j, 1] += seg * np.sqrt(0.5 * (1 + pan))


def note(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


# ---------- instruments ----------
def kick():
    n = int(0.42 * SR)
    t = np.arange(n) / SR
    f = 44 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    click = np.exp(-t * 400) * 0.4
    return (np.sin(ph) + click) * np.exp(-t * 7.5)


def hat(open_=False):
    n = int((0.18 if open_ else 0.045) * SR)
    x = hp(rng.standard_normal(n), 7000)
    return x * env(n, 0.0005, 0.12 if open_ else 0.02, 3)


def bass(midi, length):
    n = int(length * SR)
    t = np.arange(n) / SR
    f = note(midi)
    x = sum(np.sin(2 * np.pi * f * k * t) / k for k in range(1, 6))
    x = lp(x, 420)
    return x * env(n, 0.004, length * 0.8, 3)


def pluck(midi, length=0.22):
    n = int(length * SR)
    t = np.arange(n) / SR
    f = note(midi)
    x = 2 * np.abs(2 * ((f * t) % 1) - 1) - 1  # triangle
    return lp(x, 3200) * env(n, 0.002, length, 6)


def pad(midis, length):
    n = int(length * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for m in midis:
        for det in (-0.07, 0.07):
            x += np.sin(2 * np.pi * note(m + det) * t)
    a = np.clip(t / 0.6, 0, 1) * np.clip((length - t) / 0.6, 0, 1)
    return lp(x, 1800) * a / len(midis)


# ---------- sfx ----------
def tick(freq=2200, length=0.03):
    n = int(length * SR)
    t = np.arange(n) / SR
    return np.sin(2 * np.pi * freq * t) * env(n, 0.0005, length * 0.5, 5)


def key_click():
    n = int(0.03 * SR)
    return bp(rng.standard_normal(n), 1800, 6000) * env(n, 0.0003, 0.012, 4)


def blip(f0=1400, f1=900, length=0.09):
    n = int(length * SR)
    t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t * 40)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.001, length * 0.6, 4)


def thock():
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    f = 180 + 300 * np.exp(-t * 60)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.0008, 0.05, 4)
    c = key_click()
    body[: len(c)] += c * 0.6
    return body


def whoosh(length):
    n = int(length * SR)
    t = np.arange(n) / SR
    x = rng.standard_normal(n)
    # sweep a band-pass upward by crossfading two filtered copies
    lo = bp(x, 300, 1200)
    hi = bp(x, 2000, 8000)
    k = (t / length) ** 2
    shape = (t / length) ** 2.2
    return (lo * (1 - k) + hi * k) * shape


def chime(base=76):
    out = np.zeros(int(0.9 * SR))
    for i, m in enumerate([base, base + 7, base + 12]):
        p = pluck(m, 0.7) * 0.6
        s = int(i * 0.05 * SR)
        out[s : s + len(p)] += p[: len(out) - s]
    return out


def boom():
    k = kick() * 1.2
    n = int(1.4 * SR)
    t = np.arange(n) / SR
    tail = lp(rng.standard_normal(n), 900) * np.exp(-t * 2.6) * 0.35
    out = tail
    out[: len(k)] += k
    return out


# ---------- music arrangement ----------
CHORDS = [(57, [57, 60, 64, 67]), (53, [53, 57, 60, 64]), (48, [55, 60, 64, 67]), (55, [55, 59, 62, 67])]  # Am7 Fmaj7 C(add) G
BAR = 4 * BEAT
title_t = sec(T["scenes"]["title"][0])
quiet_a = sec(T["scenes"]["s5"][0])
quiet_b = sec(T["scenes"]["outro"][0])
end_hit = sec(scene("outro", 70))

bar_i = 0
t = 0.0
while t < DUR:
    root, chord = CHORDS[bar_i % 4]
    add(music, t, pad(chord, BAR + 0.3), 0.16)
    for b in range(4):
        bt = t + b * BEAT
        if bt >= DUR:
            break
        full = title_t <= bt < quiet_a or quiet_b <= bt < end_hit + BEAT
        if full:
            add(music, bt, kick(), 0.9)
            add(music, bt + BEAT / 2, hat(), 0.22, pan=0.3)
            add(music, bt + BEAT / 4, hat(), 0.08, pan=-0.3)
            add(music, bt + 3 * BEAT / 4, hat(), 0.08, pan=-0.3)
            for e in range(2):
                add(music, bt + e * BEAT / 2, bass(root - 12 + (12 if (b == 3 and e == 1) else 0), BEAT / 2), 0.45)
            arp = [chord[(b * 2 + k) % 4] + 12 for k in range(4)]
            for k, m in enumerate(arp):
                add(music, bt + k * BEAT / 4, pluck(m), 0.07, pan=(-0.4 if k % 2 else 0.4))
        elif bt < title_t:
            add(music, bt + BEAT / 2, hat(), 0.12, pan=0.3)
        else:  # quiet chapter: only a soft pulse
            add(music, bt, pluck(chord[0] + 12, 0.35), 0.05)
    bar_i += 1
    t += BAR

# fade the bed out after the last hit
fade_start = end_hit + 2 * BEAT
ti = np.arange(N) / SR
music *= (np.clip(1 - (ti - fade_start) / (DUR - fade_start), 0, 1) ** 1.5)[:, None]

# riser into the title + hits
add(music, title_t - 0.9, whoosh(0.9), 0.35)
add(sfx, title_t, boom(), 0.9)
add(sfx, end_hit, boom(), 0.9)

# ---------- sfx cues ----------
# hook: tiles pop, selection locks
for i in range(9):
    add(sfx, sec(8 + i * 3), tick(2000 + i * 60), 0.25, pan=(i % 3 - 1) * 0.5)
add(sfx, sec(56), blip(900, 500, 0.12), 0.4)
add(sfx, sec(88), whoosh(0.5), 0.25)

# chapter wipes: whoosh into the red, thump on the number
for w in T["wipes"]:
    add(sfx, sec(w["at"] - 12), whoosh(sec(12)), 0.35)
    add(sfx, sec(w["at"]), thock(), 0.5)


def typing(scene_name, start, text_len, cps):
    last = 0
    for lf in range(start, start + int(text_len / cps) + 2):
        n = min(text_len, int((lf - start) * cps))
        if n > last:
            add(sfx, sec(scene(scene_name, lf)), key_click(), 0.35, pan=rng.uniform(-0.3, 0.3))
            last = n


# s1 frontend design
for i in range(4):
    add(sfx, sec(scene("s1", 72 + i * 5)), tick(1600), 0.22)
add(sfx, sec(scene("s1", 112)), whoosh(0.35), 0.2)
add(sfx, sec(scene("s1", 124)), blip(700, 300, 0.15), 0.35)

# s2 impeccable
typing("s2", 18, len("/impeccable audit"), 1.6)
for i in range(5):
    add(sfx, sec(scene("s2", 38 + i * 9)), blip(1500, 1100), 0.38, pan=(0.4 if i % 2 == 0 else -0.4))
typing("s2", 104, len("polish"), 1.2)
add(sfx, sec(scene("s2", 116)), chime(76), 0.35)
for k in range(9):
    add(sfx, sec(scene("s2", 140 + k * 4)), tick(2600), 0.12)

# s3 ui ux pro max
typing("s3", 16, len("A booking site for a calm spa"), 1.5)
for at in (46, 60, 74, 88):
    for k in range(0, 12, 2):
        add(sfx, sec(scene("s3", at + k)), tick(3000), 0.08)
    add(sfx, sec(scene("s3", at + 12)), thock(), 0.35)
add(sfx, sec(scene("s3", 112)), chime(72), 0.32)

# s4 taste
for i in range(3):
    add(sfx, sec(scene("s4", 16 + i * 6)), whoosh(0.18), 0.3, pan=(i - 1) * 0.5)
add(sfx, sec(scene("s4", 50)), blip(900, 600, 0.1), 0.35)
n = int(sec(22) * SR)
sweep = np.sin(2 * np.pi * np.cumsum(np.linspace(220, 660, n)) / SR) * np.hanning(n)
add(sfx, sec(scene("s4", 96)), sweep, 0.1)
for k in range(3):
    add(sfx, sec(scene("s4", 104 + k * 6)), blip(1300, 1000), 0.32)
add(sfx, sec(scene("s4", 126)), chime(79), 0.32)

# s5 emil: the quiet chapter, the presses carry it
for p in (84, 104):
    add(sfx, sec(scene("s5", p)), thock(), 0.6)
for b in range(4):
    add(sfx, sec(scene("s5", 124 + b * 24)), tick(1800, 0.02), 0.12)

# outro
for i in range(5):
    add(sfx, sec(scene("outro", 20 + i * 4)), tick(1700 + i * 120), 0.22)

# ---------- master ----------
mix_ = music * 0.8 + sfx
mix_ = np.tanh(mix_ * 1.1)
mix_ /= np.max(np.abs(mix_)) / 0.89
# 15 ms fades at both ends
fade = int(0.015 * SR)
mix_[:fade] *= np.linspace(0, 1, fade)[:, None]
mix_[-fade:] *= np.linspace(1, 0, fade)[:, None]

out = ROOT / "public" / "soundtrack.wav"
out.parent.mkdir(exist_ok=True)
with wave.open(str(out), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix_ * 32767).astype("<i2").tobytes())
print(f"wrote {out} ({DUR:.2f}s)")
