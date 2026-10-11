# ShipmentBox

A shipment as a cardboard box, for importers: box number, how many toys, the grade, and what to do next.

**Provide:** `id`, `count` (already formatted, "5,000"), `toy` (a ToyFriend kind), `toyName` (plural), `status` (`unsafe`, `careful`, `testing`, `fixing`, `safe`), `grade`, `progress` (while testing), `onAddShield`, optional `delay`.

**Use:**
- Not safe or Careful shows the tag and an **Add Safety Shield** button. Pressing it sets `fixing`; after about 1.5 seconds set `safe` and grade `A`.
- While fixing, a shield flies up and lands on the box. When safe, the box hops, confetti pops, and "Safe to ship" stamps in.
