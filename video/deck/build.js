// Build: cd video/deck && npm install && NODE_PATH=$PWD/node_modules PPTX_SKILL=<pptx skill dir> node build.js
// Images in img/ are transparent stills from the video renderer (render.js --clean 1 --alpha 1).
// HearHere concept deck (INFO90006, Team Sweet Potatoes) — pptxgenjs, structured deck
const pptxgen = require('pptxgenjs');
const sharp = require('sharp');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const fa = require('react-icons/fa6');
const { applyTheme } = require(process.env.PPTX_SKILL + '/scripts/apply_theme.js');

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
const HEX = { purple: '7B4B94', orange: 'F28C28', teal: '16707F', red: 'E0544B', blue: '3A63D1', plum: '2E1F45', lilac: 'F4EEF8', ink: '241A33', grey: '5B5470', white: 'FFFFFF' };
const IMG = (n) => `img/${n}.png`;

async function icon(Comp, color, size = 256) {
  const svg = renderToStaticMarkup(React.createElement(Comp, { color: '#' + color, size }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return 'image/png;base64,' + buf.toString('base64');
}
async function dims(file) { const m = await sharp(file).metadata(); return { w: m.width, h: m.height }; }
// place an image inside a box, keeping its aspect ratio (contain), centred
async function fit(slide, file, x, y, w, h, name, align = 'c') {
  const d = await dims(file); const r = Math.min(w / d.w, h / d.h);
  const iw = d.w * r, ih = d.h * r;
  const ix = align === 'l' ? x : align === 'r' ? x + w - iw : x + (w - iw) / 2;
  slide.addImage({ path: file, x: ix, y: y + (h - ih) / 2, w: iw, h: ih, objectName: name, altText: name });
  return { x: ix, y: y + (h - ih) / 2, w: iw, h: ih };
}

(async () => {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5
  pres.author = 'Team Sweet Potatoes (Group 14)';
  pres.title = 'HearHere: Speak here. Be heard.';
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;

  // ---------------------------------------------------------------- layouts
  pres.defineSlideMaster({
    title: 'DARK',
    background: { color: C.text2 },
    objects: [],
  });
  pres.defineSlideMaster({
    title: 'CONTENT',
    background: { color: C.background1 },
    margin: [0.5, 0.6, 0.5, 0.6],
    objects: [
      { placeholder: { options: { name: 'title', type: 'title', x: 0.6, y: 0.35, w: 12.1, h: 0.85, fontSize: 34, bold: true, color: C.text2, valign: 'middle', margin: 0 }, text: '' } },
      { text: { text: 'HearHere · Team Sweet Potatoes · Group 14 · INFO90006', options: { x: 0.6, y: 7.05, w: 8, h: 0.3, fontSize: 10, color: '8A8398', margin: 0 } } },
    ],
    slideNumber: { x: 12.3, y: 7.05, w: 0.4, h: 0.3, fontSize: 10, color: '8A8398', align: 'right' },
  });
  pres.defineSlideMaster({
    title: 'LILAC',
    background: { color: C.background2 },
    margin: [0.5, 0.6, 0.5, 0.6],
    objects: [
      { placeholder: { options: { name: 'title', type: 'title', x: 0.6, y: 0.35, w: 12.1, h: 0.85, fontSize: 34, bold: true, color: C.text2, valign: 'middle', margin: 0 }, text: '' } },
      { text: { text: 'HearHere · Team Sweet Potatoes · Group 14 · INFO90006', options: { x: 0.6, y: 7.05, w: 8, h: 0.3, fontSize: 10, color: '8A8398', margin: 0 } } },
    ],
    slideNumber: { x: 12.3, y: 7.05, w: 0.4, h: 0.3, fontSize: 10, color: '8A8398', align: 'right' },
  });

  const card = (s, x, y, w, h, name, fill = C.background1) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { color: 'E4DCEB', width: 0.75 },
    shadow: { type: 'outer', color: '2E1F45', opacity: 0.12, blur: 8, offset: 2, angle: 90 }, objectName: name,
  });
  const txt = (s, text, o) => s.addText(text, { isTextBox: true, margin: 0, fontSize: 15, color: C.text1, valign: 'top', ...o });
  const dot = async (s, x, y, d, color, Comp, name) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color }, line: { color, width: 0 }, objectName: name + ' circle' });
    s.addImage({ data: await icon(Comp, 'FFFFFF'), x: x + d * 0.24, y: y + d * 0.24, w: d * 0.52, h: d * 0.52, objectName: name + ' icon' });
  };
  const chip = (s, text, x, y, w, color, name) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.34, rectRadius: 0.17, fill: { color }, line: { color, width: 0 }, objectName: name });
    txt(s, text, { x, y, w, h: 0.34, fontSize: 12, bold: true, color: C.background1, align: 'center', valign: 'middle' });
  };

  // ================================================================ 1 Title
  pres.addSection({ title: 'Opening' });
  {
    const s = pres.addSlide({ masterName: 'DARK', sectionTitle: 'Opening' });
    txt(s, 'TEAM SWEET POTATOES · GROUP 14 · INFO90006 FIELDWORK FOR DESIGN', { x: 0.8, y: 1.2, w: 7.4, h: 0.4, fontSize: 13, bold: true, color: HEX.orange, charSpacing: 2 });
    txt(s, [{ text: 'Hear', options: { color: C.background1 } }, { text: 'Here', options: { color: HEX.orange } }], { x: 0.8, y: 1.75, w: 7.4, h: 1.5, fontSize: 88, bold: true, valign: 'middle' });
    txt(s, 'A street post that helps international residents understand and answer local council decisions', { x: 0.8, y: 3.35, w: 6.6, h: 1.0, fontSize: 22, color: 'E9E1F2' });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.8, y: 4.6, w: 4.2, h: 0.62, rectRadius: 0.31, fill: { color: HEX.orange }, line: { color: HEX.orange, width: 0 }, objectName: 'tagline pill' });
    txt(s, 'Your street, your say.', { x: 0.8, y: 4.6, w: 4.2, h: 0.62, fontSize: 22, bold: true, color: C.background1, align: 'center', valign: 'middle' });
    txt(s, [{ text: 'Mascot: ', options: { bold: true, color: HEX.orange } }, { text: 'Spud, the ', options: { color: 'E9E1F2' } },
      { text: 'S', options: { bold: true, color: HEX.orange } }, { text: 'treet ', options: { color: 'E9E1F2' } }, { text: 'P', options: { bold: true, color: HEX.orange } }, { text: 'ost for ', options: { color: 'E9E1F2' } },
      { text: 'U', options: { bold: true, color: HEX.orange } }, { text: 'nderstanding ', options: { color: 'E9E1F2' } }, { text: 'D', options: { bold: true, color: HEX.orange } }, { text: 'ecisions', options: { color: 'E9E1F2' } }],
      { x: 0.8, y: 5.55, w: 7.2, h: 0.45, fontSize: 18 });
    txt(s, 'Jia-Ying Lee · Xintong Fu · Yu-Hao Lu · Yen-Chu Ou Yang', { x: 0.8, y: 6.45, w: 7.4, h: 0.4, fontSize: 14, color: 'B9AECB' });
    await fit(s, IMG('spud_hi'), 8.3, 0.5, 4.6, 6.5, 'HearHere post with Spud saying hi');
    s.addNotes("Hi there! I'm Spud. We're Group 14, Team Sweet Potatoes, and this is HearHere: a street post that helps international residents understand and answer local council decisions. Spud stands for Street Post for Understanding Decisions. HearHere. Your street, your say.");
  }

  // ================================================================ 2 Problem
  pres.addSection({ title: 'Problem and persona' });
  {
    const s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Problem and persona' });
    s.addText("The barrier isn't a lack of interest", { placeholder: 'title' });
    const stats = [['8', 'interviews with international residents'], ['4', 'observation sites (3 physical + council website)'], ['5', 'themes from thematic analysis']];
    for (let i = 0; i < 3; i++) {
      const x = 0.6 + i * 4.1;
      txt(s, stats[i][0], { x, y: 1.45, w: 1.1, h: 1.0, fontSize: 60, bold: true, color: HEX.purple, valign: 'middle' });
      txt(s, stats[i][1], { x: x + 1.15, y: 1.6, w: 2.7, h: 0.75, fontSize: 15, color: HEX.grey, valign: 'middle' });
    }
    const probs = [[fa.FaMagnifyingGlass, HEX.purple, "Can't find it", 'Relevant local issues are hard to find. Council news arrives by mail and flyers, but newer residents live on Instagram (Theme 5).'],
      [fa.FaLanguage, HEX.orange, "Can't understand it", 'Translated materials still use policy terms people don\'t understand (Theme 1).'],
      [fa.FaPaperPlane, HEX.teal, 'No idea what happens', 'People don\'t know which department to contact or whether their feedback was heard (Theme 4).']];
    for (let i = 0; i < 3; i++) {
      const x = 0.6 + i * 4.1, y = 2.85;
      card(s, x, y, 3.8, 3.75, 'barrier card ' + (i + 1));
      await dot(s, x + 0.35, y + 0.35, 0.75, probs[i][1], probs[i][0], 'barrier ' + (i + 1));
      txt(s, probs[i][2], { x: x + 0.35, y: y + 1.3, w: 3.1, h: 0.5, fontSize: 22, bold: true, color: C.text2 });
      txt(s, probs[i][3], { x: x + 0.35, y: y + 1.9, w: 3.1, h: 1.6, fontSize: 15, color: C.text1 });
    }
    s.addNotes("Melbourne's councils make decisions about parks, housing and transport. Our fieldwork with eight international residents found the barrier isn't a lack of interest. People can't find relevant information. Translated policies still use terms they don't understand. And they don't know where their feedback goes. Meanwhile, council news arrives by mail and flyers, but newer residents live on Instagram.");
  }

  // ================================================================ 3 Persona
  {
    const s = pres.addSlide({ masterName: 'LILAC', sectionTitle: 'Problem and persona' });
    s.addText('Meet Jason: he wants to be heard', { placeholder: 'title' });
    await fit(s, IMG('persona'), 0.6, 1.4, 6.2, 5.4, 'Persona card for Jason Lee', 'l');
    await fit(s, IMG('jason_walk'), 7.0, 1.5, 3.2, 3.6, 'Jason walking his dog');
    card(s, 7.0, 5.15, 5.7, 1.65, 'scenario card');
    txt(s, [{ text: 'Scenario (fictional): ', options: { bold: true, color: HEX.red } }, { text: 'Saturday, 8 am. A new park rule says dogs must be on a leash 7–10 am on weekends. Jason disagrees, but doesn\'t know who to tell or which words to use.' }],
      { x: 7.25, y: 5.3, w: 5.2, h: 1.35, fontSize: 15, valign: 'middle' });
    txt(s, [{ text: 'Mainly uses', options: { bold: true, color: HEX.purple, breakLine: true } }, { text: 'Speak to Spud + issue tracker' }], { x: 10.3, y: 2.3, w: 2.4, h: 1.0, fontSize: 16 });
    txt(s, [{ text: 'Based on', options: { bold: true, color: HEX.purple, breakLine: true } }, { text: 'immigrant interviewees, incl. P4 (dog owner, park rules changed)' }], { x: 10.3, y: 3.5, w: 2.4, h: 1.3, fontSize: 14 });
    s.addNotes("Meet Jason. He's 34, has lived in Melbourne for eight years, and English isn't his first language. He's unhappy about a new park rule for dogs, yet he doesn't know who to tell, or which words to use. The park rule is a fictional example.");
  }

  // ================================================================ 4 Meet HearHere
  pres.addSection({ title: 'The concept' });
  {
    const s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'The concept' });
    s.addText('Meet HearHere and Spud', { placeholder: 'title' });
    await fit(s, IMG('product'), 0.6, 1.35, 12.1, 5.0, 'Labelled HearHere post and Spud from four sides');
    txt(s, 'A 130 cm post for footpaths, library entrances and streets near campus. The four views are redrawn from our concept sketch.', { x: 0.6, y: 6.4, w: 12.1, h: 0.45, fontSize: 15, color: HEX.grey });
    s.addNotes('The post has four parts: Spud, the mascot you talk to; a touchscreen listing nearby issues; an NFC pad that hands the issue to your phone; and a pillar showing verified council and community notices.');
  }

  // ================================================================ 5 Scenario flow
  {
    const s = pres.addSlide({ masterName: 'LILAC', sectionTitle: 'The concept' });
    s.addText("Jason's Saturday morning, step by step", { placeholder: 'title' });
    const steps = [['scr_list', 'Discover', 'Nearby issues, ranked by distance and closing date'], ['scr_detail', 'Understand', 'Plain-language summary in his language, key terms explained'],
      ['scr_listen', 'Speak', 'Talks to Spud in Mandarin'], ['scr_comment', 'Confirm', 'AI writes the English comment and names the department'], ['phone_tracker', 'Save & track', 'NFC tap to his phone, then follow each stage']];
    for (let i = 0; i < 5; i++) {
      const x = 0.6 + i * 2.48, w = 2.25;
      card(s, x, 1.45, w, 3.55, 'step card ' + (i + 1));
      s.addShape(pres.shapes.OVAL, { x: x + 0.2, y: 1.65, w: 0.5, h: 0.5, fill: { color: HEX.orange }, line: { color: HEX.orange, width: 0 }, objectName: 'step number ' + (i + 1) });
      txt(s, String(i + 1), { x: x + 0.2, y: 1.65, w: 0.5, h: 0.5, fontSize: 18, bold: true, color: C.background1, align: 'center', valign: 'middle' });
      txt(s, steps[i][1], { x: x + 0.8, y: 1.65, w: w - 0.9, h: 0.5, fontSize: 18, bold: true, color: C.text2, valign: 'middle' });
      await fit(s, IMG(steps[i][0]), x + 0.12, 2.3, w - 0.24, 1.55, 'step image ' + steps[i][1]);
      txt(s, steps[i][2], { x: x + 0.2, y: 3.95, w: w - 0.4, h: 0.95, fontSize: 13, color: C.text1 });
      if (i < 4) txt(s, '›', { x: x + w - 0.02, y: 2.85, w: 0.25, h: 0.5, fontSize: 28, bold: true, color: HEX.purple, align: 'center', valign: 'middle' });
    }
    card(s, 0.6, 5.3, 12.1, 1.45, 'what Jason says card');
    await dot(s, 0.9, 5.65, 0.75, HEX.purple, fa.FaMicrophone, 'Jason speaks');
    txt(s, [{ text: '新的公園規定讓遛狗變得很不方便，我希望可以重新考慮。', options: { bold: true, breakLine: true, fontSize: 18 } },
      { text: '"The new park rule makes walking my dog really inconvenient. I hope it can be reconsidered."  →  sent to Parks & Open Space', options: { color: HEX.grey } }],
      { x: 1.9, y: 5.4, w: 10.6, h: 1.25, fontSize: 15, valign: 'middle' });
    s.addNotes("Saturday, 8 a.m. Jason walks his dog past a HearHere post. The screen under Spud lists nearby issues by distance, including a new rule for the park next door. Jason taps the park issue. A plain-language summary appears in his own language, with difficult terms explained. Now he simply talks to Spud, in his own language. Spud turns it into a clear English comment, names the responsible department, and lets Jason edit before sending. No audio is stored.");
  }

  // ================================================================ 6 Understand & speak
  {
    const s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'The concept' });
    s.addText('Understand it, then say it in your own words', { placeholder: 'title' });
    await fit(s, IMG('scr_detail'), 0.6, 1.4, 6.3, 3.95, 'Plain-language summary screen');
    await fit(s, IMG('scr_comment'), 6.4, 3.0, 6.3, 3.95, 'Structured comment screen');
    const pts = [[fa.FaLanguage, HEX.orange, 'Plain-language summaries', 'Policy text rewritten simply, with key terms explained (R1).'],
      [fa.FaMicrophone, HEX.purple, 'Speak to Spud', 'Residents speak in their own language; typing is an alternative (R8).'],
      [fa.FaPenToSquare, HEX.teal, 'Review before sending', 'Original + English side by side, with the responsible department (R4).']];
    for (let i = 0; i < 3; i++) {
      const y = 5.45 + i * 0.52;
      await dot(s, 0.6, y, 0.42, pts[i][1], pts[i][0], 'point ' + (i + 1));
      txt(s, [{ text: pts[i][2] + ': ', options: { bold: true } }, { text: pts[i][3] }], { x: 1.15, y, w: 5.2, h: 0.42, fontSize: 14, valign: 'middle' });
    }
    txt(s, 'Content shown is a fictional example', { x: 6.4, y: 1.55, w: 6.3, h: 0.35, fontSize: 12, italic: true, color: HEX.red, align: 'right' });
    s.addNotes('The summary is in Traditional Chinese for Jason. He taps "Talk to Spud", says what he thinks in Mandarin, and Spud structures it into an English comment addressed to Parks and Open Space. He can edit it before confirming. No audio is stored on the post.');
  }

  // ================================================================ 7 NFC, tracker, badges
  {
    const s = pres.addSlide({ masterName: 'LILAC', sectionTitle: 'The concept' });
    s.addText('Take it home, track it, collect badges', { placeholder: 'title' });
    await fit(s, IMG('nfc_tap'), 0.5, 1.35, 2.9, 4.4, 'Phone tapping the NFC pad');
    await fit(s, IMG('phone_tracker'), 3.5, 1.35, 2.6, 4.4, 'Tracker in the HearHere app');
    await fit(s, IMG('outcomes'), 6.4, 1.35, 3.1, 2.1, 'Outcome examples');
    await fit(s, IMG('badges'), 9.7, 1.35, 3.1, 2.8, 'Badge collection');
    const items = [[fa.FaLock, HEX.teal, 'NFC hand-off', 'The post keeps nothing; tracking starts only if Jason opts in (R6).'],
      [fa.FaListCheck, HEX.purple, 'Progress tracker', 'Received → In review → Outcome, with a case number or reasons (R5).'],
      [fa.FaMedal, HEX.orange, 'Badges', 'One badge per post visited, stored only on the phone, to encourage return visits.']];
    for (let i = 0; i < 3; i++) {
      const x = 0.6 + i * 4.1;
      card(s, x, 5.85, 3.85, 1.0, 'feature card ' + (i + 1));
      await dot(s, x + 0.2, 6.1, 0.5, items[i][1], items[i][0], items[i][2]);
      txt(s, [{ text: items[i][2], options: { bold: true, breakLine: true } }, { text: items[i][3], options: { fontSize: 12 } }], { x: x + 0.85, y: 5.92, w: 2.9, h: 0.88, fontSize: 15, valign: 'middle' });
    }
    txt(s, 'Status of the issue, not a promise the comment is accepted', { x: 6.4, y: 3.55, w: 3.1, h: 0.7, fontSize: 12, italic: true, color: HEX.grey });
    s.addNotes("Jason taps his phone on the NFC pad. The issue and his comment move to the HearHere app, and the post keeps nothing. Tracking begins only because Jason chose it. The app shows each stage: Received, In review, then an outcome with a case number, or reasons if declined. Notifications keep him updated. Each new HearHere post Jason visits also earns a badge: a small reward for taking part.");
  }

  // ================================================================ 8 How it works
  {
    const s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'The concept' });
    s.addText('One post, three connected channels', { placeholder: 'title' });
    await fit(s, IMG('channels_cards'), 0.6, 1.5, 12.1, 3.0, 'Official social media, AI agent and app cards');
    for (const x of [4.21, 8.26]) txt(s, '+', { x, y: 2.73, w: 0.4, h: 0.6, fontSize: 36, bold: true, color: HEX.purple, align: 'center', valign: 'middle' });
    card(s, 0.6, 4.85, 7.6, 1.85, 'theme 5 card', 'FFF3E6');
    await dot(s, 0.85, 5.1, 0.6, HEX.orange, fa.FaGlobe, 'theme 5');
    txt(s, [{ text: 'Responds to Theme 5', options: { bold: true, breakLine: true } }, { text: 'Council news goes out by mail and flyers, but newer residents rely on Instagram and friends. HearHere meets them on the channels they already use.' }],
      { x: 1.65, y: 5.0, w: 6.35, h: 1.6, fontSize: 15, valign: 'middle' });
    card(s, 8.5, 4.85, 4.2, 1.85, 'verified card', 'E8F4F6');
    txt(s, [{ text: 'Verified content only', options: { bold: true, breakLine: true, color: HEX.teal } }, { text: 'Spud\'s official account posts only verified council content, so fake accounts are easy to spot.' }],
      { x: 8.75, y: 5.0, w: 3.75, h: 1.6, fontSize: 15, valign: 'middle' });
    s.addNotes("How does it all fit together? Spud's official social media account shares only verified council posts, reaching residents where they already scroll. An AI agent answers questions from official documents and hands over to a named contact when unsure, and the HearHere app tracks each issue.");
  }

  // ================================================================ 9 Requirements map
  pres.addSection({ title: 'Why it works' });
  {
    const s = pres.addSlide({ masterName: 'LILAC', sectionTitle: 'Why it works' });
    s.addText('Every feature maps to a fieldwork requirement', { placeholder: 'title' });
    const H = (t) => ({ text: t, options: { bold: true, color: 'FFFFFF', fill: { color: HEX.plum } } });
    const rows = [[H('Requirement'), H('HearHere feature'), H('Fieldwork evidence')],
      ['R1 Multilingual', 'Plain-language summaries, speak in any language', 'Theme 1: translation alone doesn\'t explain terms (P3, P8)'],
      ['R2 Personal relevance', 'Issues ranked by distance and closing date', 'Theme 3: people engage when it affects them (P1, P2, P7)'],
      ['R3 Visibility', 'Post on everyday routes; official social account', 'Theme 5: mail and flyers miss newer residents (P5, P7)'],
      ['R4 Q&A support', 'AI agent with cited sources; names the department', 'Theme 4: unsure who to contact (P4)'],
      ['R5 Trackable', 'Received → In review → Outcome tracker', 'Theme 4: feedback felt ignored (P4, P6)'],
      ['R6 Privacy', 'No audio or records kept on the post; opt-in tracking', 'Speaking in public may feel exposing'],
      ['R7 Trustworthy', 'Verified content only; sources shown', 'Misinformation and impersonation risk'],
      ['R8 Simple', 'Speak instead of type; one tap to save', 'Limited time (Theme 2)']];
    s.addTable(rows, { x: 0.6, y: 1.4, w: 12.1, colW: [2.6, 4.75, 4.75], fontSize: 13, color: '241A33', fill: { color: 'FFFFFF' }, border: { type: 'solid', color: 'E4DCEB', pt: 0.75 }, rowH: 0.56, valign: 'middle', margin: [0.04, 0.12, 0.04, 0.12] });
    s.addNotes('Each feature responds to one of the eight requirements from our fieldwork report.');
  }

  // ================================================================ 10 Benefits
  {
    const s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Why it works' });
    s.addText('What HearHere changes for Jason', { placeholder: 'title' });
    const cols = [['Before', HEX.red, 'FDECEA', ['Never sees the park consultation', 'Policy terms are confusing', "Doesn't know which department to ask", 'Emails a general inbox and hears nothing']],
      ['With HearHere', HEX.teal, 'E8F4F6', ['Finds it on his usual walk', 'Reads a summary in his own language', 'Spud names Parks & Open Space for him', 'Sees each stage of the issue, and when it changes']]];
    for (let i = 0; i < 2; i++) {
      const x = 0.6 + i * 4.3;
      card(s, x, 1.45, 4.0, 5.3, cols[i][0] + ' card', cols[i][2]);
      txt(s, cols[i][0], { x: x + 0.35, y: 1.7, w: 3.3, h: 0.55, fontSize: 24, bold: true, color: cols[i][1] });
      txt(s, cols[i][3].map((t, k) => ({ text: t, options: { bullet: true, breakLine: k < 3 } })), { x: x + 0.35, y: 2.4, w: 3.35, h: 3.9, fontSize: 16, paraSpaceAfter: 10 });
    }
    await fit(s, IMG('jason_walk'), 9.2, 1.4, 3.5, 3.9, 'Jason with his dog');
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 9.2, y: 5.6, w: 3.5, h: 0.75, rectRadius: 0.37, fill: { color: HEX.purple }, line: { color: HEX.purple, width: 0 }, objectName: 'no meeting pill' });
    txt(s, 'No meeting needed', { x: 9.2, y: 5.6, w: 3.5, h: 0.75, fontSize: 20, bold: true, color: C.background1, align: 'center', valign: 'middle' });
    s.addNotes('For Jason, that means relevant issues on his route, in his own language, a clear department to hear him, and visible progress. All without attending a meeting.');
  }

  // ================================================================ 11 Ethics
  pres.addSection({ title: 'Reflection' });
  {
    const s = pres.addSlide({ masterName: 'LILAC', sectionTitle: 'Reflection' });
    s.addText('Ethical risks we designed for', { placeholder: 'title' });
    const risks = [[fa.FaUserShield, HEX.purple, 'Privacy in public', 'Speaking aloud may expose someone\'s background.', 'No recordings kept; typed input; anonymous option'],
      [fa.FaRobot, HEX.orange, 'AI accuracy', 'Translations or summaries can change meaning.', 'Review and edit before sending; sources cited; human hand-over'],
      [fa.FaTriangleExclamation, HEX.red, 'Misuse and impersonation', 'Fake QR/NFC stickers, fake Spud accounts, spam.', 'Verified official account; rate limits; regular inspection'],
      [fa.FaMedal, HEX.teal, 'Badges and representation', 'Badges could be farmed; feedback isn\'t a vote.', 'One badge per post; stored on phone; labelled as feedback, not polling']];
    for (let i = 0; i < 4; i++) {
      const x = 0.6 + (i % 2) * 6.15, y = 1.45 + Math.floor(i / 2) * 2.7;
      card(s, x, y, 5.95, 2.5, risks[i][2] + ' card');
      await dot(s, x + 0.3, y + 0.3, 0.7, risks[i][1], risks[i][0], risks[i][2]);
      txt(s, risks[i][2], { x: x + 1.2, y: y + 0.3, w: 4.5, h: 0.5, fontSize: 20, bold: true, color: C.text2 });
      txt(s, risks[i][3], { x: x + 1.2, y: y + 0.85, w: 4.5, h: 0.6, fontSize: 15 });
      txt(s, [{ text: 'Mitigation: ', options: { bold: true, color: HEX.teal } }, { text: risks[i][4] }], { x: x + 1.2, y: y + 1.5, w: 4.5, h: 0.8, fontSize: 14 });
    }
    s.addNotes('HearHere has limits. Speaking in public may feel exposing, AI can mistranslate, and our fieldwork did not include council staff.');
  }

  // ================================================================ 12 Next steps
  {
    const s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Reflection' });
    s.addText('Next: test a low-fidelity prototype', { placeholder: 'title' });
    const steps = [[fa.FaBoxOpen, 'Build', 'Figma app prototype + cardboard post'], [fa.FaUsers, 'Test', 'Think-aloud tasks with 5–8 residents across language backgrounds'], [fa.FaLocationDot, 'Pilot', '2–3 sites: library entrance, street near campus']];
    for (let i = 0; i < 3; i++) {
      const y = 1.5 + i * 1.6;
      await dot(s, 0.6, y, 0.9, [HEX.purple, HEX.orange, HEX.teal][i], steps[i][0], steps[i][1]);
      txt(s, [{ text: steps[i][1], options: { bold: true, fontSize: 22, color: C.text2, breakLine: true } }, { text: steps[i][2] }], { x: 1.75, y: y - 0.05, w: 4.2, h: 1.1, fontSize: 15, valign: 'middle' });
    }
    card(s, 6.4, 1.45, 6.3, 5.3, 'evaluation questions card', 'F4EEF8');
    txt(s, 'Questions for the evaluation', { x: 6.75, y: 1.7, w: 5.7, h: 0.5, fontSize: 22, bold: true, color: C.text2 });
    const qs = ['Can first-time users find an issue and give feedback in their own language?', 'Are people comfortable speaking to Spud in public?', 'Do bilingual reviewers agree the AI kept the meaning?', 'Do users understand that tracking is optional?', 'Do badges bring people back, or only encourage tapping?', 'Do the tracker stages match real council processes? (council staff)'];
    txt(s, qs.map((t, k) => ({ text: t, options: { bullet: true, breakLine: k < qs.length - 1 } })), { x: 6.75, y: 2.35, w: 5.7, h: 4.2, fontSize: 15, paraSpaceAfter: 8 });
    s.addNotes("Next, we'll test a low-fidelity prototype with residents across languages, and check whether they trust and correct the AI's output.");
  }

  // ================================================================ 13 Closing
  pres.addSection({ title: 'Close' });
  {
    const s = pres.addSlide({ masterName: 'DARK', sectionTitle: 'Close' });
    txt(s, [{ text: 'Hear', options: { color: C.background1 } }, { text: 'Here', options: { color: HEX.orange } }], { x: 0.8, y: 1.1, w: 7, h: 1.3, fontSize: 80, bold: true, valign: 'middle' });
    txt(s, 'with Spud: Street Post for Understanding Decisions', { x: 0.8, y: 2.45, w: 7, h: 0.5, fontSize: 20, color: 'E9E1F2' });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.8, y: 3.3, w: 5.0, h: 0.75, rectRadius: 0.37, fill: { color: HEX.orange }, line: { color: HEX.orange, width: 0 }, objectName: 'closing tagline pill' });
    txt(s, 'Speak here. Be heard.', { x: 0.8, y: 3.3, w: 5.0, h: 0.75, fontSize: 28, bold: true, color: C.background1, align: 'center', valign: 'middle' });
    txt(s, [{ text: 'Concept video: ', options: { bold: true, color: HEX.orange } }, { text: '[add video link]', options: { color: 'E9E1F2' } }], { x: 0.8, y: 4.5, w: 7, h: 0.45, fontSize: 16 });
    txt(s, [{ text: 'Jia-Ying Lee 1790130   ·   Xintong Fu 1840227', options: { breakLine: true } }, { text: 'Yu-Hao Lu 1781474   ·   Yen-Chu Ou Yang 1801365' }], { x: 0.8, y: 5.3, w: 7.2, h: 0.85, fontSize: 15, color: 'B9AECB' });
    txt(s, 'The scenario and park rule are fictional examples. Narration in the video is AI-generated.', { x: 0.8, y: 6.55, w: 7.2, h: 0.4, fontSize: 11, color: '9C92B0' });
    await fit(s, IMG('ending'), 7.9, 0.9, 5.0, 5.9, 'Jason waving to Spud');
    s.addNotes('HearHere, with Spud: the Street Post for Understanding Decisions. Speak here. Be heard!');
  }

  await pres.writeFile({ fileName: 'HearHere_concept_deck.pptx' });
  await applyTheme('HearHere_concept_deck.pptx', THEME);
  console.log('written');
})();
