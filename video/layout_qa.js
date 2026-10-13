// Layout QA: step through the video and report boxes that overlap or sit closer than GAP px.
// usage: node layout_qa.js [--step 0.2] [--gap 12]
const { chromium } = require('playwright');
const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => { if (v.startsWith('--')) a.push([v.slice(2), arr[i + 1]]); return a; }, []));
const STEP = +(args.step || 0.2), GAP = +(args.gap || 12);
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('http://localhost:8765/web2d/index.html?shadow=512');
  await p.waitForFunction('window.READY === true', null, { timeout: 120000 });
  const tl = await p.evaluate('window.TL');
  const found = new Map();
  for (let t = 0; t < tl.duration; t += STEP) {
    const boxes = await p.evaluate((t) => { window.renderAt(t); return window.layoutBoxes(); }, t);
    const sc = tl.scenes.find(s => t >= s.start && t < s.end);
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const A = boxes[i], B = boxes[j];
      if (A.kind === 'actor' && B.kind === 'actor') continue;
      const dx = Math.max(A.x - (B.x + B.w), B.x - (A.x + A.w)), dy = Math.max(A.y - (B.y + B.h), B.y - (A.y + A.h));
      const gap = Math.max(dx, dy);           // negative = overlap
      if (gap < GAP) {
        const key = `${sc.id}|${A.label}|${B.label}`;
        const f = found.get(key) || { scene: sc.id, a: A.label, b: B.label, first: t, last: t, worst: gap };
        f.last = t; f.worst = Math.min(f.worst, gap); found.set(key, f);
      }
    }
  }
  const list = [...found.values()].filter(f => f.last - f.first >= STEP).sort((x, y) => x.first - y.first);
  for (const f of list) console.log(`S${f.scene} ${f.first.toFixed(1)}-${f.last.toFixed(1)}s gap ${f.worst.toFixed(0)}px :: ${f.a}  <->  ${f.b}`);
  console.log(`${list.length} issues`);
  await b.close();
})();
