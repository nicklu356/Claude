// Video script as a Word document: structure overview + every narration line with
// its timecode, speaker and what is on screen.  Timecodes come from web/timeline.json.
// Build: cd video/deck && node build_script_doc.js   -> output/HearHere_video_script.docx
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType,
  HeadingLevel, AlignmentType, BorderStyle, PageOrientation, Footer, PageNumber,
} = require('docx');

const tl = JSON.parse(fs.readFileSync(path.join(__dirname, '../web/timeline.json'), 'utf8'));
const OUT = path.resolve(__dirname, '../../output/HearHere_video_script.docx');
const tc = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

// what the viewer sees while each line plays
const VIS = {
  s1a: 'Team card: Team Sweet Potatoes, Group 14, INFO90006; the four members and student IDs appear.',
  s1b: 'Research question card: "How do international residents in Melbourne take part in local council decisions?"',
  s2a: 'Title "Five problems from our fieldwork"; chips: 8 interviews, 4 observation sites, 5 themes.',
  s2b: 'Card 1 (Theme 1, Language): translated, but still hard to understand.',
  s2c: 'Card 2 (Theme 2, Time & distance): hard to attend in person.',
  s2d: 'Card 3 (Theme 3, Relevance): only joins when it feels personal.',
  s2e: 'Card 4 (Theme 4, Communication): who do I contact? Was I heard?',
  s2f: 'Card 5 (Theme 5, Channels): mail and flyers vs Instagram.',
  s3a: 'Persona card, large and centred: photo, 34, immigrant, 8 years in Melbourne, quote, pain point, goal, mainly uses Speak to Spud + issue tracker.',
  s3b: 'Persona card docks top-right; Jason walks in with his dog.',
  s3c: '"Saturday · 8:00 am" chip; park sign "New park rule: dogs on leash Sat–Sun 7–10 am", labelled FICTIONAL EXAMPLE.',
  s3d: 'Jason looks worried; thought bubble: "要找誰說？ Who do I tell? 該怎麼說？ Which words?"',
  i1: 'HearHere post appears. Cards: "Introducing HearHere"; "Physical information pillar" + "AI customised helper".',
  i2: 'Spud speaks (bubble "Hi there! I\'m Spud."); acronym card: Street Post for Understanding Decisions.',
  i3: 'Product views: callouts on the post (Spud, touchscreen, NFC pad, pillar) and Spud from four sides, with the concept sketches.',
  h2: 'Title "One post, three connected channels"; Official social media card (verified posts only); Theme 5 chip.',
  h3: 'AI agent card (answers from official documents, hands over to a person) + HearHere app card (tracker); concept-sketch thumbnail.',
  s4a: '"Saturday · 8:00 am"; Jason walks his dog along the street and stops at a HearHere post.',
  s4b: 'Zoom on the pillar: verified council, library and community notices; card "Verified notices only, no commercial ads".',
  s4s: 'Close-up of Spud, happy eyes; bubble "Hi! 你好！ I\'m all ears!"',
  s4c: 'Jason and the post on the left; the touchscreen enlarges on the right: issues ranked by distance and closing date (park rule marked Fictional).',
  s5a: 'Jason taps "Park rule changes".',
  s5b: 'Plain-language summary in Traditional Chinese; key term 無牽繩區 = off-leash area explained.',
  s5c: 'Jason taps "跟 Spud 說說你的想法"; the screen shows Spud listening.',
  s5j: 'Live transcript of Jason\'s words appears as he speaks.',
  s5d: 'Structured comment: original Chinese, English version, department (Parks & Open Space), Edit / Confirm buttons.',
  s5e: 'Card: "No audio is stored on the post".',
  s6a: 'Post on the left; Jason\'s phone comes in from the right and taps the NFC pad.',
  s6b: 'Post screen: "Nothing stored, session cleared"; phone: "Saved to HearHere".',
  s6c: 'Phone moves to the centre; "Track this issue" toggle switches on.',
  s6d: 'Tracker steps light up: Received → In review → Outcome; outcome cards (fictional examples), then a notification.',
  s6f: 'Badge card: "Badge unlocked! Riverside Park post · 3 of 24 collected"; badge collection grid.',
  s7c: 'Phone: "Share to Instagram"; a story card appears; neighbours\' avatars with hearts.',
  s8a: 'Title "What HearHere means for Jason"; four benefit cards with the requirements they meet (R1–R5).',
  s8b: 'Before / after: Confused, unheard → Confident, informed; "No meeting needed".',
  s9a: 'Card "HearHere has limits".',
  s9b: 'Limits and mitigations: speaking in public (typed input), AI mistranslation (review & edit), no council staff in fieldwork (consult council).',
  s9c: 'Card "Next steps": low-fidelity prototype, test across languages, 2–3 pilot sites.',
  s10a: 'Ending: HearHere wordmark and "with Spud: Street Post for Understanding Decisions"; Jason, his dog and the post.',
  s10b: 'Spud: "Speak here. Be heard!"; Jason waves; team names and IDs; credit line.',
};
const SPEAKER = { narrator: 'Narrator', spud: 'Spud', jason: 'Jason (Mandarin)' };
const PARTS = [
  ['1', 'Who we are', [1]],
  ['2', 'What we found: five problems', [2]],
  ['3', "Meet Jason: persona and scenario", [3]],
  ['4', 'Introducing HearHere', [12, 11]],
  ['5', 'Jason uses HearHere', [4, 5, 6, 7]],
  ['6', 'Benefits, limits and close', [8, 9, 10]],
];

