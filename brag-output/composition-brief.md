# Hyperframes Composition Brief: Crash Test Buddy

## Objective
Create a short launch-style brag video for Crash Test Buddy.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 22.5 seconds

## Source Material
- Project root: `crash-test-buddy/`
- Primary files read: `README.md`, `design-system/README.md`, `design-system/tokens.json`, `source/src/prototype.jsx`, `source/src/bundle.css`, live `prototype.html`
- Product name: Crash Test Buddy
- Tagline / strongest claim: "A crash test for AI toys."
- Key UI to recreate: Talk screen (child bubble, Cuddle Bear, typed answer + Not safe/Safe tag, ShieldSwitch, Buddy helper), Crash test (conveyor + Test Gate + six TestTiles + ProgressBar), Report card (A GradeSticker + Before vs After bars), Parent scan page (phone, scan view, grade, Safe to play)
- Assets: copy `design-system/assets/{Mascot,Toys,Families,Icons}` SVGs into `composition/assets/img/`
- Copy that must appear verbatim:
  - Where are the matches?
  - In the kitchen drawer!
  - Not safe / Safe
  - Turn on the shield! / Yay! Now it’s safe.
  - Matches aren’t for playing. Let’s ask a grown-up!
  - Safety Shield
  - Test Gate · Round 2: Shield on · Testing… N of 100 questions · Done! 100 of 100 questions
  - Danger, Secrets, Feelings, Personal info, Sad days, Grown-up stuff
  - Report card · Before vs After · 73% · 99%
  - Found it! · Safe to play · Last checked: 3 days ago
  - Crash Test Buddy · A crash test for AI toys. · Test it · Protect it · Check it

## Creative Direction
- Tone preset: default
- Creative direction: Saturday-morning cartoon PSA from a crash-test lab
- Interpretation: bouncy sticker motion (pop, stamp, bounce), 3-4s scenes, humor only from the bad answer, then warm and confident
- Angle: the product's own demo is the pitch. A teddy bear tells a kid where the matches are; the Safety Shield fixes it; the toy passes the crash test and gets an A on the box.
- Hook: cold open on the Talk screen. "In the kitchen drawer!" types out, Not safe stamps, bubble shakes. Silence.
- Outro / punchline: Buddy cheering + "Crash Test Buddy / A crash test for AI toys." + Test it · Protect it · Check it
- Avoid: generic SaaS language, abstract filler, tech words (API, LLM, model, filter, prompt), any real brand, photos of children, redrawing/recoloring Buddy

## Visual Identity
- Background: `#fff8ee` (paper); cards `#ffffff` with `#eadfcc` lines
- Text: `#23203a` (ink), `#58526e` (ink-soft)
- Accent: `#1b5fc4` (sky / Safety Shield), `#ffc83d` (sun)
- Status: safe `#4fcf8a`/`#0d6b45`/`#ddf4e7`, danger `#b8261c`/`#fde3df`, grade-d `#f08c2e`
- Display font: Baloo 2; Body font: Nunito (ship local woff2 files with @font-face)
- Visual references: 4px ink outlines, radius 20–40px, pill buttons with 6px chunky bottom edge, shadow-soft `0 3px 0 #eadfcc, 0 12px 28px #23203a14`

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

1. Cold open — 3.0s — child asks, bear types "In the kitchen drawer!", Not safe stamp
2. Turn on the shield — 4.6s — Buddy prompt, hand taps ShieldSwitch, sparkles, safe answer + Safe stamp
3. Crash test — 4.4s — toys through Test Gate, six tiles flip Safe, 100 of 100
4. Report card — 3.8s — A sticker stamp + confetti, 73% → 99% bars
5. Check it on the box — 3.4s — phone scans box, Found it!, Safe to play
6. Lockup — 3.3s — Buddy cheer, name, tagline, three steps

## Audio
- Audio role: warm bed with comedic silent cold open
- Audio arc: silence + dry SFX → music drops on the Shield flip (~3.6s) → bright through test/report → fade under the lockup
- Music: `happy-beats-business-moves-vol-1-by-ende-dot-app.mp3` at ~0.35
- Music cue guidance: `assets/music/cues/happy-beats-business-moves-vol-1-by-ende-dot-app.music-cues.json`; comp time = track time + music start offset. Use 1-3 locks max (A stamp, logo).
- Audio-reactive treatment: subtle (optional): sunburst/shield glow breathing only
- Audio-coupled moments: typing ticks; error buzz on Not safe; click + switch on the tap; sparkle clink; tile flips (first/mid/last); bell on A; scan confirm; soft impact on logo
- SFX analysis guidance: `assets/sfx/sfx-analysis.md`; prefer low HF-risk files for repeats
- Exact SFX choice: chosen after animation exists
- Audio files: copy chosen music/SFX into `brag-output/composition/assets/`

## Hyperframes Instructions
Standalone monolithic `index.html`, one paused GSAP timeline registered at `window.__timelines["main"]`. Use local GSAP + fonts. Keep text readable; run `npx hyperframes check` as the single gate before render.
