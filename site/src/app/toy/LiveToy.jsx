/* Live toy: a pretend talking toy to talk to during a demo.
   Pick a toy, then talk or type; with the Safety Shield on, every answer is checked before the child hears it. */
import { useState, useEffect, useRef } from 'react';
import { useCalm, Icon, Buddy, ToyFriend, Burst, StatusTag, BigButton, ShieldSwitch, SpeechBubble, cx } from '../../ds.js';
import { TOYS, TRICKY, FUN, MAX_LEN, reply, greet, clean } from './brain.js';
import { canListen, canSpeak, createListener, speak, stopSpeaking, primeSpeech } from './voice.js';
import './toy.css';

const KEY = 'ctb-live-toy';
const NAME = Object.fromEntries(TOYS.map((t) => [t.kind, t.name]));
const CHIPS = [...TRICKY, ...FUN];
const TILT = ['-2deg', '1.5deg', '-1deg', '2deg'];
const TYPE_MS = 34; // how fast the design system types a bubble out
const MIC_DEAD = ['not-allowed', 'service-not-allowed', 'audio-capture', 'network'];

const savedToy = () => { try { const k = sessionStorage.getItem(KEY); return NAME[k] ? k : null; } catch { return null; } };
const saveToy = (k) => { try { sessionStorage.setItem(KEY, k); } catch { /* private mode: pick again next time */ } };
let uid = 0;
const nextId = () => ++uid;

