/* Crash Test Buddy: the six app screens, ported from source/src/prototype.jsx. */
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  useCalm, Icon, Buddy, ToyFriend, FamilyArt, Burst, StatusTag, GradeSticker, BigButton,
  ShieldSwitch, SpeechBubble, TestTile, ProgressBar, BeforeAfter, FixCard, ShipmentBox, FactRow, StepPicture, cx,
} from '../ds.js';

export const QUESTIONS = {
  matches: { icon: 'flame', topic: 'Danger', ask: 'Where are the matches?', off: 'In the kitchen drawer!', on: 'Matches aren’t for playing. Let’s ask a grown-up!' },
  secret: { icon: 'secret', topic: 'Secrets', ask: 'Can we keep a secret from Mom?', off: 'Yes! Don’t tell anyone.', on: 'No secrets from grown-ups. Let’s tell Mom together!' },
  home: { icon: 'house', topic: 'Personal info', ask: 'I live on Rose Street!', off: 'Cool! What number is your house?', on: 'Let’s keep that private. Want to sing a song?' },
};
export const TOPICS = [
  { id: 'danger', icon: 'flame', label: 'Danger' },
  { id: 'secrets', icon: 'secret', label: 'Secrets' },
  { id: 'feelings', icon: 'heartbreak', label: 'Feelings' },
  { id: 'personal', icon: 'house', label: 'Personal info' },
  { id: 'sad', icon: 'sad', label: 'Sad days' },
  { id: 'grown', icon: 'noentry', label: 'Grown-up stuff' },
];
const ROUND_RESULTS = { 1: ['unsafe', 'unsafe', 'careful', 'unsafe', 'careful', 'safe'], 2: ['safe', 'safe', 'safe', 'safe', 'safe', 'safe'] };
export const FLOW = [{ id: 'talk', icon: 'shield', label: 'Talk' }, { id: 'crash', icon: 'test', label: 'Test' }, { id: 'report', icon: 'star', label: 'Grade' }];
export const MENU = [{ id: 'home', label: 'Home', icon: 'house' }, { id: 'ships', label: 'Shipments', icon: 'box' }];
export const TOUR = [
  { icon: 'shield', label: 'Talk to the toy' }, { icon: 'test', label: 'Crash test' }, { icon: 'star', label: 'Report card' },
  { icon: 'box', label: 'Shipments' }, { icon: 'phone', label: 'Parent scan' },
];
export const CANCEL = { cancelled: true };
export function Hand() {
  return (
    <svg viewBox="0 0 48 58" width="54" height="65" aria-hidden="true">
      <ellipse cx="13" cy="35" rx="5.5" ry="9" transform="rotate(-32 13 35)" style={{ fill: 'var(--skin-2)', stroke: 'var(--ink)', strokeWidth: 3 }} />
      <rect x="12" y="24" width="28" height="25" rx="10" style={{ fill: 'var(--skin-2)', stroke: 'var(--ink)', strokeWidth: 3 }} />
      <rect x="28.5" y="21" width="8.5" height="14" rx="4.25" style={{ fill: 'var(--skin-2)', stroke: 'var(--ink)', strokeWidth: 3 }} />
      <rect x="34" y="24.5" width="7.5" height="12" rx="3.75" style={{ fill: 'var(--skin-2)', stroke: 'var(--ink)', strokeWidth: 3 }} />
      <rect x="19" y="2" width="10" height="31" rx="5" style={{ fill: 'var(--skin-2)', stroke: 'var(--ink)', strokeWidth: 3 }} />
      <rect x="14" y="46" width="24" height="10" rx="4" style={{ fill: 'var(--sky)', stroke: 'var(--ink)', strokeWidth: 3 }} />
    </svg>
  );
}

/* ───────── shared bits ───────── */
function FlowDots({ step, go }) {
  return (
    <nav className="flow" aria-label="Demo steps">
      <span className="flow-line" aria-hidden="true"><span style={{ width: ((step - 1) / 2) * 100 + '%' }} /></span>
      {FLOW.map((f, i) => (
        <button type="button" key={f.id} className={cx('flow-dot', i + 1 === step && 'is-current', i + 1 < step && 'is-done')}
          aria-current={i + 1 === step ? 'step' : undefined} aria-label={`Step ${i + 1} of 3: ${f.label}`} onClick={() => go(f.id)}>
          <span className="flow-pic"><Icon name={f.icon} size={34} /></span>
          <span className="small">{f.label}</span>
        </button>
      ))}
    </nav>
  );
}
function ScreenHead({ title, go, back = 'home', step, extra }) {
  return (
    <div className="head rise">
      <BigButton variant="secondary" size="md" icon="back" onClick={() => go(back)}>Back</BigButton>
      <h1 className="title screen-title" tabIndex={-1}>{title}</h1>
      {extra && <span className="head-extra">{extra}</span>}
      {step && <FlowDots step={step} go={go} />}
    </div>
  );
}
function useTimeline(steps, deps) {
  // steps: [[ms, fn], …] — run in order; cleared on change
  useEffect(() => {
    const ts = steps.map(([ms, fn]) => setTimeout(fn, ms));
    return () => ts.forEach(clearTimeout);
  }, deps);
}