const FONT = 'Calibri';
const PURPLE = '7B4B94', GREY = '5B5470', LIGHT = 'F4EEF8';
const border = { style: BorderStyle.SINGLE, size: 4, color: 'D9D2E3' };
const borders = { top: border, bottom: border, left: border, right: border };
const W = [900, 1300, 3900, 3900];   // DXA; A4 portrait content width = 11906 - 2 x 950
const TW = W.reduce((a, b) => a + b, 0);
const cell = (children, w, shade) => new TableCell({
  width: { size: w, type: WidthType.DXA }, borders, margins: { top: 80, bottom: 80, left: 100, right: 100 },
  shading: shade ? { type: ShadingType.CLEAR, color: 'auto', fill: shade } : undefined, children,
});
const p = (text, o = {}) => new Paragraph({ spacing: { after: o.after ?? 60 }, children: [new TextRun({ text, font: FONT, size: o.size ?? 20, bold: o.bold, italics: o.italics, color: o.color })] });

const scenes = Object.fromEntries(tl.scenes.map(s => [s.id, s]));
const body = [];
body.push(new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun({ text: 'HearHere: concept video script', font: FONT, bold: true, size: 48, color: PURPLE })] }));
body.push(p('INFO90006 Fieldwork for Design · Team Sweet Potatoes, Group 14', { size: 22, color: GREY }));
body.push(p('Jia-Ying Lee 1790130 · Xintong FU 1840227 · Yu-Hao LU 1781474 · Yen-Chu OU YANG 1801365', { size: 20, color: GREY }));
body.push(p(`Length ${tc(tl.duration)} · narration by AI voices (Kokoro TTS): narrator af_heart, Spud am_puck, Jason zm_yunxi (Mandarin). The park rule in the scenario is a fictional example.`, { size: 20, color: GREY, after: 200 }));

body.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: 'Structure', font: FONT, bold: true, size: 30, color: PURPLE })] }));
const SW = [700, 3600, 1500, 4200];
body.push(new Table({
  width: { size: SW.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: SW,
  rows: [
    new TableRow({ tableHeader: true, children: ['#', 'Part', 'Time', 'Purpose'].map((h, i) => cell([p(h, { bold: true, color: 'FFFFFF' })], SW[i], PURPLE)) }),
    ...PARTS.map(([n, name, ids]) => {
      const st = Math.min(...ids.map(i => scenes[i].start)), en = Math.max(...ids.map(i => scenes[i].end));
      const purpose = { 1: 'Introduce the team and the research question', 2: 'The five themes from our interviews and observations', 3: 'Persona (Jason) and the problem scenario', 4: 'The concept: physical information pillar + AI customised helper; Spud; product views; three connected channels', 5: 'Scenario walk-through: discover, understand, speak, NFC hand-off, tracking, badges, share', 6: 'Benefits for Jason, honest limitations, next steps, closing line' }[n];
      return new TableRow({ children: [cell([p(n)], SW[0]), cell([p(name, { bold: true })], SW[1]), cell([p(`${tc(st)} – ${tc(en)}`)], SW[2]), cell([p(purpose)], SW[3])] });
    }),
  ],
}));

for (const [n, name, ids] of PARTS) {
  body.push(new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 300 }, children: [new TextRun({ text: `${n}. ${name}`, font: FONT, bold: true, size: 30, color: PURPLE })] }));
  const rows = [new TableRow({ tableHeader: true, children: ['Time', 'Speaker', 'Line', 'On screen'].map((h, i) => cell([p(h, { bold: true, color: 'FFFFFF' })], W[i], PURPLE)) })];
  for (const id of ids) {
    const sc = scenes[id];
    rows.push(new TableRow({ cantSplit: true, children: [new TableCell({ columnSpan: 4, width: { size: TW, type: WidthType.DXA }, borders, margins: { top: 80, bottom: 80, left: 100, right: 100 }, shading: { type: ShadingType.CLEAR, color: 'auto', fill: LIGHT }, children: [p(`Scene: ${sc.name}`, { bold: true, color: PURPLE })] })] }));
    for (const l of sc.lines) {
      const line = l.voice === 'jason'
        ? [p(l.tts, { size: 20 }), p(`(English: ${l.sub})`, { italics: true, color: GREY, size: 18 })]
        : [p(l.sub)];
      rows.push(new TableRow({ cantSplit: true, children: [
        cell([p(tc(l.start))], W[0]), cell([p(SPEAKER[l.voice], { bold: l.voice !== 'narrator' })], W[1]),
        cell(line, W[2]), cell([p(VIS[l.id] || '', { color: GREY, size: 19 })], W[3]),
      ] }));
    }
  }
  body.push(new Table({ width: { size: TW, type: WidthType.DXA }, columnWidths: W, rows }));
}

const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: 20 } } } },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1000, bottom: 1000, left: 950, right: 950 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ children: ['Page ', PageNumber.CURRENT], font: FONT, size: 16, color: GREY })] })] }) },
    children: body,
  }],
});
Packer.toBuffer(doc).then(b => { fs.writeFileSync(OUT, b); console.log('wrote', OUT); });
