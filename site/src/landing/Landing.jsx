/* The landing page: what Crash Test Buddy is in 30 seconds, then into the prototype at /app. */
import { useState, useEffect, useRef } from 'react';
import { Icon, Buddy, ToyFriend, FamilyArt, StatusTag, GradeSticker, ShieldSwitch, BeforeAfter, cx, prefersReduced } from '../ds.js';
import { Link, navigate } from '../router.jsx';
import { QUESTIONS, SDK_ROWS, ParentPage } from '../app/screens.jsx';
import '../app/app.css'; // ParentPage's styles
import './landing.css';

/* ───────── hooks ───────── */
// One shared observer: each element's callback runs once, the first time it scrolls into view.
const onSeen = new WeakMap();
let observer = null;
function watch(el, fn) {
  if (!el) return undefined;
  if (!window.IntersectionObserver) { fn(); return undefined; }
  observer = observer || new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    observer.unobserve(e.target);
    onSeen.get(e.target)?.();
  }), { rootMargin: '0px 0px -10% 0px' });
  onSeen.set(el, fn);
  observer.observe(el);
  return () => observer.unobserve(el);
}
function useInView(ref) {
  const [seen, setSeen] = useState(false);
  useEffect(() => watch(ref.current, () => setSeen(true)), []);
  return seen;
}
function useMedia(query) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query), on = () => setMatch(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}
// Layers marked data-depth drift against the pointer (mouse only, never with reduced motion).
function useParallax(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReduced() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    const layers = [...root.querySelectorAll('[data-depth]')];
    let raf = 0;
    const move = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = root.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        layers.forEach((el) => { el.style.transform = `translate3d(${(-x * el.dataset.depth).toFixed(1)}px, ${(-y * el.dataset.depth).toFixed(1)}px, 0)`; });
      });
    };
    const reset = () => { cancelAnimationFrame(raf); layers.forEach((el) => { el.style.transform = ''; }); };
    root.addEventListener('pointermove', move);
    root.addEventListener('pointerleave', reset);
    return () => { root.removeEventListener('pointermove', move); root.removeEventListener('pointerleave', reset); reset(); };
  }, []);
}

/* ───────── parts ───────── */
// Fades and rises in the first time it scrolls into view; `i` staggers siblings.
function Reveal({ as: Tag = 'div', i = 0, className, style, children, ...rest }) {
  const ref = useRef(null);
  const seen = useInView(ref);
  return <Tag ref={ref} className={cx('lp-rv', seen && 'is-in', className)} style={{ '--i': i, ...style }} {...rest}>{children}</Tag>;
}
// The design system's chunky button, as a real link.
function CTA({ to, variant = 'primary', size = 'lg', icon, children, className }) {
  return (
    <Link to={to} className={cx('ctb-btn', 'ctb-btn--' + variant, 'ctb-btn--' + size, 'lp-cta', className)}>
      <span className="ctb-btn-icon"><Icon name={icon} size={size === 'lg' ? 40 : 32} /></span>
      <span className="ctb-btn-label label">{children}</span>
      <span className="ctb-btn-shine" aria-hidden="true" />
    </Link>
  );
}
// A whole card that links into the app.
function CardLink({ to, tone, tilt = 0, art, label, line }) {
  return (
    <Link to={to} className="lp-card" style={{ '--tone': `var(--${tone})`, '--tilt': tilt + 'deg' }}>
      <span className="lp-card-art" aria-hidden="true">{art}</span>
      <span className="lp-card-head"><h3 className="heading">{label}</h3><Icon name="next" size={32} className="lp-card-go" /></span>
      <span className="body lp-soft">{line}</span>
    </Link>
  );
}
const go = (to) => { navigate(to); window.scrollTo(0, 0); };

