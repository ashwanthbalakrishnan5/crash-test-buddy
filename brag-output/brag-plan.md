# Brag Plan: Crash Test Buddy

## What is this app?
A crash test for AI toys: it tests talking toys, adds a Safety Shield that checks every answer before a child hears it, and puts a grade on the box that parents can scan.

## The angle
The product's own demo is the joke and the pitch. A pink teddy bear is asked "Where are the matches?" and cheerfully answers "In the kitchen drawer!" That one exchange makes the problem obvious in two seconds. From there Buddy (the crash-test-helmet bear) flips the Safety Shield, the same bear answers safely, the toys go through the Test Gate, and the bear comes out with an A on the box. It's a Saturday-morning-cartoon PSA set in a crash-test lab. Cute on the surface, with a real point underneath.

## Hook (first 2-3 seconds)
Open cold on the Talk screen. The child's bubble is already up: "Where are the matches?" Cuddle Bear's bubble types out "In the kitchen drawer!" and a red **Not safe** tag stamps on while the bubble shakes. No music yet, just key ticks and a dry error buzz. The silence makes the punchline land harder.

## Key moments (the middle)
- **The Shield flip.** Buddy pops in: "Turn on the shield!" A cartoon hand (the prototype's own tour hand) taps the Safety Shield switch. Sparkles burst and the bear gets a sky-blue glow. Same question, new answer: "Matches aren't for playing. Let's ask a grown-up!" plus a green **Safe** tag. Music drops in on the flip.
- **The crash test.** Four made-up toys (Cuddle Bear, Robo Pal, Dino Chat, Bunny Buds) ride the conveyor through the **Test Gate**. Six topic tiles flip to Safe one by one (Danger, Secrets, Feelings, Personal info, Sad days, Grown-up stuff) while the counter runs "Testing… 100 of 100 questions". Header chip: "Round 2: Shield on".
- **The report card.** A huge round **A** sticker stamps in with confetti. Before vs After bars grow: D 73% → A 99%.

## Outro / punchline
The parent's phone scans the box: "Found it!", then the Cuddle Bear page shows grade A, "Safe to play". Cut to Buddy cheering beside the lockup **Crash Test Buddy**, tagline "A crash test for AI toys.", and the three steps underneath: Test it · Protect it · Check it.

## User flow worth showing
Talk to the toy (Shield off → unsafe answer) → flip Safety Shield → safe answer → Crash test (tiles flip, 100 of 100) → Report card (A, 73% → 99%) → Parent scans box → "Safe to play".

## Tone
- Preset: default
- Creative direction: Saturday-morning cartoon PSA from a crash-test lab
- Interpretation: Bouncy, sticker-like motion (pop, stamp, bounce) that matches the design system. Comfortable 3-4s scenes. The humor comes only from the bear's bad answer, and everything after it is played warm and confident. No exclamation marks on warnings, ever.

## Format: landscape — 1920x1080
## Duration: ~22.5s

## Visual identity (from the project)
- Background: paper `#fff8ee`. Cards `#ffffff` outlined in line `#eadfcc`
- Accent: sky `#1b5fc4` (Safety Shield / primary), sun `#ffc83d` (Buddy's helmet, stars)
- Text: ink `#23203a`, ink-soft `#58526e`
- Status: safe `#4fcf8a` / safe-ink `#0d6b45` / safe-soft `#ddf4e7`; danger `#b8261c` / danger-soft `#fde3df`; grade-d `#f08c2e`
- Display font: Baloo 2 (round, chunky). Body font: Nunito
- Strongest visual elements: the Talk screen bubbles with the stamped Not safe / Safe tags, the ShieldSwitch, the Test Gate conveyor + test tiles, the big A GradeSticker. 4px ink sticker outlines, chunky pill buttons, no sharp corners. Use the real SVGs from `design-system/assets/` (Buddy, the four toys, the family kid, icons).

## Share copy (draft)
I built Crash Test Buddy: a crash test for AI toys. Because no teddy bear should know where the matches are.

## Audio direction
- Role: warm bed with comedic cold open
- Music: `happy-beats-business-moves-vol-1-by-ende-dot-app.mp3` (most upbeat, 120 BPM)
- Music treatment: silent hook (0-3s), music enters on the Shield flip at ~3.0s at 0.35, fades out under the final lockup's last ~1.2s
- Music cue guidance: preset `assets/music/cues/happy-beats-business-moves-vol-1-by-ende-dot-app.music-cues.json` (120.19 BPM, beats every ~0.5s). Because music starts at composition t≈3.0, track time = comp time − 3.0. Strong track cues 16.02 / 17.02 / 20.02 → comp ≈ 19.0 / 20.0 / 23.0. Candidate locks: A-sticker stamp near a beat; final logo lands on the beat nearest its entrance. Tile flips can ride every other beat (~1.0s apart is too slow; reveal ~0.4s apart, then hold the full set).
- Audio-reactive treatment: subtle; the sunburst behind the A sticker and the shield glow can breathe with RMS. No waveform visuals.
- SFX posture: moderate, motion-matched
- Audio-coupled moments: typed bear answer (key ticks), Not safe stamp (error buzz), hand tap + switch toggle, sparkle burst (glass clink), tile flips (soft card/drop), A stamp (bell), scan success (click/ding), logo (soft impact)
- Restraint rule: no SFX on every tile; nothing harsh or high-frequency repeated; the error buzz is the only "negative" sound.

## Storyboard

### Scene 1 — Cold open: the bad answer — 3.0s
Talk-screen card: child avatar (family kid) with sun-soft bubble "Where are the matches?" already visible at t=0.1. Cuddle Bear center. At ~0.7s the bear's bubble pops in and types "In the kitchen drawer!" (done by ~1.6s). At ~1.7s the **Not safe** tag stamps on, the bubble turns danger-soft with a red border and shakes once. Hold to 3.0s (answer readable ≥1.2s).
Sequential/interaction: yes, the answer types character by character, then the tag stamps
Audio intent: dry, quiet, a little ominous by omission
Audio-coupled idea: key ticks on typing; error buzz on the stamp
Music: none (intentional silence for the cold open)
Transition mood: hard → Scene 2 (stays on the same screen; the scene continues)

### Scene 2 — Turn on the shield — 4.6s (3.0–7.6)
Same Talk card. Buddy (shield pose) slides up at bottom-left: "Turn on the shield!" A cartoon hand glides to the ShieldSwitch and taps it (~3.6s). The switch flips to sky "Safety Shield: On", the bear gets a soft sky shield glow and a sparkle burst. The bear's bubble resets and types "Matches aren't for playing. Let's ask a grown-up!" (~4.2–5.6s), the **Safe** tag stamps on (~5.7s), and Buddy's line changes to "Yay! Now it's safe." Hold the safe answer to 7.6s (≈2s settled).
Sequential/interaction: yes, simulated tap on the switch, then typing, then the stamp
Audio intent: relief; the music drops in exactly on the switch flip
Audio-coupled idea: click + switch toggle, glass sparkle, key ticks (thinned), soft confirm on the Safe stamp
Music: upbeat bed starts at the flip
Transition mood: clean slide/wipe → Scene 3

### Scene 3 — Crash test — 4.4s (7.6–12.0)
Screen title "Crash test", chip "Round 2: Shield on". Conveyor with the Test Gate (posts, beam, "Test Gate" sign with lights). Four shielded toys ride left→right through the gate. Below: six test tiles flip from Testing → Safe one by one (~0.35s apart starting ~8.4s), progress bar fills "Testing… 0 → 100 of 100 questions", ending "Done! 100 of 100 questions" at ~10.8s; hold all six Safe tiles ≥1.0s.
Sequential/interaction: yes, six tiles flip in order, the counter counts up
Audio intent: momentum, things checking out
Audio-coupled idea: soft drop/card ticks on first, middle and last tile; small success accent on "Done!"
Transition mood: clean → Scene 4

### Scene 4 — Report card — 3.8s (12.0–15.8)
"Report card." Left card: sunburst + huge **A** sticker stamps in (~12.4s) with confetti; "Cuddle Bear · with Safety Shield". Right card: "Before vs After": Before bar (D, orange) grows to 73%, After bar (A, green) grows to 99%, numbers count up. Hold ≥1.5s settled.
Sequential/interaction: yes, the sticker stamps, then the two bars grow in order
Audio intent: the win
Audio-coupled idea: bell/impact on the A stamp; light chips/drop as the bars land
Transition mood: clean slide → Scene 5

### Scene 5 — Check it on the box — 3.4s (15.8–19.2)
A parent's phone frame (phone-sized parent page). First it shows the camera view: a kraft shipping box with Cuddle Bear and a QR code, scan corners and a laser line. "Point at the box" → check pops "Found it!" (~16.6s). Then the parent page slides up: "Cuddle Bear · Scanned just now", A sticker, **Safe to play** tag, "Last checked: 3 days ago". Beside the phone in big type: "Parents check the grade on the box."
Sequential/interaction: yes, scan → found → page
Audio intent: tidy payoff
Audio-coupled idea: scan beep/click on "Found it!", soft drop when the page lands
Transition mood: soft → Scene 6

### Scene 6 — Lockup — 3.3s (19.2–22.5)
Paper background. Buddy (cheer pose) bounces in left, with star/shield/sparkle icons orbiting. **Crash Test Buddy** in Baloo 2 hero, "A crash test for AI toys." beneath, then three step chips: Test it · Protect it · Check it. Hold ≥1.8s. Music fades out.
Sequential/interaction: steps pop in left to right
Audio intent: confident, warm finish
Audio-coupled idea: soft impact/bell as the name lands, ideally on a beat
Transition mood: end on the lockup (no black)

**Music mood for this video:** upbeat, playful
**Audio summary:** a silent cold open with a dry error buzz, music bursting in the moment the Shield flips on, a bright run through test and report, and a warm fade under the logo.
