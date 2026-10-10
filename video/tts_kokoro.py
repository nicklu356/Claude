"""Kokoro-82M (v1.0, q8 ONNX) TTS: one clip per script line, measured with ffprobe.

Run with a Python that has onnxruntime, kokoro-onnx (espeak-ng G2P for English)
and misaki[zh] (Mandarin G2P):   <venv>/bin/python tts_kokoro.py
  narrator -> af_heart   (Kokoro's highest-rated English voice)
  jason    -> zm_yunxi   (male Mandarin)
Each clip: silence trimmed, normalised to -16 LUFS, 48 kHz mono WAV, speed 1.0.
Writes audio/manifest.json.
"""
import json, pathlib, subprocess
import numpy as np, onnxruntime as ort, soundfile as sf
from kokoro_onnx.tokenizer import Tokenizer
from kokoro_onnx.config import DEFAULT_VOCAB
from misaki import zh

ROOT = pathlib.Path(__file__).parent
MODEL = ROOT / "models" / "kokoro-v1.0-q8.onnx"
VOICES = {"narrator": ("af_heart", "en-us"), "jason": ("zm_yunxi", "zh")}
SPEED = {"narrator": 1.0, "jason": 1.0}
OUT = ROOT / "audio"

sess = ort.InferenceSession(str(MODEL))
tok = Tokenizer()
zhg2p = zh.ZHG2P()


def phonemes(text, lang):
    if lang == "zh":
        return zhg2p(text)[0]
    return tok.phonemize(text, lang)


def synth(text, role):
    voice, lang = VOICES[role]
    ps = phonemes(text, lang)
    ids = [DEFAULT_VOCAB[c] for c in ps if c in DEFAULT_VOCAB]
    pack = np.fromfile(ROOT / "models" / "voices" / f"{voice}.bin", dtype=np.float32).reshape(-1, 1, 256)
    style = pack[len(ids)]
    wav = sess.run(None, {"input_ids": np.array([[0, *ids, 0]], dtype=np.int64), "style": style,
                          "speed": np.array([SPEED[role]], dtype=np.float32)})[0]
    return np.squeeze(wav), ps


def main():
    script = json.loads((ROOT / "script.json").read_text())
    OUT.mkdir(exist_ok=True)
    manifest = {}
    for sc in script["scenes"]:
        for ln in sc["lines"]:
            wav, ps = synth(ln["tts"], ln["voice"])
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
