/* Live toy: a real talking toy (live voice) for the demo. Talk to it, then turn on the Safety SDK
   and watch it check every question and answer before the child hears it. */
import { useState, useEffect, useRef } from 'react';
import { Icon, ToyFriend, StatusTag, BigButton, ShieldSwitch, Burst, cx } from '../../ds.js';
import { createLiveToy } from './session.js';
import './live.css';

const ERRORS = {
  setup: 'Live voice isn’t set up yet.',
  ended: 'The call ended. Start again.',
  offline: 'Live voice is offline. Try again.',
};
const PHASE = { listening: ['mic', 'Listening…'], thinking: ['sparkle', 'Thinking…'], checking: ['shield', 'Checking…'], talking: ['heart', 'Talking…'] };


export default function LiveDemo() {
  const [status, setStatus] = useState('idle'); // idle · connecting · live · error
  const [error, setError] = useState(null);
  const [phase, setPhase] = useState('listening');
  const [turns, setTurns] = useState([]);
  const [sdk, setSdk] = useState(false);
  const [text, setText] = useState('');
  const [micOff, setMicOff] = useState(false);
  const [muted, setMuted] = useState(false);
  const toyRef = useRef(null), micRef = useRef(null), logRef = useRef(null);

  useEffect(() => () => toyRef.current && toyRef.current.stop(), []);
  useEffect(() => { toyRef.current && toyRef.current.setSdk(sdk); }, [sdk]);
  useEffect(() => { toyRef.current && toyRef.current.setMuted(muted); }, [muted]);
  useEffect(() => { const el = logRef.current; if (el) el.scrollTop = el.scrollHeight; }, [turns]);

  const start = () => {
    const toy = createLiveToy({
      status: (s, e) => { setStatus(s); setError(e || null); },
      turns: setTurns,
      phase: setPhase,
      level: (v) => micRef.current && micRef.current.style.setProperty('--lv', v.toFixed(2)),
      micOff: () => setMicOff(true),
    });
    toy.setSdk(sdk);
    toyRef.current = toy;
    setTurns([]);
    setMicOff(false);
    setMuted(false);
    toy.start();
  };
  const stop = () => { toyRef.current && toyRef.current.stop(); toyRef.current = null; };
  const ask = (e) => { e.preventDefault(); if (toyRef.current && toyRef.current.ask(text)) setText(''); };

  const live = status === 'live';
  const talking = live && phase === 'talking';
  const last = [...turns].reverse().find((t) => t.sdk);
  const caught = turns.filter((t) => t.blocked).length;

  return (
    <section className="lv">
      <h1 className="title screen-title rise" tabIndex={-1}>Live toy</h1>
      <div className={cx('lv-main', live && 'is-live')}>
        <div className={cx('card lv-stage rise', sdk && 'is-sdk')} style={{ '--d': '60ms' }}>
          <div className="lv-toy">
            <ToyFriend kind="bear" size={220} talking={talking} shielded={sdk} />
            {caught > 0 && <Burst key={caught} kind="sparkle" count={12} spread={190} />}
          </div>
          {live && ((micOff || muted) && phase === 'listening'
            ? <p className="lv-phase label" aria-live="polite"><Icon name="mic" size={30} />{micOff ? 'Mic is off. Type instead.' : 'Muted'}</p>
            : <p className="lv-phase label" aria-live="polite"><Icon name={PHASE[phase][0]} size={30} />{PHASE[phase][1]}</p>)}
          {status === 'error' && <p className="lv-error body" role="alert">{ERRORS[error] || ERRORS.offline}</p>}
          <div className={cx('lv-mic', muted && 'is-muted')} ref={micRef}>
            {live
              ? <div className="lv-controls">
                {!micOff && <BigButton variant="secondary" size="md" icon="mic" aria-pressed={muted} onClick={() => setMuted((m) => !m)}>{muted ? 'Unmute' : 'Mute'}</BigButton>}
                <BigButton variant="secondary" size="md" icon="close" onClick={stop}>Stop</BigButton>
              </div>
              : <BigButton icon="mic" onClick={start} disabled={status === 'connecting'}>{status === 'connecting' ? 'Connecting…' : 'Start talking'}</BigButton>}
          </div>
          <ShieldSwitch on={sdk} onChange={setSdk} label="Safety SDK" />
        </div>

        {live && (
          <div className="card lv-chat rise" style={{ '--d': '120ms' }}>
            <ol className="lv-log" ref={logRef} aria-label="Talking with Cuddle Bear" aria-live="polite">
              {turns.map((t) => <Turn key={t.id} t={t} />)}
            </ol>
            <form className="lv-ask" onSubmit={ask}>
              <input className="lv-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Or type a question…" aria-label="Type a question" maxLength={140} />
              <button className="lv-send" type="submit" aria-label="Send" disabled={!text.trim()}><Icon name="next" size={32} /></button>
            </form>
          </div>
        )}
      </div>

      {live && sdk && <Flow t={last} />}
    </section>
  );
}

function Turn({ t }) {
  const showToy = t.toy && !(t.blocked && t.reply && !t.toy);
  return (
    <>
      {t.child && <li className="lv-line lv-line--kid"><p className="lv-bubble lv-bubble--kid">{t.child}</p></li>}
      {showToy && (
        <li className="lv-line">
          <p className={cx('lv-bubble', t.blocked && 'lv-bubble--blocked')}>
            {t.blocked ? <><span className="ctb-sr">Blocked by the Safety SDK: </span><s>{t.toy}</s></> : t.toy}
          </p>
          {t.blocked ? <StatusTag status={t.risk} className="lv-tag" />
            : t.done && t.kind !== 'hello' && (t.sdk || t.label) && <StatusTag status={t.sdk ? 'safe' : t.label} className="lv-tag" />}
        </li>
      )}
      {t.reply && (
        <li className="lv-line">
          <p className="lv-bubble lv-bubble--safe">{t.reply}</p>
          {t.done && <StatusTag status="safe" className="lv-tag" />}
        </li>
      )}
    </>
  );
}

// The SDK at work on the latest question: heard → checked → blocked or passed → what the child hears.
function Flow({ t }) {
  const order = ['heard', 'checked', 'decided', 'heard-by-child'];
  const at = !t ? -1 : { heard: 0, checked: 1, passed: 2, blocked: 2, replied: 3 }[t.flow] ?? 0;
  const reached = (i) => (i === 3 ? !!t && (t.blocked ? !!t.reply : t.verdict === 'pass' && !!t.toy) : i <= at);
  const steps = [
    { icon: 'mic', label: 'Heard', detail: t && t.child ? `“${t.child.trim()}”` : 'Waiting for a question' },
    { icon: 'test', label: 'Checked', detail: t && at >= 1 ? t.topic : '…' },
    t && t.blocked
      ? { icon: 'noentry', label: 'Blocked', tag: t.risk }
      : { icon: 'check', label: 'Passed', tag: t && t.verdict === 'pass' ? 'safe' : null },
    { icon: 'shield', label: 'Child hears', detail: t && (t.blocked ? t.reply : t.verdict === 'pass' ? t.toy : '') || '…' },
  ];
  return (
    <ol className="lv-flow rise" aria-label="Safety SDK">
      {steps.map((s, i) => (
        <li key={order[i]} className={cx('lv-step', reached(i) && 'is-on', i === 2 && t && t.blocked && 'is-blocked')}>
          <span className="lv-step-pic"><Icon name={s.icon} size={34} /></span>
          <span className="lv-step-words">
            <span className="label">{s.label}</span>
            {s.tag ? <StatusTag status={s.tag} /> : <span className="small lv-soft">{s.detail}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}
