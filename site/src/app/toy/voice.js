/* Speech out (the toy’s voice) and speech in (the mic) for the Live toy screen.
   Every helper is a no-op when the browser has no speech support or blocks it. */

export const VOICE = {
  bear: { pitch: 1.3, rate: 1.0 },
  robot: { pitch: 0.5, rate: 0.95 },
  dino: { pitch: 0.8, rate: 0.9 },
  bunny: { pitch: 1.7, rate: 1.1 },
};

const synth = () => {
  try {
    return typeof window !== 'undefined' && window.speechSynthesis && typeof window.SpeechSynthesisUtterance === 'function' ? window.speechSynthesis : null;
  } catch { return null; }
};
const Recognition = () => {
  try { return typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition || null : null; } catch { return null; }
};
export const canSpeak = () => !!synth();
export const canListen = () => !!Recognition();

/* ───────── voice out ───────── */
let voices = [];
const loadVoices = () => { try { voices = synth()?.getVoices() || []; } catch { voices = []; } };
if (synth()) {
  loadVoices();
  try { synth().addEventListener('voiceschanged', loadVoices); } catch { /* older browsers fill the list on first use */ }
}
const NICE = ['Samantha', 'Microsoft Aria', 'Microsoft Jenny', 'Google US English', 'Karen', 'Moira'];
const NOVELTY = /Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Good News|Jester|Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox/i;
function pickVoice() {
  if (!voices.length) loadVoices();
  const en = voices.filter((v) => /^en([-_]|$)/i.test(v.lang) && !NOVELTY.test(v.name));
  for (const name of NICE) { const v = en.find((x) => x.name.includes(name)); if (v) return v; }
  return en.find((v) => /^en[-_]US/i.test(v.lang) && v.localService) || en.find((v) => /^en[-_]US/i.test(v.lang)) || en[0] || null;
}

let current = null; // Chrome drops the events of an utterance nobody holds on to
let primed = false;

/** Call inside a tap or key press: some browsers only allow speech after one. */
export function primeSpeech() {
  const s = synth();
  if (!s || primed) return;
  primed = true;
  try { const u = new window.SpeechSynthesisUtterance(''); u.volume = 0; s.speak(u); } catch { /* blocked: speak() reports it later */ }
}

export function stopSpeaking() {
  const s = synth();
  current = null;
  try { if (s && (s.speaking || s.pending)) s.cancel(); } catch { /* nothing to stop */ }
}

/**
 * Says `text` in a toy’s voice. onEnd runs once: when speech ends, fails, never starts,
 * or runs far past its expected length (some engines never fire their events).
 * Returns a cancel function that stops the voice without calling onEnd.
 */
export function speak(text, { kind = 'bear', onEnd } = {}) {
  const s = synth();
  let done = false;
  const timers = [];
  const finish = () => {
    if (done) return;
    done = true;
    timers.forEach(clearTimeout);
    onEnd && onEnd();
  };
  if (!s || !text) { finish(); return () => {}; }
  const v = VOICE[kind] || VOICE.bear;
  let u;
  try { u = new window.SpeechSynthesisUtterance(text); } catch { finish(); return () => {}; }
  u.lang = 'en-US';
  u.pitch = v.pitch;
  u.rate = v.rate;
  const voice = pickVoice();
  if (voice) u.voice = voice;
  let started = false;
  u.onstart = () => { started = true; };
  u.onend = () => { if (current === u) current = null; finish(); };
  u.onerror = u.onend;
  timers.push(setTimeout(() => { if (!started) finish(); }, 2500));
  timers.push(setTimeout(finish, 1500 + (text.split(/\s+/).length * 450) / v.rate));
  try {
    if (s.speaking || s.pending) s.cancel();
    current = u;
    s.speak(u);
  } catch { finish(); }
  return () => {
    if (done) return;
    done = true;
    timers.forEach(clearTimeout);
    if (current === u) stopSpeaking();
  };
}

/* ───────── voice in ───────── */
/**
 * One listening turn (en-US, interim results). Returns null when the browser can’t listen.
 * onInterim(text) while talking, onFinal(text) once, onError(code), onEnd() when it stops.
 */
export function createListener({ onInterim, onFinal, onError, onEnd } = {}) {
  const SR = Recognition();
  if (!SR) return null;
  let rec;
  try { rec = new SR(); } catch { return null; }
  rec.lang = 'en-US';
  rec.interimResults = true;
  rec.continuous = false;
  rec.maxAlternatives = 1;
  rec.onresult = (e) => {
    const all = Array.from(e.results || []);
    const text = all.map((r) => (r[0] ? r[0].transcript : '')).join('').trim();
    if (!text) return;
    if (all[all.length - 1].isFinal) onFinal && onFinal(text);
    else onInterim && onInterim(text);
  };
  rec.onerror = (e) => onError && onError((e && e.error) || 'error');
  rec.onend = () => onEnd && onEnd();
  const off = () => { rec.onresult = rec.onerror = rec.onend = null; };
  return {
    start() { try { rec.start(); return true; } catch { off(); return false; } },
    stop() { try { rec.stop(); } catch { /* already stopped */ } },
    abort() { off(); try { rec.abort(); } catch { /* already stopped */ } },
  };
}