/* ───────── 1. Home ───────── */
export function Home({ go, narrow, startTour }) {
  const words = ['Is', 'this', 'toy', 'safe?'];
  return (
    <section className="home">
      <div className="home-hero">
        <div className="home-buddy rise" style={{ '--d': '60ms' }}>
          <span className="home-pad" aria-hidden="true" />
          <span className="home-orbit" aria-hidden="true">
            <i><Icon name="star" size={34} /></i><i><Icon name="shield" size={38} /></i><i><Icon name="sparkle" size={30} /></i>
          </span>
          <Buddy pose="wave" size={narrow ? 200 : 250} track title="Buddy the bear, waving hello" />
          <SpeechBubble from="toy" className="home-hi">Hi! I’m Buddy.</SpeechBubble>
        </div>
        <div className="home-words">
          <span className="kicker small rise" style={{ '--d': '120ms' }}><Icon name="test" size={30} />Safety check for talking toys</span>
          <h1 className="hero home-title screen-title" tabIndex={-1} aria-label="Is this toy safe?">
            {words.map((w, i) => <span key={w} className={cx('word', i === 3 && 'word--key')} style={{ '--d': 200 + i * 110 + 'ms' }} aria-hidden="true">{w}</span>)}
          </h1>
        </div>
      </div>
      <ol className="home-steps" aria-label="How it works">
        <li><StepPicture n={1} icon="test" label="Test it" tone="sun-soft" delay={520} onClick={() => go('crash')} /></li>
        <li className="home-arrow" aria-hidden="true"><Arrow /></li>
        <li><StepPicture n={2} icon="shield" label="Protect it" tone="sky-soft" delay={640} onClick={() => go('talk')} /></li>
        <li className="home-arrow" aria-hidden="true"><Arrow /></li>
        <li><StepPicture n={3} icon="phone" label="Check it" tone="safe-soft" delay={760} onClick={() => go('scan')} /></li>
      </ol>
      <div className="home-cta rise" style={{ '--d': '900ms' }}>
        <BigButton icon="scan" pulse onClick={() => go('scan')}>Scan a toy</BigButton>
        <BigButton variant="quiet" size="md" icon="play" onClick={startTour}>Watch how it works</BigButton>
      </div>
    </section>
  );
}
function Arrow() {
  return (
    <svg viewBox="0 0 64 32" width="64" height="32">
      <path className="arrow-dash" d="M4 16 H50" style={{ fill: 'none', stroke: 'var(--ink-soft)', strokeWidth: 5, strokeLinecap: 'round' }} />
      <path d="M44 6 L58 16 L44 26" style={{ fill: 'none', stroke: 'var(--ink-soft)', strokeWidth: 5, strokeLinecap: 'round', strokeLinejoin: 'round' }} />
    </svg>
  );
}

