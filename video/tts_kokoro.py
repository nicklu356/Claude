"""Kokoro-82M (v1.0, int8 ONNX from the kokoro-onnx GitHub release) TTS: one clip per script line, measured with ffprobe.

Run with a Python that has onnxruntime, kokoro-onnx (espeak-ng G2P for English)
and misaki[zh] (Mandarin G2P):   <venv>/bin/python tts_kokoro.py
  narrator -> af_heart   (Kokoro's highest-rated English voice)
  jason    -> zm_yunxi   (male Mandarin)
Each clip: silence trimmed, normalised to -16 LUFS, 48 kHz mono WAV, speed 1.0.
Writes audio/manifest.json.
"""
import json, pathlib, subprocess
import sys
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
from kokoro_onnx.tokenizer import Tokenizer
from misaki import zh

ROOT = pathlib.Path(__file__).parent
MODEL = ROOT / "models" / "kokoro-v1.0.int8.onnx"
VOICEPACK = ROOT / "models" / "voices-v1.0.bin"
VOICES = {"narrator": ("af_heart", "en-us"), "jason": ("zm_yunxi", "zh")}
SPEED = {"narrator": 1.0, "jason": 1.0}
OUT = ROOT / "audio"

kok = Kokoro(str(MODEL), str(VOICEPACK))
tok = Tokenizer()
zhg2p = zh.ZHG2P()


def phonemes(text, lang):
    if lang == "zh":
        return zhg2p(text)[0]
    return tok.phonemize(text, lang)


def synth(text, role, ps=None):
    voice, lang = VOICES[role]
    ps = ps or phonemes(text, lang)
    wav, _sr = kok.create(ps, voice=voice, speed=SPEED[role], is_phonemes=True)
    return np.squeeze(wav), ps


def main():
    script = json.loads((ROOT / "script.json").read_text())
    OUT.mkdir(exist_ok=True)
    only = set(sys.argv[1:])  # optional: regenerate just these line ids
    mpath = OUT / "manifest.json"
    manifest = json.loads(mpath.read_text()) if only and mpath.exists() else {}
    for sc in script["scenes"]:
        for ln in sc["lines"]:
            if only and ln["id"] not in only:
                continue
            # a line may pin its phonemes (newer misaki releases mangle Traditional Chinese)
            wav, ps = synth(ln["tts"], ln["voice"], ln.get("phonemes"))
            raw = OUT / f"{ln['id']}_raw.wav"
            sf.write(raw, wav, 24000)
            out = OUT / f"{ln['id']}.wav"
            af = ("silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.02,"
                  "areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05,areverse,"
                  "loudnorm=I=-16:TP=-1.5:LRA=11")
            subprocess.check_call(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af", af, "-ar", "48000", "-ac", "1", str(out)])
            d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", str(out)]).decode())
            manifest[ln["id"]] = {"file": f"audio/{out.name}", "duration": round(d, 3), "voice": f"Kokoro-82M {VOICES[ln['voice']][0]}", "phonemes": ps}
            print(f"{ln['id']:5s} {d:6.2f}s  {ln['tts'][:70]}")
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=1, ensure_ascii=False))
    print("total speech:", round(sum(m["duration"] for m in manifest.values()), 2))


if __name__ == "__main__":
    main()
