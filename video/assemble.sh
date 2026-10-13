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
ffmpeg -loglevel error -y -pattern_type glob -i 'build/cs/*.png' -vf "tile=3x$(ls build/cs | wc -l | awk "{print int(\$1/3)}"):padding=6:color=0xFFF4E0" -frames:v 1 "$OUT/contact_sheet.png"
ls -la "$OUT"