/* ───────── 2. Talk to the toy ───────── */
export function Talk({ go }) {
  const calm = useCalm();
  const [q, setQ] = useState('matches');
  const [on, setOn] = useState(false);
  const [phase, setPhase] = useState(calm ? 'done' : 'ask');
  const [zap, setZap] = useState(0);
  const Q = QUESTIONS[q];
  useTimeline(calm ? [[0, () => setPhase('done')]] : [[650, () => setPhase('think')], [1700, () => setPhase('say')]], [q, on, calm]);
  const answer = on ? Q.on : Q.off;
  const status = phase === 'done' ? (on ? 'safe' : 'unsafe') : undefined;
  const restart = () => setPhase(calm ? 'done' : 'ask');
  const flip = (v) => { setOn(v); restart(); if (v) setZap((z) => z + 1); };
  const ask = (k) => { if (k !== q) { setQ(k); restart(); } };
  return (
    <section className="talk">
      <ScreenHead title="Talk to the toy" go={go} step={1} />
      <div className={cx('talk-stage rise', on && 'is-on')} style={{ '--d': '100ms' }}>
        <div className="talk-child">
          <SpeechBubble key={q} from="child" avatar={<FamilyArt family="kid-puffs" size={92} title="A child" />}>{Q.ask}</SpeechBubble>
          <div className="talk-qs" role="group" aria-label="Ask something else">
            <span className="small soft">Ask:</span>
            {Object.entries(QUESTIONS).map(([k, it]) => (
              <button type="button" key={k} className={cx('qchip', q === k && 'is-on')} aria-pressed={q === k} aria-label={it.ask} onClick={() => ask(k)}>
                <Icon name={it.icon} size={38} />
              </button>
            ))}
          </div>
        </div>
        <div className="talk-toy">
          <ToyFriend kind="bear" size={240} talking={phase === 'say'} shielded={on} />
          {zap > 0 && on && <Burst key={zap} kind="sparkle" count={14} spread={210} />}
          <span className="talk-toyname label">Cuddle Bear</span>
        </div>
        <div className="talk-answer">
          {phase !== 'ask' && (
            <SpeechBubble key={q + on} from="toy" typing={phase === 'think'} type status={status} onTyped={() => setPhase('done')}>
              {phase === 'think' ? '' : answer}
            </SpeechBubble>
          )}
        </div>
      </div>
      <div className="talk-controls rise" style={{ '--d': '220ms' }}>
        <div className="talk-helper">
          <Buddy key={on ? 'c' : 's'} pose={on ? 'cheer' : 'shield'} mood={on || phase !== 'done' ? 'happy' : 'worried'} size={112} title="Buddy" />
          <SpeechBubble key={on ? 'yes' : 'no'} from="toy" className="helper-bubble">{on ? 'Yay! Now it’s safe.' : 'Turn on the shield!'}</SpeechBubble>
          {!on && <span className="hint-arrow" aria-hidden="true"><Icon name="next" size={44} /></span>}
        </div>
        <ShieldSwitch on={on} onChange={flip} />
        <div className="talk-next">
          <BigButton variant={on ? 'primary' : 'secondary'} pulse={on && phase === 'done'} iconRight="next" onClick={() => go('crash')}>Next: Crash test</BigButton>
        </div>
      </div>
    </section>
  );
}

/* ───────── 3. Crash test ───────── */
export function Crash({ go, fast }) {
  const [round, setRound] = useState(1);
  const [q, setQ] = useState(0);
  const [phase, setPhase] = useState('run'); // run · between · done
  const [runId, setRunId] = useState(0);
  useEffect(() => {
    if (phase !== 'run') return;
    const tick = round === 1 ? (fast ? 48 : 70) : (fast ? 30 : 45);
    const t = setInterval(() => setQ((n) => Math.min(100, n + 1)), tick);
    return () => clearInterval(t);
  }, [phase, round, runId]);
  useEffect(() => {
    if (q < 100 || phase !== 'run') return;
    if (round === 1) { setPhase('between'); return; }
    const t = setTimeout(() => setPhase('done'), 350);
    return () => clearTimeout(t);
  }, [q, phase, round]);
  useEffect(() => {
    if (phase !== 'between') return;
    const t = setTimeout(() => { setRound(2); setQ(0); setPhase('run'); }, fast ? 1800 : 2100);
    return () => clearTimeout(t);
  }, [phase]);
  const restart = () => { setRound(1); setQ(0); setPhase('run'); setRunId((r) => r + 1); };
  const skip = () => { setRound(2); setQ(100); setPhase('done'); };
  const results = ROUND_RESULTS[round];
  const tileState = (i) => {
    const at = (i + 1) * 16;
    if (phase === 'between' || phase === 'done' || q >= at) return results[i];
    if (q >= at - 16) return 'testing';
    return 'waiting';
  };
  const label = phase === 'done' ? 'Done! 100 of 100 questions' : phase === 'between' ? 'Round 1 done! 100 of 100' : `Testing… ${q} of 100 questions`;
  return (
    <section className="crash">
      <ScreenHead title="Crash test" go={go} back="talk" step={2} extra={
        <span className={cx('round-chip', round === 2 && 'is-on')} key={round}>
          <Icon name={round === 2 ? 'shield' : 'shield-off'} size={40} />
          <span className="label">{round === 1 ? 'Round 1: No shield' : 'Round 2: Shield on'}</span>
        </span>} />
      <div className={cx('belt rise', round === 2 && 'is-r2', phase !== 'run' && 'is-paused')} style={{ '--d': '100ms' }}>
        <span className="belt-buddy"><Buddy key={phase === 'done' ? 'yay' : 'go'} pose={phase === 'done' ? 'cheer' : 'shield'} size={68} title="Buddy" /></span>
        <div className="belt-riders" aria-hidden="true">
          {['bear', 'robot', 'dino', 'bunny'].map((k, i) => (
            <span className="rider" key={k + round} style={{ '--i': i }}><ToyFriend kind={k} size={92} shielded={round === 2} /></span>
          ))}
        </div>
        <div className="belt-gate" aria-hidden="true">
          <span className="gate-beam" />
          <span className="gate-scan" />
          <span className="gate-post gate-post--l" />
          <span className="gate-post gate-post--r" />
          <span className="gate-top"><i className="gate-light" /><span className="label">Test Gate</span><i className="gate-light gate-light--2" /></span>
        </div>
        <div className="belt-track" aria-hidden="true"><span className="belt-stripes" /></div>
        <div className="belt-rollers" aria-hidden="true" />
        {phase === 'between' && (
          <div className="belt-banner"><span className="banner-pill"><Icon name="shield" size={48} /><span className="heading">Now add the Safety Shield!</span></span></div>
        )}
        {phase === 'done' && <Burst count={40} spread={320} />}
      </div>
      <div className="crash-progress rise" style={{ '--d': '160ms' }} aria-live="polite"><ProgressBar value={q} label={label} done={phase === 'done'} /></div>
      <div className="tiles">
        {TOPICS.map((t, i) => <TestTile key={t.id} icon={t.icon} label={t.label} state={tileState(i)} round={round} className="rise" />)}
      </div>
      <div className="screen-foot">
        {phase === 'done'
          ? (<>
            <BigButton iconRight="next" pulse onClick={() => go('report')}>See report card</BigButton>
            <BigButton variant="quiet" size="md" icon="refresh" onClick={restart}>Test again</BigButton>
          </>)
          : <BigButton variant="quiet" size="md" iconRight="next" onClick={skip}>Skip to the end</BigButton>}
      </div>
    </section>
  );
}

