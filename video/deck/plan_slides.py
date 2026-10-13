"""Plan the PowerPoint version of the video: one slide per narration line.
Reads web/timeline.json, writes deck/video/slides.json (timing, audio delay, notes)
and deck/video/frames.txt (the still to capture for each slide).
Run from video/:  python3 deck/plan_slides.py"""
import json, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
tl = json.loads((ROOT / 'web' / 'timeline.json').read_text())
slides = []
for s in tl['scenes']:
    ls = s['lines']
    for i, l in enumerate(ls):
        start = s['start'] if i == 0 else l['start']
        end = ls[i + 1]['start'] if i + 1 < len(ls) else s['end']
        nxt = ls[i + 1]['start'] if i + 1 < len(ls) else s['end'] + 10
        # capture once everything this line introduces is on screen, before the next line's exits begin
        ft = min(max(l['end'] - 0.05, l['start'] + 1.2), end - 0.05, nxt - 0.45)
        if l['id'] == 's4b':
            ft = nxt - 0.95   # the notices card leaves early to make room for Spud
        slides.append(dict(scene=s['id'], name=s['name'], id=l['id'], voice=l['voice'], start=round(start, 3), end=round(end, 3),
                           delay=round(l['start'] - start, 3), frame=round(ft, 2), text=l['sub'], file=l['file']))
out = ROOT / 'deck' / 'video'
out.mkdir(parents=True, exist_ok=True)
(out / 'slides.json').write_text(json.dumps(slides, indent=1, ensure_ascii=False))
(out / 'frames.txt').write_text(','.join(str(x['frame']) for x in slides))
print(len(slides), 'slides')
