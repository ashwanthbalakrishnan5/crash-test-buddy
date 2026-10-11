/* App shell: routes, Laptop / Phone preview, Start over and the self-playing tour. */
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { MotionProvider, Icon, Buddy, Burst, BigButton, TopMenu, cx, prefersReduced } from '../ds.js';
import { navigate, usePath } from '../router.jsx';
import { Home, Talk, Crash, Report, Ships, Scan, Hand, MENU, TOUR, CANCEL, START_SHIPS } from './screens.jsx';
import LiveToy from './toy/LiveToy.jsx';
import './app.css';

// screen id -> URL under /app
const SLUGS = { home: '', talk: 'talk', crash: 'crash-test', report: 'report-card', ships: 'shipments', scan: 'scan', toy: 'toy' };
const toPath = (r) => '/app' + (SLUGS[r] ? '/' + SLUGS[r] : '');
const fromPath = (p) => Object.keys(SLUGS).find((r) => toPath(r) === p.replace(/\/+$/, '')) || null;
const NAV = [MENU[0], { id: 'toy', label: 'Live toy', icon: 'mic' }, ...MENU.slice(1), { id: 'site', label: 'About', icon: 'heart' }];

/* ───────── backdrop ───────── */
const SHAPES = [
  { k: 'blob', x: 4, y: 10, s: 120, c: 'sky-soft', d: 18, t: 7 },
  { k: 'block', x: 88, y: 8, s: 70, c: 'sun-soft', d: 30, t: 9 },
  { k: 'ring', x: 92, y: 62, s: 110, c: 'safe-soft', d: 14, t: 8 },
  { k: 'block', x: 8, y: 72, s: 56, c: 'careful-soft', d: 26, t: 6 },
  { k: 'blob', x: 70, y: 86, s: 90, c: 'danger-soft', d: 20, t: 10 },
  { k: 'star', x: 24, y: 40, s: 30, c: 'sun', d: 40, t: 5 },
  { k: 'star', x: 78, y: 34, s: 24, c: 'sun', d: 46, t: 6 },
  { k: 'ring', x: 46, y: 4, s: 46, c: 'sky-soft', d: 34, t: 7 },
];
function Backdrop({ innerRef }) {
  return (
    <div className="backdrop" ref={innerRef} aria-hidden="true">
      {SHAPES.map((s, i) => (
        <span key={i} className={'bd bd--' + s.k} style={{ left: s.x + '%', top: s.y + '%', '--depth': s.d, '--c': `var(--${s.c})`, '--sz': s.s + 'px' }}>
          <i style={{ animationDuration: s.t + 's', animationDelay: -i * 0.8 + 's' }}>{s.k === 'star' && <Icon name="sparkle" size={s.s} />}</i>
        </span>
      ))}
    </div>
  );
}