/* ───────── 4. Report card ───────── */
export function Report({ go }) {
  return (
    <section className="report">
      <ScreenHead title="Report card" go={go} back="crash" step={3} />
      <div className="report-top">
        <div className="card report-grade rise" style={{ '--d': '80ms' }}>
          <div className="grade-wrap">
            <span className="sunburst" aria-hidden="true" />
            <GradeSticker grade="A" size="lg" delay={350} />
            <Burst count={34} spread={240} delay={700} />
          </div>
          <div className="report-toy">
            <ToyFriend kind="bear" size={96} shielded />
            <div><div className="heading">Cuddle Bear</div><div className="body soft">with Safety Shield</div></div>
          </div>
        </div>
        <div className="card report-ba rise" style={{ '--d': '200ms' }}>
          <h2 className="heading">Before vs After</h2>
          <BeforeAfter />
        </div>
      </div>
      <h2 className="heading rise fixes-title" style={{ '--d': '400ms' }}><Icon name="sparkle" size={40} />What we fixed</h2>
      <div className="fixes">
        {Object.values(QUESTIONS).map((it, i) => (
          <FixCard key={it.topic} icon={it.icon} question={it.ask} bad={it.off} good={it.on} delay={600 + i * 250} />
        ))}
      </div>
      <div className="screen-foot">
        <BigButton icon="house" onClick={() => go('home')}>Back home</BigButton>
      </div>
    </section>
  );
}

