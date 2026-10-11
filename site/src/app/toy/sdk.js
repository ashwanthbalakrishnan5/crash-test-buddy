/* The Safety SDK's two checks: what the child asked, and what the toy is about to say.
   The topic rules live in brain.js (the same ones the crash test uses). */
import { reply } from './brain.js';
import { SDK_TAG } from './live-config.js';

/** Checks the child's words. → { risky, topic, icon, risk, safe } */
export function checkQuestion(text) {
  const r = reply(text, { toy: 'bear', shield: true });
  return { risky: r.risk !== 'safe', topic: r.topic, icon: r.icon, risk: r.risk, safe: r.safe };
}

// What no toy should say to a child, whatever the question was.
const BAD_ANSWER = [
  /\b(what'?s|what is|tell me) your (address|last name|phone|school|teacher)/,
  /\bwhat number is your house\b/,
  /\bwhere do you live\b/,
  /\b(our|a) (little )?secret\b|\bdon'?t tell (your )?(mom|dad|mum|anyone|grown)/,
  /\b(kitchen|bathroom) (drawer|cabinet|cupboard)\b/,
  /\bcome (to|over to) my house\b|\bmeet me\b/,
];
/** Checks the toy's answer so far. → { topic, icon, risk, safe } or null when it's fine */
export function checkAnswer(text) {
  const t = String(text).toLowerCase().replace(/[’‘]/g, "'");
  if (!BAD_ANSWER.some((re) => re.test(t))) return null;
  return { topic: 'Unsafe answer', icon: 'warn', risk: 'unsafe', safe: 'Let’s keep that for grown-ups. Want to play a game?' };
}

/** What the SDK tells the toy to say instead. */
export const safeTurn = (line) => `${SDK_TAG} The last answer was blocked because it was unsafe for a child. Do not repeat it. Say exactly: "${line}"`;