/* ───────── app ───────── */
export default function App() {
  const path = usePath();
  const route = fromPath(path) || 'home';
  useEffect(() => { if (!fromPath(path)) navigate('/app', { replace: true }); }, [path]);
  const [ships, setShips] = useState(START_SHIPS);
  const [leaving, setLeaving] = useState(false);
  const [calm, setCalm] = useState(prefersReduced());
  const [view, setView] = useState('laptop');
  const [tour, setTour] = useState(null); // null · { step } · { end: true }
  const [hand, setHand] = useState({ x: 0, y: 0, show: false, press: 0 });
  const tourRef = useRef(null), calmRef = useRef(calm), innerRef = useRef(null);
  calmRef.current = calm;
  const [epoch, setEpoch] = useState(0);
  const [narrow, setNarrow] = useState(false);
  const scrollRef = useRef(null), appRef = useRef(null), bdRef = useRef(null), sheetRef = useRef(null), first = useRef(true);
  const [sheetRoot, setSheetRoot] = useState(null);
  useLayoutEffect(() => setSheetRoot(sheetRef.current), []);
  useEffect(() => {
    const el = appRef.current; if (!el || !window.ResizeObserver) return;
    const ro = new ResizeObserver(([e]) => setNarrow(e.contentRect.width < 820));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const h = scrollRef.current && scrollRef.current.querySelector('.screen-title');
    h && h.focus({ preventScroll: true });
  }, [route, epoch]);
  const go = (r) => {
    if (r === route) { scrollRef.current && scrollRef.current.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' }); return; }
    if (r === 'site') { stopTour(); navigate('/'); window.scrollTo(0, 0); return; }
    const swap = () => { navigate(toPath(r)); setLeaving(false); if (scrollRef.current) scrollRef.current.scrollTop = 0; };
    if (calm) return swap();
    setLeaving(true);
    setTimeout(swap, 210);
  };
  const onMove = (e) => {
    if (calm || !bdRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    bdRef.current.style.setProperty('--px', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    bdRef.current.style.setProperty('--py', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  };
  // ---------- self-playing demo ----------
  const stopTour = () => { if (tourRef.current) tourRef.current.cancelled = true; tourRef.current = null; setTour(null); setHand((h) => ({ ...h, show: false })); };
  const startTour = () => {
    if (tourRef.current) tourRef.current.cancelled = true;
    const t = { cancelled: false };
    tourRef.current = t;
    setTour({ step: 0 });
    runTour(t).catch((e) => {
      if (e === CANCEL) return;
      if (window.console) console.warn('demo stopped', e);
      if (tourRef.current === t) stopTour();
    });
  };
  const runTour = async (t) => {
    const calmNow = () => calmRef.current;
    const check = () => { if (t.cancelled) throw CANCEL; };
    const wait = (ms) => new Promise((res) => setTimeout(res, calmNow() ? Math.min(ms, 900) : ms)).then(check);
    const root = () => innerRef.current;
    const find = (sel, text) => {
      const all = root() ? Array.from(root().querySelectorAll(sel)) : [];
      return all.find((el) => el.offsetParent !== null && (!text || el.textContent.includes(text))) || null;
    };
    const waitFor = async (sel, text, timeout = 16000) => {
      const t0 = Date.now();
      for (;;) {
        check();
        const el = find(sel, text);
        if (el) return el;
        if (Date.now() - t0 > timeout) throw new Error('waiting for ' + sel);
        await new Promise((r) => setTimeout(r, 120));
      }
    };
    const scrollParent = (el) => {
      let p = el.parentElement;
      while (p && p !== root()) {
        const oy = getComputedStyle(p).overflowY;
        if ((oy === 'auto' || oy === 'scroll') && p.scrollHeight > p.clientHeight + 2) return p;
        p = p.parentElement;
      }
      return null;
    };
    const show = async (el, where = 'center') => {
      if (!el) return;
      const sc = scrollParent(el); if (!sc) return;
      const er = el.getBoundingClientRect(), sr = sc.getBoundingClientRect();
      const top0 = where === 'top' || er.height > sc.clientHeight - 40 ? 24 : (sc.clientHeight - er.height) / 2;
      const top = Math.max(0, Math.min(sc.scrollTop + er.top - sr.top - top0, sc.scrollHeight - sc.clientHeight));
      if (Math.abs(top - sc.scrollTop) < 6) return;
      sc.scrollTo({ top, behavior: calmNow() ? 'auto' : 'smooth' });
      await wait(700);
    };
    const tap = async (el) => {
      check();
      await show(el);
      const box = root().getBoundingClientRect(), r = el.getBoundingClientRect();
      setHand((h) => ({ ...h, show: true, x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 }));
      await wait(850);
      setHand((h) => ({ ...h, press: h.press + 1 }));
      await wait(170);
      el.click();
      await wait(260);
      setHand((h) => ({ ...h, show: false }));
    };
    const step = (n) => setTour({ step: n });
    const box = root().getBoundingClientRect();
    setHand({ x: box.width / 2, y: box.height - 60, show: false, press: 0 });

    // 1 · Talk to the toy: hear the bad answer, switch the shield on, hear the safe one
    step(0); go('talk');
    await waitFor('.talk-answer .ctb-bubble--unsafe .ctb-bubble-tag', null, 12000);
    await show(find('.talk-answer'));
    await wait(1500);
    await tap(await waitFor('.talk-controls .ctb-switch'));
    await waitFor('.talk-answer .ctb-bubble--safe .ctb-bubble-tag', null, 12000);
    await show(find('.talk-answer'));
    await wait(1800);
    await tap(await waitFor('.talk-next .ctb-btn'));

    // 2 · Crash test: two rounds, then the report card
    step(1);
    await wait(1200);
    await show(find('.belt'), 'top');
    await waitFor('.belt-banner', null, 15000);
    await wait(2000);
    await show(find('.tiles'));
    const see = await waitFor('.screen--crash .screen-foot .ctb-btn--primary', null, 15000);
    await wait(1400);
    await tap(see);

    // 3 · Report card
    step(2);
    await wait(2400);
    await show(find('.report-ba'));
    await wait(2200);
    await show(find('.fixes-title'), 'top');
    await wait(3000);

    // 4 · Shipments: shield every box
    step(3);
    const nav = find('.ctb-nav-item', 'Shipments');
    if (nav) await tap(nav);
    else { await tap(await waitFor('.ctb-menu-btn')); await wait(500); await tap(await waitFor('.ctb-menu-item', 'Shipments')); }
    await wait(1600);
    for (let n = 0; n < 8; n++) {
      const next = await waitFor('.ships-done, .ctb-ship-action .ctb-btn', null, 12000);
      if (next.classList.contains('ships-done')) break;
      await tap(next);
      await wait(900);
    }
    await show(await waitFor('.ships-done', null, 8000), 'top');
    await wait(2200);

    // 5 · Parent scan, from Home
    step(4);
    await tap(await waitFor('.ctb-brand'));
    await wait(700);
    await tap(await waitFor('.home-cta .ctb-btn--primary'));
    await waitFor('.parent', null, 9000);
    await wait(2100);
    await show(find('.parent-facts'));
    await wait(2200);
    await show(find('.parent-report'));
    await wait(1400);
    check();
    tourRef.current = null;
    setTour({ end: true });
  };
  useEffect(() => {
    const el = innerRef.current; if (!el) return;
    const onClick = (e) => { if (tourRef.current && e.isTrusted && !e.target.closest('.tour-pill, .tour-end')) stopTour(); };
    el.addEventListener('click', onClick, true);
    // browser back / forward is a real action too
    const onPop = () => { if (tourRef.current) stopTour(); };
    window.addEventListener('popstate', onPop);
    return () => { el.removeEventListener('click', onClick, true); window.removeEventListener('popstate', onPop); };
  }, []);
  // the end card belongs to the screen the tour ended on
  useEffect(() => { setTour((t) => (t && t.end ? null : t)); }, [route]);
  // /app?tour=1 (the landing page's "Watch how it works") plays the tour on arrival
  const autoTour = useRef(new URLSearchParams(window.location.search).get('tour') === '1');
  useEffect(() => {
    if (!autoTour.current) return;
    navigate(window.location.pathname, { replace: true });
    const t = setTimeout(() => { autoTour.current = false; startTour(); }, 800);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => () => { if (tourRef.current) tourRef.current.cancelled = true; }, []);

  const screens = {
    home: <Home go={go} narrow={narrow} startTour={startTour} />, talk: <Talk go={go} />, crash: <Crash go={go} fast={!!(tour && !tour.end)} />, report: <Report go={go} />,
    ships: <Ships ships={ships} setShips={setShips} />, scan: <Scan go={go} narrow={narrow} sheetRoot={sheetRoot} />, toy: <LiveToy go={go} />,
  };
  return (
    <div className="proto">
      <div className="proto-bar">
        <div className="proto-seg" role="group" aria-label="Preview size">
          <button type="button" aria-pressed={view === 'laptop'} onClick={() => setView('laptop')}><DeviceIcon kind="laptop" />Laptop</button>
          <button type="button" aria-pressed={view === 'phone'} onClick={() => setView('phone')}><DeviceIcon kind="phone" />Phone</button>
        </div>
        <button type="button" className="proto-restart" onClick={() => { stopTour(); setShips(START_SHIPS); navigate('/app'); setEpoch((n) => n + 1); }}><Icon name="refresh" size={26} />Start over</button>
      </div>
      <div className={'proto-stage proto-stage--' + view}>
        <div className="proto-device">
          <MotionProvider calm={calm} className="app">
            <div ref={(el) => { appRef.current = el; innerRef.current = el; }} className="app-inner">
              <TopMenu items={NAV} current={['home', 'toy', 'ships'].includes(route) ? route : null} onSelect={go} calm={calm} onCalmChange={setCalm} />
              <div className={cx('app-body', tour && !tour.end && 'is-touring')} onPointerMove={onMove}>
                <Backdrop innerRef={bdRef} />
                <main className="app-scroll" ref={scrollRef}>
                  <div className={cx('screen', 'screen--' + route, leaving && 'is-leaving')} key={route + epoch}>{screens[route]}</div>
                </main>
                <div className="sheet-root" ref={sheetRef} />
                {tour && !tour.end && (
                  <div className="tour-pill" role="status" aria-label={'Playing: ' + TOUR[tour.step].label}>
                    <span className="tour-live" aria-hidden="true"><i /></span>
                    <ol className="tour-steps" aria-hidden="true">
                      {TOUR.map((s, i) => <li key={s.icon} className={cx(i === tour.step && 'is-on', i < tour.step && 'is-done')}><Icon name={s.icon} size={28} /></li>)}
                    </ol>
                    <button type="button" className="tour-stop" onClick={stopTour}><Icon name="close" size={24} /><span className="label">Stop</span></button>
                  </div>
                )}
                {tour && tour.end && (
                  <div className="tour-end" role="dialog" aria-modal="true" aria-labelledby="tour-end-title">
                    <div className="tour-end-card">
                      <Burst count={44} spread={280} />
                      <Buddy pose="cheer" size={150} title="Buddy cheering" />
                      <h2 className="title" id="tour-end-title">That’s Crash Test Buddy!</h2>
                      <div className="tour-end-steps">
                        <span><Icon name="test" size={48} /><span className="small">Test it</span></span>
                        <Icon name="next" size={28} />
                        <span><Icon name="shield" size={48} /><span className="small">Protect it</span></span>
                        <Icon name="next" size={28} />
                        <span><Icon name="phone" size={48} /><span className="small">Check it</span></span>
                      </div>
                      <BigButton icon="play" onClick={startTour}>Watch again</BigButton>
                      <BigButton variant="quiet" size="md" icon="house" onClick={() => { setTour(null); go('home'); }}>Home</BigButton>
                    </div>
                  </div>
                )}
              </div>
              <span className={cx('hand', hand.show && 'is-on')} style={{ transform: `translate(${hand.x}px, ${hand.y}px)` }} aria-hidden="true">
                {hand.press > 0 && <span className="hand-ring" key={hand.press} />}
                <span className="hand-pic" key={'p' + hand.press}><Hand /></span>
              </span>
            </div>
          </MotionProvider>
        </div>
      </div>
    </div>
  );
}
export function DeviceIcon({ kind }) {
  return kind === 'laptop'
    ? <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="4" y="5" width="16" height="11" rx="2" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 2.2 }} /><path d="M2 19 H22" style={{ stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round' }} /></svg>
    : <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="7" y="2.5" width="10" height="19" rx="2.5" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 2.2 }} /><path d="M11 18 H13" style={{ stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round' }} /></svg>;
}

