"""Generate one audio clip per script line, then measure it with ffprobe.

Engine: Microsoft neural TTS via edge-tts (preferred by the brief).
  narrator = en-AU-NatashaNeural (fallback en-AU-WilliamNeural)
  jason    = zh-TW-YunJheNeural
Each clip: leading/trailing silence trimmed, loudness-normalised to -16 LUFS,
48 kHz mono WAV. No speed/pitch change beyond the brief's +/-5 %.
Writes audio/manifest.json {id: {file, duration, voice}}.
"""
import asyncio, json, pathlib, subprocess, sys

ROOT = pathlib.Path(__file__).parent
OUT = ROOT / "audio"
VOICES = {"narrator": ["en-AU-NatashaNeural", "en-AU-WilliamNeural"], "jason": ["zh-TW-YunJheNeural"]}
RATE = {"narrator": "+0%", "jason": "+0%"}


def ffprobe_dur(p):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                          "-of", "default=nw=1:nk=1", str(p)]).decode().strip())


def post_process(src, dst):
    # trim silence at both ends, normalise to -16 LUFS, 48k mono
    af = ("silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.02,"
          "areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05,areverse,"
          "loudnorm=I=-16:TP=-1.5:LRA=11")
    subprocess.check_call(["ffmpeg", "-y", "-loglevel", "error", "-i", str(src), "-af", af,
                           "-ar", "48000", "-ac", "1", str(dst)])


async def main():
    import edge_tts
    voices = {v["ShortName"] for v in await edge_tts.list_voices()}
    chosen = {}
    for role, cands in VOICES.items():
        ok = [c for c in cands if c in voices]
        if not ok:
            sys.exit(f"no voice available for {role}: {cands}")
        chosen[role] = ok[0]
    print("voices:", chosen)
    script = json.loads((ROOT / "script.json").read_text())
    OUT.mkdir(exist_ok=True)
    manifest = {}
    for sc in script["scenes"]:
        for ln in sc["lines"]:
            raw = OUT / f"{ln['id']}.mp3"
            wav = OUT / f"{ln['id']}.wav"
            if not raw.exists():
                await edge_tts.Communicate(ln["tts"], chosen[ln["voice"]], rate=RATE[ln["voice"]]).save(str(raw))
            post_process(raw, wav)
            d = ffprobe_dur(wav)
            manifest[ln["id"]] = {"file": f"audio/{wav.name}", "duration": round(d, 3), "voice": chosen[ln["voice"]]}
            print(f"{ln['id']:5s} {d:6.2f}s  {ln['tts'][:60]}")
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=1, ensure_ascii=False))
    print("total speech:", round(sum(m["duration"] for m in manifest.values()), 2))


if __name__ == "__main__":
    asyncio.run(main())
