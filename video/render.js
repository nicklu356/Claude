// Deterministic frame renderer: steps time per frame in headless Chromium and
// pipes JPEG screenshots into ffmpeg.  Usage:
//   node render.js --out build/seg0.mp4 --from 0 --to 300 [--scale 0.5]
//   node render.js --stills 1.0,5.2,... --outdir build/stills [--scale 0.5]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => {
  if (v.startsWith('--')) a.push([v.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]);
  return a;
}, []));
const scale = parseFloat(args.scale || '1');
const port = args.port || 8765;

(async () => {
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: scale });
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.error('[page]', m.text()); });
  page.on('pageerror', (e) => console.error('[pageerror]', e.message));
  await page.goto(`http://localhost:${port}/web/index.html`);
  await page.waitForFunction('window.READY === true', null, { timeout: 120000 });
  const tl = await page.evaluate('window.TL');
  const fps = tl.fps;

  if (args.stills) {
    fs.mkdirSync(args.outdir, { recursive: true });
    for (const s of String(args.stills).split(',')) {
      const t = parseFloat(s);
      await page.evaluate((t) => window.renderAt(t), t);
      await page.screenshot({ path: path.join(args.outdir, `t${t.toFixed(2).padStart(7, '0')}.png`) });
    }
    await browser.close();
    return;
  }

  const total = Math.round(tl.duration * fps);
  const from = parseInt(args.from || '0', 10), to = Math.min(parseInt(args.to || String(total), 10), total);
  const W = Math.round(1920 * scale), H = Math.round(1080 * scale);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-vf', `scale=${W}:${H}:flags=lanczos,format=yuv420p`, '-c:v', 'libx264', '-preset', 'medium', '-crf', scale < 1 ? '22' : '17',
    '-r', String(fps), args.out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = from; f < to; f++) {
    await page.evaluate((t) => window.renderAt(t), f / fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if ((f - from) % 150 === 0) console.log(`${args.out}: frame ${f}/${to} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  await browser.close();
})();