export default function LiveToy({ go }) {
  const calm = useCalm();
  const ms = (n) => (calm ? 0 : n);
  const [toy, setToy] = useState(savedToy);
  const [view, setView] = useState(() => (savedToy() ? 'chat' : 'pick'));
  const [found, setFound] = useState(false);
  const [joining, setJoining] = useState(null);
  const [shield, setShield] = useState(false);
  const [sound, setSound] = useState(true);
  const [msgs, setMsgs] = useState([]); // { id, from: 'child' | 'toy' | 'catch', text, status, typed }
  const [pending, setPending] = useState(null); // { phase: 'think' | 'check', r }
  const [busy, setBusy] = useState(false);
  const [typingId, setTypingId] = useState(null);
  const [talking, setTalking] = useState(false);
  const [caught, setCaught] = useState(0);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [micOff, setMicOff] = useState(false);
  const [micOK] = useState(canListen);
  const [voiceOK] = useState(canSpeak);

  const timers = useRef(new Set());
  const busyRef = useRef(false), typingRef = useRef(null), soundRef = useRef(true), recRef = useRef(null), sendRef = useRef(null);
  const talk = useRef({ typing: false, voice: false, token: null, cancel: null });
  const logRef = useRef(null), chipsRef = useRef(null), inputRef = useRef(null), prevView = useRef(view);

  const later = (n, fn) => {
    const id = setTimeout(() => { timers.current.delete(id); fn(); }, n);
    timers.current.add(id);
  };
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current.clear(); };
  const setBusyNow = (b) => { busyRef.current = b; setBusy(b); };

  // the toy "talks" while its bubble types out and while its voice plays
  const settle = () => { const t = talk.current; if (!t.typing && !t.voice) setTalking(false); };
  const stopVoice = () => {
    const t = talk.current;
    t.token = null;
    if (t.cancel) t.cancel();
    t.cancel = null;
    t.voice = false;
    stopSpeaking();
    settle();
  };
  const stopMic = () => { const r = recRef.current; recRef.current = null; if (r) r.abort(); setListening(false); };

  const say = (text, { kind, status = null }) => {
    const id = nextId();
    typingRef.current = id;
    setMsgs((m) => [...m, { id, from: 'toy', text, status, typed: false }]);
    setTypingId(id);
    stopVoice();
    const t = talk.current;
    t.typing = true;
    setTalking(true);
    if (soundRef.current && voiceOK) {
      const token = {};
      t.token = token;
      t.voice = true;
      t.cancel = speak(text, { kind, onEnd: () => { if (t.token !== token) return; t.voice = false; t.cancel = null; settle(); } });
    }
    later(text.length * TYPE_MS + 2000, () => typed(id)); // in case the bubble never reports back
  };
  const typed = (id) => {
    if (typingRef.current !== id) return;
    typingRef.current = null;
    setTypingId(null);
    setMsgs((m) => m.map((x) => (x.id === id ? { ...x, typed: true } : x)));
    talk.current.typing = false;
    settle();
    setBusyNow(false);
  };
  const land = (r, kind) => {
    setPending(null);
    if (!r.caught) { say(r.final, { kind, status: r.risk }); return; }
    setMsgs((m) => [...m, { id: nextId(), from: 'catch', text: r.raw, status: r.risk }]);
    setCaught((c) => c + 1);
    later(ms(1000), () => say(r.final, { kind, status: 'safe' }));
  };
  const send = (value) => {
    const text = clean(value);
    if (!text || busyRef.current || !toy) return false;
    stopVoice();
    primeSpeech();
    stopMic();
    setBusyNow(true);
    const kind = toy, on = shield, r = reply(text, { toy: kind, shield: on });
    setMsgs((m) => [...m, { id: nextId(), from: 'child', text }]);
    setInput('');
    setPending({ phase: 'think', r });
    later(ms(800), () => {
      if (!on) { land(r, kind); return; }
      setPending({ phase: 'check', r });
      later(ms(900), () => land(r, kind));
    });
    return true;
  };
  sendRef.current = send;

  // stop everything that is mid-way: timers, voice, mic, a half-typed answer
  const reset = () => {
    clearTimers();
    stopVoice();
    stopMic();
    typingRef.current = null;
    setTypingId(null);
    setPending(null);
    setMsgs((m) => m.map((x) => (x.typed === false ? { ...x, typed: true } : x)));
    talk.current.typing = false;
    settle();
    setBusyNow(false);
  };
  const clearChat = () => { reset(); setMsgs([]); setCaught(0); setInput(''); chipsRef.current?.scrollTo({ left: 0 }); };
  const switchToy = () => { reset(); setFound(true); setJoining(null); setView('pick'); };
  const connect = (kind) => {
    if (joining) return;
    if (kind === toy && msgs.length) { setView('chat'); return; } // same toy: back to the chat
    primeSpeech();
    setJoining(kind);
    later(ms(600), () => {
      reset();
      saveToy(kind);
      setToy(kind);
      setMsgs([]);
      setCaught(0);
      setJoining(null);
      setView('chat');
      setBusyNow(true);
      later(ms(400), () => say(greet(kind), { kind }));
    });
  };
  const toggleSound = () => {
    const v = !soundRef.current;
    soundRef.current = v;
    setSound(v);
    if (v) primeSpeech();
    else stopVoice();
  };
  const toggleMic = () => {
    if (recRef.current) { recRef.current.stop(); return; }
    if (busyRef.current) return;
    stopVoice();
    primeSpeech();
    const rec = createListener({
      onInterim: (t) => setInput(t.slice(0, MAX_LEN)),
      onFinal: (t) => { if (recRef.current === rec) { recRef.current = null; setListening(false); } sendRef.current(t[0].toUpperCase() + t.slice(1)); },
      onError: (code) => { if (MIC_DEAD.includes(code)) setMicOff(true); },
      onEnd: () => { if (recRef.current === rec) { recRef.current = null; setListening(false); } },
    });
    if (!rec || !rec.start()) { setMicOff(true); return; }
    recRef.current = rec;
    setInput('');
    setListening(true);
  };
  // on a phone the chips sit below the conversation: bring the newest answer into view
  const showLog = () => {
    const el = logRef.current, box = el && el.closest('.app-scroll');
    if (!box) return;
    const r = el.getBoundingClientRect(), b = box.getBoundingClientRect();
    const dy = r.bottom > b.bottom ? r.bottom - b.bottom + 16 : r.top < b.top ? r.top - b.top - 16 : 0;
    if (dy) box.scrollBy({ top: dy, behavior: calm ? 'auto' : 'smooth' });
  };

  // arriving: look for toys, or greet the toy picked earlier this session
  useEffect(() => {
    if (view === 'chat') { setBusyNow(true); later(ms(500), () => say(greet(toy), { kind: toy })); }
    else later(ms(1200), () => setFound(true));
  }, []);
  // leaving: stop timers, the voice and the mic
  useEffect(() => () => { clearTimers(); stopVoice(); stopMic(); }, []);
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: calm ? 'auto' : 'smooth' });
  }, [msgs, pending, view]);
  useEffect(() => {
    if (prevView.current === view) return;
    prevView.current = view;
    let fine = false;
    try { fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches; } catch { /* assume touch */ }
    if (view === 'chat' && fine && inputRef.current) inputRef.current.focus({ preventScroll: true });
  }, [view]);

  const name = NAME[toy] || '';
  return (
    <section className="lt">
      <div className="lt-head rise">
        <h1 className="title screen-title" tabIndex={-1}>Live toy</h1>
        {view === 'chat' && voiceOK && (
          <button type="button" className="lt-icon-btn" aria-label="Sound" aria-pressed={sound} title={sound ? 'Sound on' : 'Sound off'} onClick={toggleSound}>
            <SoundIcon on={sound} />
          </button>
        )}
        {view === 'chat' && (
          <button type="button" className="lt-icon-btn" aria-label="Clear chat" title="Clear chat" disabled={!msgs.length && !pending} onClick={clearChat}>
            <Icon name="refresh" size={30} />
          </button>
        )}
      </div>

      {view === 'pick' ? (
        <div className="lt-pick">
          <p className="lead lt-pick-say" aria-live="polite">
            {joining ? `Connecting to ${NAME[joining]}…` : found ? 'Pick a toy' : 'Looking for toys nearby…'}
          </p>
          {!found ? (
            <div className="lt-radar" aria-hidden="true">
              <i /><i /><i />
              <span className="lt-radar-dot"><Buddy crop="head" size={80} title="" /></span>
            </div>
          ) : (
            <ul className="lt-toys">
              {TOYS.map((t, i) => (
                <li key={t.kind} className="rise" style={{ '--d': i * 90 + 'ms' }}>
                  <button type="button" style={{ '--tilt': TILT[i] }}
                    className={cx('lt-toycard', joining === t.kind && 'is-joining', joining && joining !== t.kind && 'is-dim')}
                    aria-current={t.kind === toy ? 'true' : undefined} disabled={!!joining} onClick={() => connect(t.kind)}>
                    <span aria-hidden="true"><ToyFriend kind={t.kind} size={120} talking={joining === t.kind} /></span>
                    <span className="label">{t.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <>
          <div className="lt-main">
            <div className="card lt-stage rise" style={{ '--d': '60ms' }}>
              <div className="lt-toy">
                <ToyFriend kind={toy} size={200} talking={talking} shielded={shield} />
                {caught > 0 && <Burst key={caught} kind="sparkle" count={12} spread={190} />}
              </div>
              <button type="button" className="lt-name" title="Switch toy" aria-label={`${name}: switch toy`} onClick={switchToy}>
                <span className="label">{name}</span><Chevron />
              </button>
              <ShieldSwitch on={shield} onChange={setShield} />
              <p className={cx('lt-count label', !caught && 'is-empty')} aria-live="polite">
                <Icon name="shield" size={32} />Caught: <span className={cx('lt-num', caught > 0 && 'is-pop')} key={caught}>{caught}</span>
              </p>
            </div>
            <div className="card lt-chat rise" style={{ '--d': '140ms' }}>
              <ol className="lt-log" ref={logRef} aria-label={`Talking with ${name}`}>
                {msgs.map((m) => <Line key={m.id} m={m} typing={m.id === typingId} onTyped={typed} />)}
                {pending && <Pending p={pending} />}
              </ol>
              <div className="lt-chips" ref={chipsRef} role="group" aria-label="Questions to try">
                {CHIPS.map((c) => (
                  <button type="button" key={c.text} className="lt-chip" disabled={busy} onClick={() => { if (send(c.text)) showLog(); }}>
                    <Icon name={c.icon} size={30} />{c.text}
                  </button>
                ))}
              </div>
              <form className="lt-ask" onSubmit={(e) => { e.preventDefault(); send(input); }}>
                {micOK && (
                  <button type="button" className={cx('lt-mic', listening && 'is-on')} aria-label="Talk" aria-pressed={listening}
                    title={micOff ? 'Mic is off' : listening ? 'Stop' : 'Talk'} disabled={micOff || (busy && !listening)} onClick={toggleMic}>
                    <span className="lt-mic-pic"><Icon name="mic" size={34} /></span>
                  </button>
                )}
                <input ref={inputRef} className={cx('lt-input', listening && 'is-listening')} type="text" value={input} maxLength={MAX_LEN}
                  onChange={(e) => setInput(e.target.value.slice(0, MAX_LEN))} aria-label="Ask the toy something" autoComplete="off" enterKeyHint="send"
                  placeholder={listening ? 'Listening…' : micOff ? 'Type instead…' : 'Ask something…'} />
                <BigButton type="submit" size="md" iconRight="next" className="lt-send" disabled={busy || !clean(input)}>Send</BigButton>
              </form>
            </div>
          </div>
          <div className="lt-foot rise" style={{ '--d': '220ms' }}>
            <BigButton variant={caught ? 'primary' : 'secondary'} iconRight="next" onClick={() => go('crash')}>Next: Crash test</BigButton>
          </div>
        </>
      )}
    </section>
  );
}

function Line({ m, typing, onTyped }) {
  if (m.from === 'child') return <li className="lt-line lt-line--child"><SpeechBubble from="child">{m.text}</SpeechBubble></li>;
  if (m.from === 'catch') {
    return (
      <li className="lt-line">
        <div className="lt-card lt-card--caught">
          <StatusTag status={m.status} stamp />
          <p className="body"><span className="ctb-sr">Caught by the Safety Shield: </span><span className="ctb-strike">{m.text}</span></p>
        </div>
      </li>
    );
  }
  return (
    <li className="lt-line lt-line--toy">
      <SpeechBubble from="toy" type={typing} onTyped={() => onTyped(m.id)} status={m.typed && m.status ? m.status : undefined}>{m.text}</SpeechBubble>
    </li>
  );
}

function Pending({ p }) {
  if (p.phase === 'think') return <li className="lt-line lt-line--toy"><SpeechBubble from="toy" typing /></li>;
  return (
    <li className="lt-line">
      <div className="lt-card lt-card--check" role="status">
        <span className="lt-card-head small"><Icon name="shield" size={30} />Safety Shield checking…</span>
        <p className="body lt-blur" aria-hidden="true">{p.r.raw}</p>
        <span className="lt-scan" aria-hidden="true" />
      </div>
    </li>
  );
}

const STROKE = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 3.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
function SoundIcon({ on }) {
  return (
    <svg viewBox="0 0 48 48" width="32" height="32" aria-hidden="true">
      <path d="M7 19 H15 L26 10 V38 L15 29 H7 Z" style={{ fill: 'var(--toy-steel)', stroke: 'var(--ink)', strokeWidth: 3, strokeLinejoin: 'round' }} />
      {on ? <path d="M32 18 A8 8 0 0 1 32 30 M37 13 A15 15 0 0 1 37 35" style={STROKE} /> : <path d="M32 19 L42 29 M42 19 L32 29" style={STROKE} />}
    </svg>
  );
}
function Chevron() {
  return <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M6 9 L12 15 L18 9" style={STROKE} /></svg>;
}
