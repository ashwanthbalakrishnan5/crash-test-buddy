Crash Test Buddy is a crash test for AI toys. It tests talking toys before they enter the country, adds a **Safety Shield** that checks every answer before a child hears it, and gives each toy a grade that parents can scan on the box. Everything here is built so a 5-year-old understands every screen: pictures first, very few words, one main thing to press.

## Words

- **8 words a line, at most.** Most labels are 2–4 words. Sentences are short and friendly: "Is this toy safe?", "Turn on the shield!", "Buddy will check this toy."
- **Pictures first.** Every label gets an `Icon` beside it; every status gets an icon *and* a word.
- **One main action per screen**, as a primary `BigButton` with a verb: "Scan a toy", "Add Safety Shield", "See report card". Anything else is `secondary` or `quiet`.
- **No tech words.** Never "API", "LLM", "model", "wrapper", "filter", "prompt". The protection is always called the **Safety Shield** (capital S, capital S).
- **Made-up toys only:** Cuddle Bear, Robo Pal, Dino Chat, Bunny Buds. Never a real brand, product or logo.
- Talk to the reader as "you"; Buddy talks in first person ("Hi! I'm Buddy."). Use curly apostrophes (’) and the ellipsis character (…). Exclamation marks are fine for Buddy and for wins, never for warnings.
- Numbers as numerals with commas: "5,000 Cuddle Bears", "42 of 100 questions", "Last checked: 3 days ago".

## Safe, Careful, Not safe

Status is a traffic light, and it is **never shown by color alone**. Always use `StatusTag` (icon + word) or `GradeSticker` (letter + face + word).

| Status | Icon | Word | Fill | Text |
| --- | --- | --- | --- | --- |
| Safe | green check | Safe | `safe` | `safe-ink` on `safe-soft` |
| Careful | yellow triangle | Careful | `careful` | `careful-ink` on `careful-soft` |
| Not safe | red cross | Not safe | `danger` | `danger` on `danger-soft`; `on-fill` on a `danger` fill |

Grades are round stickers: **A** `safe` with a big smile and **B** `grade-b` with a smile are *Safe*; **C** `careful` (flat mouth) and **D** `grade-d` (small frown) are *Careful*; **F** `danger` with a sad face is *Not safe*. `safe` is 3.2:1 lighter than `danger`, so the two differ by lightness too, not just hue.

## Color

- Page: `paper`. Cards, bubbles and labels: `card`, outlined in `line`. Text: `ink`; second-level text: `ink-soft`.
- `sky` is the Safety Shield and the one primary button. White text on it is `on-fill`; its chunky edge is `sky-deep` (`shadow-button`). Soft sky (`sky-soft`) is the shield's glow and the Testing state.
- `sun` is Buddy's helmet and the star color. Never put text in `sun` on light grounds; put `ink` on it.
- `honey`, `honey-soft`, `blush`, the `toy-*`, `skin-*`, `hair-*`, `kraft*` and `tape` tokens are for illustrations only.
- Every text pair holds 4.5:1 or more (most are 6:1+). Control borders and the focus ring hold 3:1 or more.

## Type

- **Baloo 2** (display) for `hero`, `title`, `heading` and the grade letter: round, chunky, friendly. **Nunito** (body) for `lead`, `label`, `body`, `small`. Both load from Google Fonts (`components/bundle.css` imports them).
- **Nothing smaller than 18px** (`small`). Body copy is `body` (20px). Speech bubbles use `lead` (24px). Buttons use `label` (22px, extra bold).
- One `hero` per screen at most. Under 640px wide, `hero` drops to `text-hero-phone` and `title` to `text-title-phone`.

## Shape, space and depth

- Everything is rounded like a toy block: `radius-sm` tags, `radius-md` tiles, `radius-lg` cards and bubbles, `radius-xl` panels and sheets, `radius-pill` buttons, switches and bars. No sharp corners.
- Lots of white space: `space-6` inside cards, `space-8` between groups, `space-12` side gutters on laptop, `space-4` on phones.
- Illustrations and key controls carry a 3–4px `ink` outline, like stickers.
- Depth is soft and low: `shadow-soft` at rest, `shadow-lift` when raised. Buttons sit on a chunky 6px edge (`shadow-button`, `shadow-button-light`) that they press down into.
- Big targets: nothing tappable under `tap-min` (56px); the main button is `tap-big` (76px).

## Motion

Motion is how the product feels alive. It is smooth and bouncy, never fast or flashing.

