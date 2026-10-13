"""Mix narration + synthesised SFX (+ optional soft synthesised pad) to one
48 kHz track, then loudness-normalise to -16 LUFS (two-pass loudnorm).

python3 mix.py [--no-voice] [--music]
"""
import json, pathlib, subprocess, sys
import numpy as np

ROOT = pathlib.Path(__file__).parent
SR = 48000


def load(path):
    raw = subprocess.check_output(["ffmpeg", "-loglevel", "error", "-i", str(path), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"])
    return np.frombuffer(raw, dtype=np.float32).copy()


def env(n, a=0.005, r=0.2):
    t = np.arange(n) / SR
    e = np.minimum(1, t / a) * np.exp(-t / r)
    return e


def sfx_bank():
    rng = np.random.default_rng(7)
    b = {}
    # soft chirp: two quick rising sine blips (Spud's "voice")
    n = int(0.28 * SR); t = np.arange(n) / SR
    f = 900 + 900 * (t / t[-1]) ** 1.5
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-((t - 0.07) / 0.05) ** 2)
    s += 0.8 * np.sin(2 * np.pi * np.cumsum(f * 1.25) / SR) * np.exp(-((t - 0.19) / 0.045) ** 2)
    b["chirp"] = 0.32 * s
    # tap: short click + low thump
    n = int(0.12 * SR); t = np.arange(n) / SR
    b["tap"] = 0.45 * (np.sin(2 * np.pi * 180 * t) * np.exp(-t / 0.025) + 0.4 * rng.standard_normal(n) * np.exp(-t / 0.004))
    # chime: bell partials
    n = int(1.4 * SR); t = np.arange(n) / SR
    s = sum(a * np.sin(2 * np.pi * fr * t) * np.exp(-t / d) for fr, a, d in [(1318.5, 1, .5), (1975.5, .6, .35), (2637, .35, .25), (3951, .15, .15)])
    s2 = np.zeros(n); off = int(0.11 * SR)
    s2[off:] = sum(a * np.sin(2 * np.pi * fr * t[:n - off]) * np.exp(-t[:n - off] / d) for fr, a, d in [(1760, .9, .5), (2637, .5, .3)])
    b["chime"] = 0.16 * (s + s2) * np.minimum(1, t / 0.003)
    # whoosh: band-passed noise sweep
    from scipy.signal import butter, sosfilt
    n = int(0.55 * SR); t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    for k in range(0, n, 1200):
        fc = 400 + 2600 * (k / n)
        sos = butter(2, [fc * 0.7, fc * 1.3], btype="band", fs=SR, output="sos")
        out[k:k + 1200] = sosfilt(sos, noise[max(0, k - 2400):k + 1200])[-len(out[k:k + 1200]):]
    b["whoosh"] = 0.22 * out * np.sin(np.pi * t / t[-1]) ** 2
    # pop: soft bubble pop
    n = int(0.1 * SR); t = np.arange(n) / SR
    f = 500 + 700 * np.exp(-t / 0.02)
    b["pop"] = 0.22 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.03)
    return b


def pad(dur):
    """Very soft synthesised chord pad (royalty-free by construction)."""
    from scipy.signal import butter, sosfilt
    n = int(dur * SR); t = np.arange(n) / SR
    chords = [[261.63, 329.63, 392.0], [196.0, 246.94, 293.66], [220.0, 261.63, 329.63], [174.61, 220.0, 261.63]]
    out = np.zeros(n); seg = 4.0
    for i in range(int(dur / seg) + 1):
        a, bb = int(i * seg * SR), min(n, int((i + 1) * seg * SR + SR))
        if a >= n: break
        tt = np.arange(bb - a) / SR
        w = np.minimum(1, tt / 1.0) * np.minimum(1, (tt[-1] - tt) / 1.0 + 1e-9)
        for f in chords[i % 4]:
            out[a:bb] += w * (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * 2 * f * tt + 0.5)) / 3
    sos = butter(2, 1800, fs=SR, output="sos")
    return sosfilt(sos, out) * np.minimum(1, t / 2) * np.minimum(1, (dur - t) / 2)


def lufs(path):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(path), "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    return json.loads(r[r.rindex("{"):r.rindex("}") + 1])


def main():
    tl = json.loads((ROOT / "web" / "timeline.json").read_text())
    n = int((tl["duration"] + 0.5) * SR)
    voice = np.zeros(n); fx = np.zeros(n)
    if "--no-voice" not in sys.argv:
        for sc in tl["scenes"]:
            for ln in sc["lines"]:
                clip = load(ROOT / ln["file"]); a = int(ln["start"] * SR)
                voice[a:a + len(clip)] += clip[: n - a]
    bank = sfx_bank()
    for e in tl["sfx"]:
        s = bank[e["name"]]; a = int(e["t"] * SR)
        fx[a:a + len(s)] += s[: max(0, n - a)]
    mix = voice + 0.55 * fx
    if "--music" in sys.argv:
        m = pad(n / SR)
        # target ~27 dB below the voice level
        vr = np.sqrt(np.mean(voice[voice != 0] ** 2)) if voice.any() else 0.1
        mr = np.sqrt(np.mean(m ** 2))
        mix += m * (vr / mr) * 10 ** (-27 / 20)
    pre = ROOT / "build" / "mix_pre.wav"
    import wave
    with wave.open(str(pre), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(mix / max(1e-9, np.abs(mix).max()) * 0.7, -1, 1) * 32767).astype(np.int16).tobytes())
    m = lufs(pre)
    out = ROOT / "build" / "mix.wav"
    af = (f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
          f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    subprocess.check_call(["ffmpeg", "-y", "-loglevel", "error", "-i", str(pre), "-af", af, "-ar", str(SR), "-ac", "2", str(out)])
    f = lufs(out)
    print(f"mix: {out}  integrated {f['input_i']} LUFS, true peak {f['input_tp']} dBTP")


if __name__ == "__main__":
    main()
