"""Build timeline.json + .srt from measured audio durations.

Usage: python3 build_timeline.py [--estimate]
  Without --estimate, requires audio/manifest.json (written by tts.py,
  durations measured with ffprobe). With --estimate, uses a reading-rate
  estimate so the visuals can be drafted before audio exists.
"""
import json, pathlib, re, sys

ROOT = pathlib.Path(__file__).parent
MAXC = 42


def wrap(text, width=MAXC):
    words, lines, cur = text.split(), [], ""
    for w in words:
        if not cur:
            cur = w
        elif len(cur) + 1 + len(w) <= width:
            cur += " " + w
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def balanced_wrap(text):
    """Wrap into <=2 lines of <=42 chars, balancing line lengths."""
    lines = wrap(text)
    if len(lines) != 2:
        return lines
    words = text.split()
    best = None
    for k in range(1, len(words)):
        a, b = " ".join(words[:k]), " ".join(words[k:])
        if len(a) <= MAXC and len(b) <= MAXC:
            score = abs(len(a) - len(b))
            if best is None or score < best[0]:
                best = (score, [a, b])
    return best[1] if best else lines


def split_cues(text):
    """Split a sentence into chunks that each fit in 2 lines x 42 chars."""
    if len(wrap(text)) <= 2:
        return [text]
    # split at clause boundaries, keep the delimiter with the left piece
    pieces = [p for p in re.split(r"(?<=[,:;—])\s+", text) if p]
    chunks, cur = [], ""
    for p in pieces:
        cand = (cur + " " + p).strip()
        if len(wrap(cand)) <= 2:
            cur = cand
        else:
            if cur:
                chunks.append(cur)
            cur = p
    if cur:
        chunks.append(cur)
    # any chunk still too long -> split by words
    out = []
    for c in chunks:
        while len(wrap(c)) > 2:
            ws, acc = c.split(), ""
            for i, w in enumerate(ws):
                if len(wrap((acc + " " + w).strip())) > 2:
                    out.append(acc)
                    c = " ".join(ws[i:])
                    break
                acc = (acc + " " + w).strip()
        out.append(c)
    return out


def estimate(line):
    t = line["tts"]
    if line["voice"] == "jason":
        return round(len(t) / 5.6 + 0.2, 3)
    return round(len(t) / 15.0 + 0.25, 3)


def fmt_srt(t):
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def main():
    est = "--estimate" in sys.argv
    script = json.loads((ROOT / "script.json").read_text())
    manifest = {}
    if not est:
        manifest = json.loads((ROOT / "audio" / "manifest.json").read_text())
    gap, lead, tail = script["gap"], script["lead_in"], script["tail"]

    t = 0.0
    scenes, lines_all, cues = [], [], []
    for sc in script["scenes"]:
        start = t
        cursor = start + (sc.get("lead_in") or lead)  # a scene may hold longer before its first line
        lines = []
        for i, ln in enumerate(sc["lines"]):
            if est:
                dur = estimate(ln)
            else:
                dur = manifest[ln["id"]]["duration"]
            if i > 0:
                cursor += manifest.get(ln["id"], {}).get("gap_before", gap) if not est else gap
            item = {"id": ln["id"], "voice": ln["voice"], "start": round(cursor, 3), "dur": dur,
                    "end": round(cursor + dur, 3), "sub": ln["sub"], "tts": ln["tts"]}
            if not est:
                item["file"] = manifest[ln["id"]]["file"]
            lines.append(item)
            # subtitle cues proportional to characters
            chunks = split_cues(ln["sub"])
            total = sum(len(c) for c in chunks)
            ct = cursor
            for c in chunks:
                cd = dur * len(c) / total
                cues.append({"start": round(ct, 3), "end": round(ct + cd, 3), "lines": balanced_wrap(c),
                             "line": ln["id"]})
                ct += cd
            cursor += dur
        end = cursor + (sc.get("tail") or tail)
        scenes.append({"id": sc["id"], "name": sc["name"], "start": round(start, 3), "end": round(end, 3),
                       "dur": round(end - start, 3), "lines": lines})
        lines_all += lines
        t = end

    # extend each cue to the next cue start if the gap is tiny (avoids flicker)
    for a, b in zip(cues, cues[1:]):
        if 0 < b["start"] - a["end"] < 0.35:
            a["end"] = b["start"]

    line_start = {l["id"]: l["start"] for l in lines_all}
    scene_start = {f"@{s['id']}": s["start"] for s in scenes}
    sfx = []
    for name, anchor, off in script["sfx"]:
        base = scene_start[anchor] if anchor.startswith("@") else line_start[anchor]
        sfx.append({"name": name, "t": round(base + off, 3)})

    tl = {"fps": 30, "width": 1920, "height": 1080, "duration": round(t, 3), "estimated": est,
          "scenes": scenes, "cues": cues, "sfx": sfx}
    (ROOT / "web" / "timeline.json").write_text(json.dumps(tl, ensure_ascii=False, indent=1))
    srt = []
    for i, c in enumerate(cues, 1):
        srt.append(f"{i}\n{fmt_srt(c['start'])} --> {fmt_srt(c['end'])}\n" + "\n".join(c["lines"]) + "\n")
    (ROOT / "build").mkdir(exist_ok=True)
    (ROOT / "build" / "potato_video.srt").write_text("\n".join(srt), encoding="utf-8")
    for s in scenes:
        print(f"scene {s['id']:2d} {s['name']:<22} {s['start']:7.2f} -> {s['end']:7.2f}  ({s['dur']:.2f}s)")
    print(f"TOTAL {t:.2f}s  ({'ESTIMATED' if est else 'measured'})")
    bad = [c for c in cues if len(c["lines"]) > 2 or any(len(x) > MAXC for x in c["lines"])]
    if bad:
        print("SUBTITLE OVERFLOW:", bad)


if __name__ == "__main__":
    main()
