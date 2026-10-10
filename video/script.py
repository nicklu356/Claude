"""Single source of truth for narration lines, subtitles and SFX events.

Each line: id, voice role, tts text (what the TTS engine reads),
sub text (what appears on screen / in the .srt).
"""
import json, pathlib

NARR = "narrator"
JASON = "jason"

SCENES = [
    # 1 Title
    {"id": 1, "name": "Title", "lines": [
        ("s1a", NARR, "Hi, Melbourne!", None),
        ("s1b", NARR, "We're Group 14, Team Sweet Potatoes, and this is Potato, the Public Opinion Translation And Tracking Outpost.",
         "We're Group 14, Team Sweet Potatoes, and this is POTATO — the Public Opinion Translation And Tracking Outpost."),
        ("s1c", NARR, "Why potato?", "Why POTATO?"),
        ("s1d", NARR, "Because, like a sweet potato, good ideas grow from the ground up.", None),
    ]},
    # 2 Problem
    {"id": 2, "name": "Problem", "lines": [
        ("s2a", NARR, "Melbourne's councils make decisions about parks, housing and transport.", None),
        ("s2b", NARR, "Our fieldwork with eight international residents found the barrier isn't a lack of interest.", None),
        ("s2c", NARR, "People can't find relevant information.", None),
        ("s2d", NARR, "Translated policies still use terms they don't understand.", None),
        ("s2e", NARR, "And they don't know where their feedback goes.", None),
        ("s2f", NARR, "Meanwhile, council news arrives by mail and flyers, but newer residents live on Instagram.", None),
    ]},
    # 3 Persona
    {"id": 3, "name": "Persona", "lines": [
        ("s3a", NARR, "Meet Jason.", None),
        ("s3b", NARR, "He's lived in Melbourne for years, but English isn't his first language.", None),
        ("s3c", NARR, "He's unhappy about a new park rule for dogs, yet he doesn't know who to tell, or which words to use.", None),
    ]},
    # 4 Discover
    {"id": 4, "name": "Discover", "lines": [
        ("s4a", NARR, "On his grocery walk, Jason passes a Potato post.", "On his grocery walk, Jason passes a POTATO post."),
        ("s4b", NARR, "Its screen shows verified council and community notices, so he finds things he'd never see in the mail.", None),
        ("s4c", NARR, "Then Spud, our mascot, greets him and lists the issues closest to this spot, ranked by distance and closing date.", None),
    ]},
    # 5 Understand + speak
    {"id": 5, "name": "Understand & speak", "lines": [
        ("s5a", NARR, "Jason taps the park issue.", None),
        ("s5b", NARR, "A plain-language summary appears in his own language, with difficult terms explained.", None),
        ("s5c", NARR, "Now he simply talks to Spud, in his own language.", None),
        ("s5j", JASON, "新的公園規定讓遛狗變得很不方便，我希望可以重新考慮。",
         "The new park rule makes walking my dog really inconvenient. I hope it can be reconsidered."),
        ("s5d", NARR, "Spud turns that into a structured comment, original Chinese plus English, names the responsible department, and lets Jason review and edit before sending.", None),
        ("s5e", NARR, "No audio is stored.", None),
    ]},
    # 6 NFC + tracker
    {"id": 6, "name": "NFC & tracking", "lines": [
        ("s6a", NARR, "Jason taps his phone on the N F C pad.", "Jason taps his phone on the NFC pad."),
        ("s6b", NARR, "The issue and his comment move to the Potato app, and the post keeps nothing.",
         "The issue and his comment move to the POTATO app, and the post keeps nothing."),
        ("s6c", NARR, "Tracking begins only because Jason chose it.", None),
        ("s6d", NARR, "The app shows each stage: Received, In review, then an outcome with a case number, or reasons if declined.", None),
        ("s6e", NARR, "Notifications keep him updated.", None),
    ]},
    # 7 Q&A + share
    {"id": 7, "name": "Q&A & share", "lines": [
        ("s7a", NARR, "Not sure who to ask?", None),
        ("s7b", NARR, "The Q and A assistant answers from official documents, cites its sources, and hands over to a named contact when it's unsure.",
         "The Q&A assistant answers from official documents, cites its sources, and hands over to a named contact when it's unsure."),
        ("s7c", NARR, "And one tap shares a card on Instagram, so Jason's neighbours can join in.", None),
    ]},
    # 8 Benefits
    {"id": 8, "name": "Benefits", "lines": [
        ("s8a", NARR, "For Jason, that means finding relevant issues on his everyday route, understanding them in his own language, knowing which department hears him, and seeing what happens next.", None),
        ("s8b", NARR, "All without attending a meeting.", None),
    ]},
    # 9 Limitations / future
    {"id": 9, "name": "Limits & next steps", "lines": [
        ("s9a", NARR, "Potato has limits.", "POTATO has limits."),
        ("s9b", NARR, "Speaking in public may feel exposing, AI can mistranslate, and our fieldwork didn't include council staff.", None),
        ("s9c", NARR, "Next, we'll test a low-fidelity prototype with residents across languages, and check whether they trust and correct the AI's output.", None),
    ]},
    # 10 Tagline
    {"id": 10, "name": "Tagline", "tail": 2.8, "lines": [
        ("s10a", NARR, "Potato: Public Opinion Translation And Tracking Outpost.",
         "POTATO: Public Opinion Translation And Tracking Outpost."),
        ("s10b", NARR, "Voices from the ground up.", None),
    ]},
]

