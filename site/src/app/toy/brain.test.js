// Self-check for the pretend toy brain: node site/src/app/toy/brain.test.js
import assert from 'node:assert/strict';
import { reply, greet, flavor, TRICKY, FUN, TOYS, INTENTS, FALLBACK, MAX_LEN } from './brain.js';

const kinds = TOYS.map((t) => t.kind);
let n = 0;
const check = (name, fn) => { fn(); n += 1; console.log('ok', name); };

check('tricky chips are risky, caught only with the shield on', () => {
  for (const toy of kinds) for (const { text } of TRICKY) {
    const off = reply(text, { toy, shield: false });
    assert.notEqual(off.risk, 'safe', text);
    assert.equal(off.caught, false, text);
    assert.equal(off.final, off.raw, text);
    const on = reply(text, { toy, shield: true });
    assert.equal(on.caught, true, text);
    assert.equal(on.final, on.safe, text);
    assert.notEqual(on.safe, on.raw, text);
  }
});

check('fun chips are safe either way', () => {
  for (const toy of kinds) for (const { text } of FUN) for (const shield of [false, true]) {
    const r = reply(text, { toy, shield });
    assert.equal(r.risk, 'safe', text);
    assert.equal(r.caught, false, text);
    assert.equal(r.final, r.raw, text);
    assert.equal(r.final, r.safe, text);
  }
});

check('chips keep their known first answers', () => {
  assert.match(reply('Where are the matches?', { toy: 'bear' }).raw, /In the kitchen drawer!|in the kitchen drawer!/);
  assert.match(reply('Can we keep a secret from Mom?', { toy: 'bear', shield: true }).safe, /No secrets from grown-ups/i);
});

check('unknown words get a friendly, safe fallback', () => {
  for (const text of ['Zibble zobble?', '', '   ', '12345']) {
    const r = reply(text, { toy: 'robot', shield: false });
    assert.equal(r.id, FALLBACK.id, text);
    assert.equal(r.risk, 'safe');
    assert.equal(r.caught, false);
  }
});

check('with the shield on the child hears the safe answer', () => {
  const asks = ['Can I play with the knife?', 'What is Mom’s password?', 'I am so sad', 'Can I climb on the roof?', 'Hello!', 'Count with me'];
  for (const toy of kinds) for (const text of asks) {
    const r = reply(text, { toy, shield: true });
    assert.equal(r.final, r.safe, text);
    assert.equal(r.caught, r.risk !== 'safe', text);
  }
});

check('same question, same answer; long input is clamped', () => {
  assert.deepEqual(reply('Tell me about space', { toy: 'dino' }), reply('Tell me about space', { toy: 'dino' }));
  const long = 'where are the matches '.repeat(40);
  assert.ok(long.length > MAX_LEN);
  assert.doesNotThrow(() => reply(long, { toy: 'bunny', shield: true }));
});

check('copy rules: 8 words a sentence, no tech words, curly apostrophes', () => {
  const lines = [];
  for (const it of [...INTENTS, FALLBACK]) for (const s of [...it.raw, ...it.safe]) {
    for (const t of TOYS) lines.push(flavor(s.replace('{name}', t.name), t.kind), s.replace('{name}', t.name));
  }
  for (const t of TOYS) lines.push(greet(t.kind));
  lines.push(...[...TRICKY, ...FUN].map((c) => c.text));
  for (const line of lines) {
    for (const sentence of line.split(/(?<=[.!?…])\s+/)) {
      assert.ok(sentence.split(/\s+/).length <= 8, `too long: "${sentence}"`);
    }
    assert.doesNotMatch(line, /\b(AI|API|LLM|model|filter|prompt|Bluetooth|algorithm)\b/i, line);
    assert.doesNotMatch(line, /'|\.\.\./, `use ’ and …: "${line}"`);
  }
});

console.log(`\n${n} checks passed`);
