#!/bin/bash
# Mux rendered video + mixed audio, export deliverables and a contact sheet.
# usage: ./assemble.sh <rendered_video.mp4> <outdir>
set -e
cd "$(dirname "$0")"
VID=$1; OUT=${2:-/output}
mkdir -p "$OUT"
ffmpeg -loglevel error -y -i "$VID" -i build/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -ar 48000 \
  -movflags +faststart -shortest "$OUT/potato_video.mp4"
cp build/potato_video.srt "$OUT/potato_video.srt"
# same picture without the AI narration (music + SFX only), for re-recording the voice-over
if [ -f build/mix_novoice.wav ]; then
  ffmpeg -loglevel error -y -i "$VID" -i build/mix_novoice.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -ar 48000 \
    -movflags +faststart -shortest "$OUT/potato_video_no_narration.mp4"
fi
# narration script with start times, to read along when recording
python3 - "$OUT/narration_script.txt" <<'PY'
import json, sys
tl = json.load(open('web/timeline.json'))
out = ["POTATO narration script: each line starts at the time shown (mm:ss.s), duration in brackets.", ""]
for s in tl["scenes"]:
    out.append(f"== Scene {s['id']}: {s['name']} ==")
    for l in s["lines"]:
        m, sec = divmod(l["start"], 60)
        who = "JASON (Mandarin)" if l["voice"] == "jason" else "NARRATOR"
        txt = l["tts"] if l["voice"] == "jason" else l["sub"]
        out.append(f"{int(m):02d}:{sec:04.1f}  [{l['dur']:.1f}s]  {who}: {txt}")
    out.append("")
open(sys.argv[1], "w", encoding="utf-8").write("\n".join(out))
PY
cp web/timeline.json "$OUT/timeline.json"
# contact sheet: 3 frames per scene (20 %, 55 %, 88 % through each scene)
rm -rf build/cs && mkdir -p build/cs
python3 - "$OUT/potato_video.mp4" <<'EOF'
import json, subprocess, sys
tl = json.load(open('web/timeline.json'))
for s in tl['scenes']:
    for j, k in enumerate((0.2, 0.55, 0.88)):
        t = s['start'] + s['dur'] * k
        label = f"S{s['id']} {s['name']}  {int(t//60)}:{t%60:05.2f}".replace(':', r'\:')
        subprocess.check_call(['ffmpeg', '-loglevel', 'error', '-y', '-ss', f'{t:.3f}', '-i', sys.argv[1], '-frames:v', '1',
            '-vf', f"scale=640:360,drawtext=text='{label}':x=10:y=10:fontsize=20:fontcolor=white:box=1:boxcolor=0x1F2A44@0.8:boxborderw=6",
            f"build/cs/s{s['id']:02d}_{j}.png"])
EOF
ffmpeg -loglevel error -y -pattern_type glob -i 'build/cs/*.png' -vf "tile=3x10:padding=6:color=0xFFF4E0" -frames:v 1 "$OUT/contact_sheet.png"
ls -la "$OUT"