# Sound effects, positioned relative to a line start (or scene start "@").
# (name, anchor line id or "@<scene>", offset seconds)
SFX = [
    ("whoosh", "@1", 0.05), ("chirp", "s1a", 0.10), ("pop", "s1b", 1.2),
    ("whoosh", "@2", 0.0), ("pop", "s2c", 0.0), ("pop", "s2d", 0.0), ("pop", "s2e", 0.0), ("whoosh", "s2f", 0.0),
    ("whoosh", "@3", 0.0), ("pop", "s3c", 0.6),
    ("whoosh", "@4", 0.0), ("chirp", "s4c", 0.15), ("pop", "s4c", 2.4),
    ("tap", "s5a", 0.55), ("pop", "s5b", 1.6), ("chirp", "s5c", 0.6), ("pop", "s5d", 0.1), ("tap", "s5e", 0.2),
    ("tap", "s6a", 1.25), ("chime", "s6a", 1.3), ("whoosh", "s6c", 0.0), ("tap", "s6c", 0.9), ("pop", "s6d", 0.9),
    ("pop", "s6d", 2.6), ("pop", "s6d", 4.4), ("chime", "s6e", 0.15),
    ("whoosh", "@7", 0.0), ("pop", "s7b", 1.5), ("chirp", "s7b", 0.4), ("tap", "s7c", 1.1), ("chime", "s7c", 1.2), ("whoosh", "s7c", 3.4),
    ("whoosh", "@8", 0.0), ("pop", "s8a", 0.3), ("pop", "s8a", 3.3), ("pop", "s8a", 6.0), ("pop", "s8a", 8.6),
    ("whoosh", "@9", 0.0), ("whoosh", "@10", 0.0), ("chirp", "s10b", 0.3),
]

GAP = 0.22        # natural pause between sentences (150-300 ms)
LEAD_IN = 0.4
TAIL = 0.3


def to_json():
    out = {"scenes": [], "sfx": SFX, "gap": GAP, "lead_in": LEAD_IN, "tail": TAIL}
    for sc in SCENES:
        out["scenes"].append({
            "id": sc["id"], "name": sc["name"], "tail": sc.get("tail"),
            "lines": [{"id": i, "voice": v, "tts": t, "sub": s or t} for (i, v, t, s) in sc["lines"]],
        })
    return out


if __name__ == "__main__":
    p = pathlib.Path(__file__).with_name("script.json")
    p.write_text(json.dumps(to_json(), ensure_ascii=False, indent=1))
    print("wrote", p)