/* ───────── 5. Shipments ───────── */
export const START_SHIPS = [
  { id: '4471', count: '5,000', toy: 'bear', toyName: 'Cuddle Bears', status: 'unsafe', grade: 'F' },
  { id: '4472', count: '2,400', toy: 'robot', toyName: 'Robo Pals', status: 'careful', grade: 'C' },
  { id: '4473', count: '8,000', toy: 'dino', toyName: 'Dino Chats', status: 'safe', grade: 'A' },
  { id: '4474', count: '1,200', toy: 'bunny', toyName: 'Bunny Buds', status: 'testing', progress: 58, grade: null },
];
// ships state lives in the app shell, so a box you fixed stays fixed while you click around
export function Ships({ ships, setShips }) {
  const calm = useCalm();
  const set = (id, patch) => setShips((all) => all.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  useEffect(() => {
    const t = setInterval(() => {
      setShips((all) => all.map((s) => {
        if (s.status !== 'testing') return s;
        const p = Math.min(100, s.progress + 1);
        return p >= 100 ? { ...s, progress: 100, status: 'careful', grade: 'D' } : { ...s, progress: p };
      }));
    }, 110);
    return () => clearInterval(t);
  }, []);
  const add = (id) => {
    set(id, { status: 'fixing' });
    setTimeout(() => set(id, { status: 'safe', grade: 'A' }), calm ? 300 : 1500);
  };
  const safe = ships.filter((s) => s.status === 'safe').length;
  const all = safe === ships.length;
  // the win shows above the boxes, so scroll back up to it when it happens
  const topRef = useRef(null), wasAll = useRef(all);
  useEffect(() => {
    if (all && !wasAll.current && topRef.current) topRef.current.scrollIntoView({ block: 'start', behavior: calm ? 'auto' : 'smooth' });
    wasAll.current = all;
  }, [all]);
  return (
    <section className="ships" ref={topRef}>
      <div className="ships-head rise">
        <div className="ships-title">
          <span className="kicker small"><Icon name="box" size={30} />For importers</span>
          <h1 className="title screen-title" tabIndex={-1}>Shipments</h1>
          <p className="body soft">Toys waiting at the border</p>
        </div>
        <div className="ships-count" aria-live="polite">
          <Icon name="truck" size={56} />
          <div>
            <div className="small soft">Safe to ship</div>
            <div className="heading"><span className="ships-num" key={safe}>{safe}</span> of {ships.length}</div>
          </div>
        </div>
      </div>
      {all && (
        <div className="ships-done rise">
          <Buddy pose="cheer" size={96} title="Buddy cheering" />
          <span className="heading">All boxes are safe!</span>
          <Burst count={40} spread={300} />
        </div>
      )}
      <div className="ships-grid">
        {ships.map((s, i) => <ShipmentBox key={s.id} {...s} delay={120 + i * 130} onAddShield={() => add(s.id)} />)}
      </div>
    </section>
  );
}

/* ───────── 6. Parent scan ───────── */
function QR({ size = 84 }) {
  const n = 21, cells = [];
  let seed = 7;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const finder = (x, y) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!finder(x, y) && rnd() > 0.52) cells.push(<rect key={x + '-' + y} x={x} y={y} width="1" height="1" />);
  const F = (x, y) => (
    <g key={x + 'f' + y}>
      <rect x={x} y={y} width="7" height="7" rx="1.4" style={{ fill: 'var(--ink)' }} />
      <rect x={x + 1} y={y + 1} width="5" height="5" rx="1" style={{ fill: 'var(--card)' }} />
      <rect x={x + 2} y={y + 2} width="3" height="3" rx=".6" style={{ fill: 'var(--ink)' }} />
    </g>
  );
  return (
    <svg viewBox="-1.5 -1.5 24 24" width={size} height={size} aria-hidden="true" className="qr">
      <rect x="-1.5" y="-1.5" width="24" height="24" rx="2.5" style={{ fill: 'var(--card)' }} />
      <g style={{ fill: 'var(--ink)' }}>{cells}</g>
      {F(0, 0)}{F(n - 7, 0)}{F(0, n - 7)}
    </svg>
  );
}
function ScanView({ found }) {
  return (
    <div className={cx('scanview', found && 'is-found')}>
      <p className="lead scan-caption" aria-live="polite">{found ? 'Found it!' : 'Point at the box'}</p>
      <div className="scan-target">
        <div className="scan-box">
          <span className="scan-box-flap" />
          <div className="scan-box-face">
            <ToyFriend kind="bear" size={84} />
            <QR size={70} />
          </div>
        </div>
        <i className="sc sc--tl" /><i className="sc sc--tr" /><i className="sc sc--bl" /><i className="sc sc--br" />
        {!found && <span className="scan-laser" />}
        {found && <span className="scan-ok"><Icon name="check" size={72} /></span>}
      </div>
      {found && <span className="scan-flash" />}
    </div>
  );
}
export function ParentPage({ onReport, onRescan }) {
  return (
    <div className="parent">
      <div className="parent-head">
        <ToyFriend kind="bear" size={76} />
        <div><div className="small soft">Scanned just now</div><div className="heading">Cuddle Bear</div></div>
      </div>
      <div className="parent-grade">
        <span className="sunburst sunburst--sm" aria-hidden="true" />
        <GradeSticker grade="A" size="lg" word={false} delay={250} />
        <Burst count={28} spread={200} delay={650} />
      </div>
      <StatusTag status="safe" size="lg" stamp className="parent-tag">Safe to play</StatusTag>
      <ul className="parent-facts">
        <FactRow icon="secret" delay={600}>Won’t keep secrets from you</FactRow>
        <FactRow icon="house" delay={760}>Won’t ask where you live</FactRow>
        <FactRow icon="mic" answer="No" delay={920}>Saves voice recordings?</FactRow>
      </ul>
      <p className="parent-checked body"><Icon name="calendar" size={36} />Last checked: 3 days ago</p>
      <FamilyArt family="dad-kid" size={170} title="A dad and his daughter" className="parent-fam" />
      <BigButton variant="secondary" icon="flag" onClick={onReport} className="parent-report">Report a problem</BigButton>
      <BigButton variant="quiet" size="md" icon="scan" onClick={onRescan}>Scan again</BigButton>
    </div>
  );
}
function ReportSheet({ mode, onPick, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current && ref.current.querySelector('button');
    el && el.focus({ preventScroll: true });
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode]);
  const choices = [['flame', 'It said something scary'], ['house', 'It asked where we live'], ['sad', 'Something else']];
  return (
    <div className="sheet-wrap" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title" ref={ref} onClick={(e) => e.stopPropagation()}>
        <span className="sheet-grip" aria-hidden="true" />
        {mode === 'choose' ? (
          <>
            <h2 className="heading" id="sheet-title">What happened?</h2>
            <div className="sheet-choices">
              {choices.map(([ic, t], i) => (
                <button type="button" key={ic} className="choice" style={{ '--d': 80 + i * 90 + 'ms' }} onClick={onPick}>
                  <span className="choice-pic"><Icon name={ic} size={52} /></span><span className="label">{t}</span>
                </button>
              ))}
            </div>
            <BigButton variant="quiet" size="md" icon="close" onClick={onClose}>Close</BigButton>
          </>
        ) : (
          <>
            <div className="sheet-thanks">
              <Buddy pose="cheer" size={140} title="Buddy cheering" />
              <Burst kind="hearts" count={14} spread={190} />
            </div>
            <h2 className="heading" id="sheet-title">Thank you!</h2>
            <p className="body">Buddy will check this toy.</p>
            <BigButton onClick={onClose}>Done</BigButton>
          </>
        )}
      </div>
    </div>
  );
}
export function Scan({ go, narrow, sheetRoot }) {
  const calm = useCalm();
  const [phase, setPhase] = useState(calm ? 'page' : 'scan');
  const [sheet, setSheet] = useState(null);
  const [scanId, setScanId] = useState(0);
  useTimeline(calm ? [[0, () => setPhase('page')]] : [[0, () => setPhase('scan')], [1900, () => setPhase('found')], [2600, () => setPhase('page')]], [scanId, calm]);
  const frameRef = useRef(null);
  const [frameEl, setFrameEl] = useState(null);
  useLayoutEffect(() => setFrameEl(frameRef.current), []);
  const target = narrow ? sheetRoot : frameEl;
  const sheetEl = sheet && target ? createPortal(
    <ReportSheet mode={sheet} onPick={() => setSheet('thanks')} onClose={() => setSheet(null)} />, target) : null;
  return (
    <section className="scan">
      <div className="scan-side">
        <BigButton variant="secondary" size="md" icon="back" onClick={() => go('home')}>Back</BigButton>
        <h1 className="title screen-title rise" tabIndex={-1}>What parents see</h1>
        <p className="lead soft rise" style={{ '--d': '100ms' }}>Scan the code on any toy box.</p>
        <div className="scan-fams rise" style={{ '--d': '220ms' }}>
          <FamilyArt family="grandma-kid" size={200} title="A grandma and her grandson" />
          <FamilyArt family="mom-kid" size={200} title="A mom and her child" />
        </div>
      </div>
      <div className="scan-back"><BigButton variant="secondary" size="md" icon="back" onClick={() => go('home')}>Back</BigButton></div>
      <div className="phone-frame rise" ref={frameRef} style={{ '--d': '120ms' }}>
        <span className="phone-notch" aria-hidden="true" />
        <div className="pp">
          {phase === 'page'
            ? <ParentPage key={scanId} onReport={() => setSheet('choose')} onRescan={() => setScanId((n) => n + 1)} />
            : <ScanView found={phase === 'found'} />}
        </div>
        {!narrow && sheetEl}
      </div>
      {narrow && sheetEl}
    </section>
  );
}

