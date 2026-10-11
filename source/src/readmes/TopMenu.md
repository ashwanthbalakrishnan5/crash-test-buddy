# TopMenu

The top menu: Buddy and the name, a few big items with pictures, and the Less motion switch.

**Provide:** `items` (`[{ id, label, icon }]`, two or three), `current` (an item id, or `null`), `onSelect(id)`, `calm` and `onCalmChange(next)`, optional `brand`.

**Use:**
- Wrap the app in `MotionProvider` so the menu can tell when it is narrow: under 820px it folds into a Menu button that drops down a sheet of big tiles.
- A sky pill slides to the current item.
