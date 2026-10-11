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

/** The full check, any language: the server's model, with the English rules as a fallback. */
export async function check(question, answer) {
  const local = () => {
    const q = checkQuestion(question);
    if (q.risky) return q;
    const a = checkAnswer(answer);
    return a ? { risky: true, ...a } : { ...q, risky: false };
  };
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3000);
    const res = await fetch('/api/check', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ question, answer }), signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) return local();
    const v = await res.json();
    if (!v.risky) { const l = local(); return l.risky ? l : { risky: false, risk: 'safe', topic: v.topic, icon: 'check' }; }
    const q = checkQuestion(question); // a known English question keeps its scripted safe line
    return { risky: true, risk: v.risk, topic: v.topic, icon: 'warn', safe: q.risky ? q.safe : v.safe || q.safe };
  } catch { return local(); }
}