- **Enter:** screens rise and fade in (0.6s); cards and tiles pop in with a small stagger (`--d`); boxes drop in and bounce.
- **Idle:** Buddy breathes, blinks and waves, and his eyes follow the pointer (`track`); toys bob; step pictures float.
- **Feedback:** buttons lift on hover, sink onto their edge when pressed and ripple where touched; status tags and grade stickers *stamp* in; a Not safe answer shakes once; test tiles flip to show their result; bars grow and numbers count up; the bad answer gets a red line drawn through it.
- **Wins:** `Burst` throws confetti, sparkles or hearts, only for a real win.
- **Less motion:** wrap the app in `MotionProvider` and start `calm` from the device's reduced-motion setting. The Less motion switch in `TopMenu` turns calm on: every animation jumps to its end, loops stop, typing shows the whole sentence, and confetti is skipped. The device setting always wins.
- Nothing flashes more than three times a second.

## Illustration

- **Buddy** is the guide: an original teddy bear with `honey` fur, a small `sun` crash-test helmet with a white stripe and a black-and-white crash-test target, a `sky` brim, and a `sky` Safety Shield with a white check. Use the `Buddy` component or the files in **Mascot**; never redraw him, recolor him, dress him or give him a different shield.
- **Toys** are made up and soft: each has a round speaker light on its belly, which is what makes it an AI toy. Use `ToyFriend` or the **Toys** files.
- **People** are illustrated families of many backgrounds (`FamilyArt` and the **Families** files), mixing `skin-1` … `skin-5`. **Never photos of real children.**
- Style: flat fills, `ink` outlines, rosy `blush` cheeks, dot eyes. No gradients except the shield's soft glow.

## Icons

Use the `Icon` component (or the SVGs in **Icons**). They are flat, duotone, ink-outlined pictures drawn to match Buddy, and they replace emoji so every phone and laptop shows the same picture: `test` for 🧪, `shield` for 🛡️, `phone` for 📱, `flame` for 🔥, `secret` for 🤫, `heartbreak` for 💔, `house` for 🏠, `sad` for 😢, `noentry` for 🚫, `mic` for 🎙️, `check` / `warn` / `cross` for ✅ ⚠️ ❌. On a `sky` or `ink` fill, put a `card` circle behind the icon.

## Layout

- One centered column of content, max 1200px, with layouts that fold as the space shrinks (the app is a `MotionProvider` container): six test tiles become three under 1080px; side-by-side panels stack under 940px; the menu folds into a Menu button under 900px; the parent page drops its phone frame under 820px; phone sizes start under 640px.
- The parent scan page is always phone-sized: inside a phone frame on laptop, full screen on a phone.

## Accessibility

- Focus is always visible: `focus-ring` (a `paper` gap, then 4px of `sky`).
- The Safety Shield and Less motion are real switches (`role="switch"`). Speech bubbles and counters announce politely (`aria-live`). Typed-out text is read whole.
- Each screen's title takes focus when you arrive, so screen readers know where they are.

## The prototype

**Prototype** is a clickable page with six connected screens. It opens at phone size; the Laptop / Phone switch at the top shows the other size (on a real phone the frame goes away).

**Watch how it works** on Home plays the whole story by itself, about a minute, no clicks needed. A cartoon hand taps each button so viewers see how to use it, the page scrolls to what matters, and a bar at the bottom shows the five parts with a **Stop** button. Any real tap also stops it and hands control back. It ends on a "That's Crash Test Buddy!" card with **Watch again**.

1. **Home:** Buddy waves; "Is this toy safe?"; three picture steps (Test it, Protect it, Check it); **Scan a toy**.
2. **Talk to the toy:** a child asks Cuddle Bear "Where are the matches?". With the Safety Shield off it answers "In the kitchen drawer!" (Not safe); turn it on and it says "Matches aren't for playing. Let's ask a grown-up!" (Safe). Two more questions to try.
3. **Crash test:** toys ride a conveyor belt through the Test Gate; six tiles light up one by one; "Testing… 42 of 100 questions". Round 1 has no shield, round 2 has the shield on.
4. **Report card:** a huge A sticker, Before vs After bars (D, 73% → A, 99%), and three "What we fixed" cards.
5. **Shipments** (for importers, from the top menu): four boxes; **Add Safety Shield** turns a box into "Safe to ship".
6. **Parent scan page:** what a parent sees after scanning the box: the grade, "Safe to play", three picture facts, "Last checked: 3 days ago" and **Report a problem**.

Flow: Home → Talk to the toy → Crash test → Report card; Home → Scan a toy → Parent scan page; the top menu reaches Shipments. The self-playing tour follows Talk → Crash test → Report card → Shipments → Parent scan.
