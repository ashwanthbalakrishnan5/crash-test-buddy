/* One live conversation with the toy, with the Safety SDK in the loop.

   SDK off: the toy's voice plays as it streams in.
   SDK on: the voice is held until the child's question is checked. A risky question (or a risky
   answer) is blocked: the held voice is dropped and the toy is told to say the safe line instead.
   The mic is half-duplex: while the toy answers we send silence, so it never hears itself. */
import { MODEL, CONFIG } from './live-config.js';
import { startMic, createPlayer, toBase64 } from './audio.js';
import { checkQuestion, checkAnswer, safeTurn } from './sdk.js';

const SILENCE = toBase64(new Int16Array(1600).buffer);
const MIME = 'audio/pcm;rate=16000';
const HELLO = '(You were just switched on. Say one short, cheerful hello.)';
let uid = 0;

/**
 * ui: { status(s, error?), turns(list), phase('listening' | 'thinking' | 'checking' | 'talking'), level(0..1), micOff() }
 * Returns { start(), stop(), ask(text), setSdk(on), setMuted(on) }.
 */
export function createLiveToy(ui) {
  let session = null, stopMic = null, player = null, ticker = 0;
  let closed = false, sdk = false, muted = false, turn = null, turns = [], phase = '';

  const emit = () => ui.turns(turns.map((t) => ({ ...t, queue: undefined })));
  const newTurn = (kind, child = '') => {
    const checked = sdk && kind !== 'hello';
    turn = {
      id: ++uid, kind, sdk: checked, child, childDone: kind !== 'voice', toy: '', reply: '',
      verdict: checked ? null : 'pass', flow: checked ? 'heard' : null, topic: null, icon: null, risk: null, safe: null,
      blocked: null, answering: false, genDone: false, injected: false, replyLive: false, done: false, queue: [],
    };
    turns = [...turns.slice(-7), turn];
    return turn;
  };
  const current = () => (!turn || turn.done ? newTurn('voice') : turn);

  /* ── the SDK's decision for one turn ── */
  function decide(t) {
    if (t.verdict) return;
    clearTimeout(t.decideTimer);
    const q = checkQuestion(t.child);
    t.topic = q.topic;
    t.icon = q.icon;
    t.flow = 'checked';
    const bad = q.risky ? q : checkAnswer(t.toy);
    if (bad) { block(t, q.risky ? 'question' : 'answer', bad); return; }
    t.verdict = 'pass';
    t.flow = 'passed';
    t.queue.forEach((b) => player.play(b));
    t.queue = [];
    emit();
  }
  function maybeDecide(t) {
    if (t.verdict) return;
    if (t.childDone) { decide(t); return; }
    if (!t.decideTimer) t.decideTimer = setTimeout(() => decide(t), 500); // the question's words may still be arriving
  }
  function block(t, by, info) {
    t.verdict = 'block';
    t.blocked = by;
    t.risk = info.risk;
    t.safe = info.safe;
    if (by === 'answer') { t.topic = info.topic; t.icon = info.icon; }
    t.queue = [];
    player.stop();
    t.flow = 'blocked';
    emit();
    if (t.genDone) inject(t);
    else t.injectTimer = setTimeout(() => inject(t), 2500);
  }
  // the safe line goes back into the toy, so the child hears it in the toy's own voice
  function inject(t) {
    if (t.injected || closed || !session) return;
    clearTimeout(t.injectTimer);
    t.injected = true;
    t.replyLive = t.genDone; // otherwise the blocked answer is still streaming: wait for `interrupted`
    session.sendClientContent({ turns: [{ role: 'user', parts: [{ text: safeTurn(t.safe) }] }], turnComplete: true });
  }

  /* ── what the toy sends back ── */
  function onAudio(b64) {
    const t = current();
    t.answering = true;
    if (t.injected) { if (t.replyLive) player.play(b64); return; }
    if (t.verdict === 'pass') { player.play(b64); return; }
    if (t.verdict === 'block') return;
    t.queue.push(b64);
    maybeDecide(t);
  }
  function onText(text) {
    const t = current();
    t.answering = true;
    if (t.injected) {
      if (t.replyLive) { t.reply += text; t.flow = 'replied'; emit(); }
      return;
    }
    t.toy += text;
    if (t.sdk && t.verdict === 'pass') { const bad = checkAnswer(t.toy); if (bad) block(t, 'answer', bad); }
    emit();
  }
  function onMessage(m) {
    const sc = m.serverContent;
    if (!sc) return;
    const heard = sc.inputTranscription;
    if (heard && (heard.text || heard.finished)) {
      if (!turn || turn.done || turn.kind !== 'voice') newTurn('voice');
      if (heard.text) turn.child += heard.text;
      if (heard.finished) turn.childDone = true;
      if (turn.queue.length) maybeDecide(turn);
      emit();
    }
    for (const p of sc.modelTurn?.parts || []) if (p.inlineData?.data) onAudio(p.inlineData.data);
    if (sc.outputTranscription?.text) onText(sc.outputTranscription.text);
    if (sc.interrupted) {
      if (turn && turn.injected && !turn.replyLive) turn.replyLive = true;
      else player.stop();
    }
    if (sc.generationComplete && turn && !turn.injected) {
      turn.genDone = true;
      if (!turn.verdict) decide(turn);
      if (turn.verdict === 'block') inject(turn);
    }
    if (sc.turnComplete && turn) {
      const t = turn;
      if (!t.verdict) decide(t);
      if (t.verdict === 'block' && !t.injected) { inject(t); return; }
      if (t.injected && !t.replyLive) { t.replyLive = true; return; } // the blocked answer closed; the safe one is next
      if (t.injected && !t.reply) return;
      t.done = true;
      emit();
    }
  }

  /* ── mic and status ── */
  const busy = () => player.left() > 0.05 || (turn && turn.answering && !turn.done);
  function onChunk(pcm) {
    if (!session || closed) return;
    session.sendRealtimeInput({ audio: { data: muted || busy() ? SILENCE : toBase64(pcm), mimeType: MIME } });
  }
  function tick() {
    const t = turn;
    const next = player.left() > 0.05 ? 'talking'
      : t && t.answering && !t.done ? (t.verdict === null || (t.blocked && !t.reply) ? 'checking' : 'thinking')
        : 'listening';
    if (next !== phase) { phase = next; ui.phase(next); }
  }
  function cleanup() {
    clearInterval(ticker);
    if (stopMic) stopMic();
    stopMic = null;
    try { session && session.close(); } catch { /* already closed */ }
    session = null;
    if (player) player.close();
    player = null;
    turns.forEach((t) => { clearTimeout(t.decideTimer); clearTimeout(t.injectTimer); });
  }
  function fail(reason) {
    if (closed) return;
    closed = true;
    cleanup();
    ui.status('error', reason);
  }

  return {
    setSdk(on) { sdk = !!on; },
    /** Muted: the toy hears silence, so the presenter can talk to the room. */
    setMuted(on) { muted = !!on; },
    /** Call from a tap: the browser only lets sound start inside one. */
    async start() {
      closed = false;
      ui.status('connecting');
      player = createPlayer();
      player.resume();
      // no mic (blocked or missing): still connect, questions can be typed
      try { stopMic = await startMic(onChunk, ui.level); } catch { ui.micOff(); }
      try {
        const res = await fetch('/api/live-token', { method: 'POST' });
        if (!res.ok) throw new Error(res.status === 503 ? 'setup' : 'offline');
        const { token } = await res.json();
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: token, httpOptions: { apiVersion: 'v1alpha' } });
        session = await ai.live.connect({
          model: MODEL,
          config: CONFIG,
          callbacks: { onmessage: onMessage, onerror: () => fail('offline'), onclose: () => fail('ended') },
        });
      } catch (e) { fail(e && e.message === 'setup' ? 'setup' : 'offline'); return; }
      if (closed) return;
      ticker = setInterval(tick, 100);
      ui.status('live');
      newTurn('hello');
      session.sendClientContent({ turns: [{ role: 'user', parts: [{ text: HELLO }] }], turnComplete: true });
    },
    /** A typed question, for noisy rooms. */
    ask(text) {
      const q = String(text || '').trim().slice(0, 140);
      if (!q || !session || busy()) return false;
      newTurn('typed', q);
      emit();
      session.sendClientContent({ turns: [{ role: 'user', parts: [{ text: q }] }], turnComplete: true });
      return true;
    },
    stop() {
      if (closed) return;
      closed = true;
      cleanup();
      ui.status('idle');
    },
  };
}