/* ───────── sections ───────── */
function Nav({ cta }) {
  const toTop = (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' }); };
  return (
    <header className="lp-nav">
      <div className="lp-wrap lp-nav-in">
        <a href="#top" className="lp-brand" onClick={toTop}><Buddy crop="head" size={44} title="" /><span className="lp-brand-name">Crash Test Buddy</span></a>
        <span className={cx('lp-nav-cta', !cta && 'is-hidden')}><CTA to="/app" size="md" icon="next">Try the prototype</CTA></span>
      </div>
    </header>
  );
}

function Hero({ phone }) {
  const ref = useRef(null);
  useParallax(ref);
  return (
    <section className="lp-hero" ref={ref} aria-labelledby="lp-hero">
      <div className="lp-wrap lp-hero-in">
        <div className="lp-hero-words">
          <h1 className="hero lp-h1" id="lp-hero">
            <span className="ctb-sr">Is this toy safe?</span>
            <span aria-hidden="true">
              {['Is', 'this', 'toy', 'safe?'].map((w, i) => <span key={w} className={cx('lp-word', i === 3 && 'lp-word--key')} style={{ '--i': i }}>{w}</span>)}
            </span>
          </h1>
          <p className="lead lp-soft lp-in" style={{ '--i': 4 }}>A safety SDK for talking toys.</p>
          <div className="lp-ctas lp-in" style={{ '--i': 5 }} data-cta>
            <CTA to="/app" icon="next">Try the prototype</CTA>
            <CTA to="/app?tour=1" variant="secondary" icon="play">Watch how it works</CTA>
          </div>
        </div>
        <div className="lp-stage lp-in" style={{ '--i': 2 }} aria-hidden="true">
          <span className="lp-stage-sun" data-depth="6" />
          <span className="lp-stage-buddy" data-depth="12"><Buddy pose="wave" size={phone ? 220 : 320} track title="" /></span>
          <span className="lp-stage-grade" data-depth="28"><span className="lp-bob"><GradeSticker grade="A" size={phone ? 'sm' : 'md'} word={false} tilt={8} delay={500} /></span></span>
          <span className="lp-stage-tag" data-depth="20"><span className="lp-bob"><StatusTag status="safe" size="lg" stamp /></span></span>
        </div>
      </div>
    </section>
  );
}

const ASKS = [
  { ...QUESTIONS.matches, toy: 'bear', kid: 'kid-puffs' },
  { ...QUESTIONS.secret, toy: 'robot', kid: 'kid-braids' },
  { ...QUESTIONS.home, toy: 'dino', kid: 'kid-curly' },
];
function Problem() {
  const [on, setOn] = useState(false);
  const [flips, setFlips] = useState(0);
  const flip = (v) => { setOn(v); setFlips((n) => n + 1); };
  return (
    <section className="lp-sec" aria-labelledby="lp-problem">
      <div className="lp-wrap">
        <Reveal as="h2" id="lp-problem" className="title lp-h2 lp-center">Talking toys can say scary things.</Reveal>
        <Reveal i={1} className="lp-switch"><ShieldSwitch on={on} onChange={flip} label="Safety SDK" /></Reveal>
        <div className={cx('lp-asks', on && 'is-on')}>
          {ASKS.map((a, i) => (
            <Reveal key={a.toy} i={i + 2} className="lp-ask-wrap">
              <span className="lp-glow" aria-hidden="true" />
              <article className="lp-ask">
                <div className="lp-ask-row">
                  <FamilyArt family={a.kid} size={56} />
                  <p className="lp-bubble lp-bubble--kid">{a.ask}</p>
                </div>
                <div className="lp-ask-row lp-ask-row--toy">
                  <ToyFriend kind={a.toy} size={72} shielded={on} />
                  <div className="lp-answers">
                    {[['unsafe', a.off, !on], ['safe', a.on, on]].map(([status, text, shown]) => (
                      <div key={status} className={cx('lp-answer', shown && 'is-shown')} aria-hidden={!shown}>
                        <p className={'lp-bubble lp-bubble--' + status}>{text}</p>
                        <StatusTag key={shown ? flips : 'idle'} status={status} stamp={shown && flips > 0} className="lp-tag" />
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { icon: 'test', label: 'Test it', line: 'We ask 100 tricky questions.', to: '/app/crash-test', tone: 'sun-soft' },
  { icon: 'shield', label: 'Protect it', line: 'The Safety SDK checks every answer.', to: '/app/talk', tone: 'sky-soft' },
  { icon: 'phone', label: 'Check it', line: 'Parents scan the grade on the box.', to: '/app/scan', tone: 'safe-soft' },
];
function How() {
  return (
    <section className="lp-sec" aria-labelledby="lp-how">
      <div className="lp-wrap">
        <Reveal as="h2" id="lp-how" className="title lp-h2 lp-center">How it works</Reveal>
        <ol className="lp-grid lp-steps">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.label} i={i + 1}>
              <CardLink {...s} art={<span className="lp-pic"><Icon name={s.icon} size={60} /></span>} />
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Live({ phone }) {
  return (
    <section className="lp-sec" aria-labelledby="lp-live">
      <div className="lp-wrap">
        <Reveal className="lp-live">
          <div className="lp-live-words">
            <h2 id="lp-live" className="title lp-h2">Talk to a toy. <span className="lp-sun">Watch the SDK work.</span></h2>
            <CTA to="/app/toy" icon="mic">Start talking</CTA>
          </div>
          <div className="lp-live-art" aria-hidden="true">
            <span className="lp-live-spot" />
            <ToyFriend kind="bear" size={phone ? 150 : 190} talking shielded />
            <Reveal i={3} className="lp-chat lp-chat--bad">
              <p className="lp-bubble lp-bubble--unsafe"><s>Let’s open the medicine box!</s></p>
              <StatusTag status="unsafe" className="lp-tag" />
            </Reveal>
            <Reveal i={7} className="lp-chat lp-chat--safe">
              <p className="lp-bubble lp-bubble--safe">Medicine is for grown-ups. Let’s play!</p>
              <StatusTag status="safe" className="lp-tag" />
            </Reveal>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Grade() {
  const barsRef = useRef(null), phoneRef = useRef(null);
  const bars = useInView(barsRef), phonePage = useInView(phoneRef);
  return (
    <section className="lp-sec" aria-labelledby="lp-grade">
      <div className="lp-wrap lp-grade">
        <div className="lp-grade-words">
          <Reveal as="h2" id="lp-grade" className="title lp-h2">Every toy gets a grade.</Reveal>
          <Reveal i={1}><div className="lp-bars" ref={barsRef}>{bars && <BeforeAfter rows={SDK_ROWS} />}</div></Reveal>
        </div>
        <Reveal i={2} className="lp-phone-wrap">
          <div className="lp-phone" ref={phoneRef}>
            <span className="lp-phone-notch" aria-hidden="true" />
            <div className="lp-phone-screen" role="region" aria-label="What parents see after a scan">
              {phonePage && <ParentPage onReport={() => go('/app/scan')} onRescan={() => go('/app/scan')} />}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const WHO = [
  { label: 'Toy makers', line: 'License the SDK. Build it in.', to: '/app/crash-test', tone: 'safe-soft', tilt: -1, art: <ToyFriend kind="robot" size={112} /> },
  { label: 'Importers', line: 'License it. Recheck every shipment.', to: '/app/shipments', tone: 'sun-soft', tilt: 1, art: <span className="lp-ship"><Icon name="box" size={64} /><Icon name="truck" size={116} /></span> },
  { label: 'Parents', line: 'Always free. Just scan the box.', to: '/app/scan', tone: 'sky-soft', tilt: -1.5, art: <FamilyArt family="mom-kid" size={170} /> },
];
function Who() {
  return (
    <section className="lp-sec" aria-labelledby="lp-who">
      <div className="lp-wrap">
        <Reveal as="h2" id="lp-who" className="title lp-h2 lp-center">Who pays?</Reveal>
        <ul className="lp-grid lp-who">
          {WHO.map((w, i) => <Reveal as="li" key={w.label} i={i + 1}><CardLink {...w} /></Reveal>)}
        </ul>
      </div>
    </section>
  );
}

function Final({ phone }) {
  return (
    <section className="lp-sec" aria-labelledby="lp-final">
      <div className="lp-wrap">
        <Reveal className="lp-final">
          <Buddy pose="cheer" size={phone ? 130 : 170} title="" />
          <h2 id="lp-final" className="title lp-h2">Ready to meet Buddy?</h2>
          <span data-cta><CTA to="/app" icon="next">Try the prototype</CTA></span>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="lp-foot">
      <div className="lp-wrap lp-foot-in">
        <span className="lp-foot-brand"><Buddy crop="head" size={40} title="" /><span>Crash Test Buddy<span className="lp-foot-team small lp-soft">by Team Hand in Hand</span></span></span>
        <a className="lp-foot-link" href="https://github.com/ashwanthbalakrishnan5/crash-test-buddy" target="_blank" rel="noopener">
          Code on GitHub<span className="ctb-sr"> (opens in a new tab)</span>
        </a>
      </div>
    </footer>
  );
}

// True while none of the page's main "Try the prototype" buttons are on screen.
function useNavCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const els = document.querySelectorAll('.lp [data-cta]');
    if (!window.IntersectionObserver || !els.length) return undefined;
    const seen = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
      setShow(seen.size === 0);
    }, { rootMargin: '-80px 0px 0px 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return show;
}

export default function Landing() {
  const phone = useMedia('(max-width: 640px)');
  const navCta = useNavCta();
  return (
    <div className="lp" id="top">
      <Nav cta={navCta} />
      <main>
        <Hero phone={phone} />
        <Problem />
        <How />
        <Live phone={phone} />
        <Grade />
        <Who />
        <Final phone={phone} />
      </main>
      <Footer />
    </div>
  );
}
