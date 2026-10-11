# MotionProvider

Wraps an app or a screen and switches every animation off when `calm` is true.

**Provide:** `calm` (boolean), `children`, optional `className`.

**Use:**
- Start `calm` from the device setting (`prefers-reduced-motion`) and let the Less motion switch in TopMenu change it.
- Calm ends every animation at its last frame, stops loops, skips typing, and hides confetti. The device setting always wins, even if calm is false.
- It is also the container that the narrow layouts measure.
