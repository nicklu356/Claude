"""QA checks for the rendered video.  python3 qa.py <video.mp4>"""
import glob, json, pathlib, re, subprocess, sys
from opencc import OpenCC

ROOT = pathlib.Path(__file__).parent
ok = lambda c: "PASS" if c else "FAIL"
video = sys.argv[1] if len(sys.argv) > 1 else "/output/potato_video.mp4"
report = []


def say(s):
    print(s); report.append(s)


# 1. container / streams
pr = json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", video]))
v = next(s for s in pr["streams"] if s["codec_type"] == "video")
a = next((s for s in pr["streams"] if s["codec_type"] == "audio"), None)
dur = float(pr["format"]["duration"])
say(f"[{ok(dur <= 175)}] duration {dur:.2f}s (limit 180, target <=175)")
say(f"[{ok(v['width'] == 1920 and v['height'] == 1080)}] resolution {v['width']}x{v['height']}")
say(f"[{ok(v['r_frame_rate'] == '30/1')}] fps {v['r_frame_rate']}  codec {v['codec_name']} {v.get('profile')}")
say(f"[{ok(a is not None and a['codec_name'] == 'aac')}] audio {a and a['codec_name']} {a and a['sample_rate']} Hz")

# 2. loudness
r = subprocess.run(["ffmpeg", "-hide_banner", "-i", video, "-af", "loudnorm=print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
L = json.loads(r[r.rindex("{"):r.rindex("}") + 1])
say(f"[{ok(abs(float(L['input_i']) + 16) <= 1.0 and float(L['input_tp']) <= -1.0)}] loudness {L['input_i']} LUFS, true peak {L['input_tp']} dBTP")

# 3. static frames (> 2.5 s)
r = subprocess.run(["ffmpeg", "-hide_banner", "-i", video, "-vf", "freezedetect=n=0.0008:d=2.5", "-map", "0:v", "-f", "null", "-"], capture_output=True, text=True).stderr
frz = re.findall(r"freeze_start: ([\d.]+)", r)
say(f"[{ok(not frz)}] no static frame > 2.5 s" + (f"  frozen at {frz}" if frz else ""))

# 4. scene boundaries vs audio
tl = json.loads((ROOT / "web" / "timeline.json").read_text())
bad = [s["id"] for s in tl["scenes"] if not all(s["start"] < l["start"] and l["end"] <= s["end"] for l in s["lines"])]
say(f"[{ok(not bad and not tl['estimated'])}] every scene contains its narration (timeline from measured audio: {not tl['estimated']})")

# 5. Chinese: Traditional only + glyph coverage
src = (ROOT / "web2d" / "scenes.js").read_text() + json.dumps(tl, ensure_ascii=False) + (ROOT / "script.json").read_text()
han = sorted(set(re.findall(r"[㐀-鿿豈-﫿]", src)))
cc = OpenCC("s2t")
simp = [c for c in han if cc.convert(c) != c]
say(f"[{ok(not simp)}] {len(han)} distinct Han characters, Simplified found: {simp or 'none'}")
from fontTools.ttLib import TTFont
cmap = set()
for f in glob.glob(str(ROOT / "node_modules/@fontsource/noto-sans-tc/files/noto-sans-tc-*-700-normal.woff2")):
    cmap |= set(TTFont(f).getBestCmap().keys())
punct = set(re.findall(r"[　-〿＀-￯]", src))
missing = [c for c in han + sorted(punct) if ord(c) not in cmap]
say(f"[{ok(not missing)}] Noto Sans TC covers all CJK glyphs (missing: {missing or 'none'})")

# 6. spelling
vis = re.sub(r"tts\":\s*\"[^\"]*\"", "", src)
names = ["Jia-Ying Lee", "1790130", "Xintong FU", "1840227", "Yu-Hao LU", "1781474", "Yen-Chu OU YANG", "1801365",
         "HearHere", "Spud", "Street Post for Understanding Decisions", "Team Sweet Potatoes", "Group 14"]
miss = [n for n in names if n not in src]
say(f"[{ok(not miss)}] names / IDs / acronym present (missing: {miss or 'none'})")
subs = " ".join(" ".join(c["lines"]) for c in tl["cues"])
wrong = re.findall(r"\b(?:POTATO|Potato post|Melb)\b", subs)
say(f"[{ok(not wrong)}] old names (POTATO / Melb) absent from the narration text")
over = [c for c in tl["cues"] if len(c["lines"]) > 2 or any(len(x) > 42 for x in c["lines"])]
say(f"[{ok(not over)}] subtitles <= 2 lines x 42 chars ({len(tl['cues'])} cues)")

(ROOT / "build" / "qa_report.txt").write_text("\n".join(report) + "\n")
