// Build the "video as PowerPoint" deck: one slide per narration line of the
// concept video. Each slide has two layers taken from the renderer:
//   background = the painted Melbourne street (slide background picture, easy to
//                swap for a real photo via Format Background)
//   foreground = Jason, Spud and the UI on a transparent PNG
// plus that line's narration as auto-playing audio and auto-advance timing, so
// the slideshow plays like the video (and PowerPoint can export it as a video).
//
// Inputs (made by render.js / ffmpeg, see README):
//   video/slides.json   video/fg/*.png (alpha)   video/bg/*.png   video/audio/<line>.mp3
// Build: cd video/deck && npm install && NODE_PATH=$PWD/node_modules PPTX_SKILL=<pptx skill dir> node build_video_deck.js
const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');
const sharp = require('sharp');
const JSZip = require('jszip');
const { applyTheme } = require(process.env.PPTX_SKILL + '/scripts/apply_theme.js');

const OUT = path.resolve(__dirname, '../../output/HearHere_video_slides.pptx');
const V = (...p) => path.join(__dirname, 'video', ...p);
const slides = JSON.parse(fs.readFileSync(V('slides.json'), 'utf8'));
const still = (dir, t) => V(dir, `t${t.toFixed(2).padStart(7, '0')}.png`);

const THEME = {
  name: 'HearHere',
  headFontFace: 'Calibri',
  bodyFontFace: 'Calibri',
  colors: {
    dk1: '241A33', lt1: 'FFFFFF', dk2: '2E1F45', lt2: 'F4EEF8',
    accent1: '7B4B94', accent2: 'F28C28', accent3: '16707F', accent4: 'E0544B', accent5: '3A63D1', accent6: '9C6DB8',
    hlink: '3A63D1', folHlink: '7B4B94',
  },
};

(async () => {
  fs.mkdirSync(V('bgjpg'), { recursive: true });
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  pres.title = 'HearHere: concept video (slide version)';
  pres.author = 'Team Sweet Potatoes, Group 14';
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };

  let section = null, secNo = 0, secTitle = '';
  for (const [i, s] of slides.entries()) {
    if (s.name !== section) { section = s.name; secTitle = `${++secNo}. ${s.name}`; pres.addSection({ title: secTitle }); }
    const bg = V('bgjpg', `bg_${String(i + 1).padStart(2, '0')}.jpg`);
    await sharp(still('bg', s.frame)).jpeg({ quality: 86 }).toFile(bg);
    const slide = pres.addSlide({ sectionTitle: secTitle });
    slide.background = { path: bg };
    slide.addImage({ path: still('fg', s.frame), x: 0, y: 0, w: 10, h: 5.625, objectName: 'Foreground: characters and UI', altText: `${s.name}: ${s.text}` });
    slide.addMedia({ type: 'audio', path: V('audio', `${s.id}.mp3`), x: 9.62, y: 5.25, w: 0.3, h: 0.3, objectName: `Narration ${s.id}` });
    slide.addNotes(`${s.voice === 'narrator' ? 'Narrator' : s.voice === 'spud' ? 'Spud' : 'Jason (Mandarin)'}: ${s.text}`);
  }
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);

  // ---- auto-advance + auto-play narration (pptxgenjs has no API for either)
  const zip = await JSZip.loadAsync(fs.readFileSync(OUT));
  for (const [i, s] of slides.entries()) {
    const f = `ppt/slides/slide${i + 1}.xml`;
    let xml = await zip.file(f).async('string');
    // pptxgenjs tags audio as <a:videoFile>; PowerPoint needs <a:audioFile> for an audio relationship
    xml = xml.replace(/<a:videoFile (r:link="[^"]+")\/>/g, '<a:audioFile $1/>');
    const m = xml.match(/<p:pic>(?:(?!<\/p:pic>).)*?<p:cNvPr id="(\d+)"(?:(?!<\/p:pic>).)*?<a:audioFile/s);
    if (!m) throw new Error(`no audio on slide ${i + 1}`);
    const spid = m[1];
    const durMs = Math.round((s.end - s.start) * 1000), delayMs = Math.round(s.delay * 1000);
    const transition = `<p:transition spd="fast" advClick="0" advTm="${durMs}"><p:fade/></p:transition>`;
    const timing = `<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>`
      + `<p:par><p:cTn id="2" fill="hold"><p:stCondLst><p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond></p:stCondLst><p:childTnLst>`
      + `<p:par><p:cTn id="3" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>`
      + `<p:par><p:cTn id="4" presetID="1" presetClass="mediacall" presetSubtype="0" fill="hold" nodeType="afterEffect"><p:stCondLst><p:cond delay="${delayMs}"/></p:stCondLst><p:childTnLst>`
      + `<p:cmd type="call" cmd="playFrom(0.0)"><p:cBhvr><p:cTn id="5" dur="${durMs}" fill="hold"/><p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl></p:cBhvr></p:cmd>`
      + `</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par>`
      + `<p:audio><p:cMediaNode vol="80000" showWhenStopped="0"><p:cTn id="6" fill="hold" display="0"><p:stCondLst><p:cond delay="indefinite"/></p:stCondLst>`
      + `<p:endCondLst><p:cond evt="onStopAudio" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:endCondLst></p:cTn>`
      + `<p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl></p:cMediaNode></p:audio>`
      + `</p:childTnLst></p:cTn></p:par></p:tnLst></p:timing>`;
    xml = xml.replace(/<p:transition[^]*?<\/p:transition>|<p:timing>[^]*?<\/p:timing>/g, '');
    xml = xml.replace('</p:clrMapOvr>', `</p:clrMapOvr>${transition}${timing}`);
    zip.file(f, xml);
  }
  fs.writeFileSync(OUT, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
  const total = slides.reduce((a, s) => a + s.end - s.start, 0);
  console.log(`wrote ${OUT}: ${slides.length} slides, ${total.toFixed(1)} s`);
})();
