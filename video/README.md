# POTATO concept video: build pipeline

The current video is the **2D flat-vector version** in `web2d/`. The older Three.js version is still in `web/`, and its output is kept in `output/3d_version/`.

| Step | Command |
|---|---|
| 1. Narration (Kokoro-82M, int8 ONNX) | `.venv-tts/bin/python tts_kokoro.py [line ids…]` |
| 2. Timeline + subtitles from measured audio | `python3 build_timeline.py` |
| 3. Audio mix (narration + synthesised SFX + soft pad) | `.venv-tts/bin/python mix.py --music` |
| 4. Render frames (2D page is the default) | `python3 -m http.server 8765 &` then `./render_all.sh 1 build/render2d.mp4 4` |
| 5. Mux, contact sheet | `./assemble.sh build/render2d.mp4 ../output` |
| 6. QA | `.venv-tts/bin/python qa.py ../output/potato_video.mp4` |

Model files (not committed) go in `models/`: `kokoro-v1.0.int8.onnx` and `voices-v1.0.bin`, both from the
`model-files-v1.0` release of github.com/thewh1teagle/kokoro-onnx.

To swap the AI voice for real recordings later, replace `audio/<line id>.wav`, update its `duration` in
`audio/manifest.json`, then re-run steps 2–5. The animation timing follows the audio automatically.

## Art and naming
- **POTATO**: Public Opinion Translation And Tracking Outpost (the concept name).
- **Melb**: the cat-ear robot mascot on top of the post, from `assets/concept_sketch.png`.
- **Hi Melb**: the greeting and the name of the companion app.
- The **touchscreen** is the rectangle on the pillar, directly above the NFC pad. The lower body is the
  wrap-around verified-notices display.
- Persona: Jason only.

## PowerPoint version of the video (`output/HearHere_video_slides.pptx`)
One slide per narration line (42 slides, 2:53). Each slide has the painted street as its **background
picture** (right-click → Format Background → Picture to swap in a real photo), the characters and UI as a
transparent foreground image, the line's narration as auto-playing audio, and auto-advance timing, so the
slideshow plays like the video and PowerPoint can export it as a video (File → Export → Create a Video →
"Use Recorded Timings and Narrations").

Rebuild:
```
python3 build_deck_frames.py   # (inline in history) or regenerate deck/video/slides.json from web/timeline.json
node render.js --page web2d/index.html --stills $(cat deck/video/frames.txt) --outdir deck/video/fg --alpha 1
node render.js --page web2d/index.html --stills $(cat deck/video/frames.txt) --outdir deck/video/bg --bgonly 1
for f in audio/*.wav; do ffmpeg -i $f -ac 1 -b:a 96k deck/video/audio/$(basename $f .wav).mp3; done
cd deck && NODE_PATH=$PWD/node_modules PPTX_SKILL=<pptx skill dir> node build_video_deck.js
```
