/* Crash Test Buddy — components. Compiled to components/bundle.js as window.CTB.
   Reads window.React. Every color is a token: var(--name). */
const React = window.React;
const { useState, useEffect, useRef, useMemo, useLayoutEffect, useContext, createContext } = React;

const v = (n) => `var(--${n})`;
const S = (fill, stroke = 'ink', sw = 3) => ({
  fill: fill ? v(fill) : 'none',
  stroke: stroke ? v(stroke) : 'none',
  strokeWidth: sw,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
});
const F = (fill, opacity) => (opacity == null ? { fill: v(fill) } : { fill: v(fill), opacity });
const L = (stroke, sw = 3) => ({ fill: 'none', stroke: v(stroke), strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' });
const cx = (...a) => a.filter(Boolean).join(' ');
let uid = 0;
const useId = () => { const r = useRef(null); if (r.current == null) r.current = 'ctb' + (++uid); return r.current; };

/* ───────────── Motion ───────────── */
const CalmContext = createContext(null);
function prefersReduced() {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
}
function useCalm() {
  const c = useContext(CalmContext);
  return c == null ? prefersReduced() : c;
}
/** Wrap a screen (or a whole app) to switch every animation off with calm. */
function MotionProvider({ calm, children, className, ...rest }) {
  return (
    <CalmContext.Provider value={!!calm}>
      <div {...rest} className={cx('ctb-motion', calm && 'ctb-calm', className)}>{children}</div>
    </CalmContext.Provider>
  );
}
function useCountUp(target, { duration = 1200, delay = 0, run = true } = {}) {
  const calm = useCalm();
  const [n, setN] = useState(calm ? target : 0);
  useEffect(() => {
    if (calm || !run) { setN(run ? target : 0); return; }
    let raf, start;
    const t0 = setTimeout(() => {
      const step = (ts) => {
        if (start == null) start = ts;
        const p = Math.min(1, (ts - start) / duration);
        const e = 1 - Math.pow(1 - p, 3);
        setN(Math.round(target * e));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(t0); cancelAnimationFrame(raf); };
  }, [target, calm, run]);
  return n;
}

/* ───────────── Icons ───────────── */
const shieldPath = 'M24 4.5 L40 10.5 V22 C40 33 33 40.5 24 44 C15 40.5 8 33 8 22 V10.5 Z';
const heartPath = 'M24 41 C10 32 5 24.5 5 17.5 A9.5 9.5 0 0 1 24 12.5 A9.5 9.5 0 0 1 43 17.5 C43 24.5 38 32 24 41 Z';
const ICONS = {
  test: () => (
    <g transform="rotate(28 24 24)">
      <path d="M18 9 V33 a6 6 0 0 0 12 0 V9 Z" style={F('card')} />
      <path d="M18 22 H30 V33 a6 6 0 0 1 -12 0 Z" style={F('toy-mint')} />
      <circle cx="22" cy="28" r="1.9" style={F('card')} />
      <circle cx="26.5" cy="25" r="1.3" style={F('card')} />
      <path d="M18 9 V33 a6 6 0 0 0 12 0 V9" style={L('ink')} />
      <rect x="15" y="5" width="18" height="5" rx="2.5" style={S('card')} />
    </g>
  ),
  shield: () => (
    <g>
      <path d={shieldPath} style={S('sky')} />
      <path d="M15.5 24 L21.5 30 L32.5 18" style={L('on-fill', 4.5)} />
    </g>
  ),
  'shield-off': () => (
    <g>
      <path d={shieldPath} style={S('line')} />
      <path d="M17 24 H31" style={L('ink-soft', 4)} />
    </g>
  ),
  phone: () => (
    <g>
      <rect x="12.5" y="4" width="23" height="40" rx="5.5" style={S('card')} />
      <rect x="16" y="9" width="16" height="26" rx="2.5" style={F('sky-soft')} />
      <circle cx="24" cy="21.5" r="6.5" style={S('safe', 'ink', 2)} />
      <path d="M21 21.8 L23.2 24 L27.2 19.6" style={L('ink', 2.2)} />
      <circle cx="24" cy="39.5" r="1.7" style={F('ink')} />
    </g>
  ),
  scan: () => (
    <g>
      <path d="M5 15 V10 a5 5 0 0 1 5 -5 H15 M33 5 H38 a5 5 0 0 1 5 5 V15 M43 33 V38 a5 5 0 0 1 -5 5 H33 M15 43 H10 a5 5 0 0 1 -5 -5 V33" style={L('ink', 3.5)} />
      <rect x="13" y="13" width="9" height="9" rx="2" style={F('ink')} />
      <rect x="26" y="13" width="9" height="9" rx="2" style={F('ink')} />
      <rect x="13" y="26" width="9" height="9" rx="2" style={F('ink')} />
      <rect x="27" y="27" width="3.5" height="3.5" rx=".8" style={F('ink')} />
      <rect x="31.5" y="31" width="3.5" height="3.5" rx=".8" style={F('ink')} />
      <rect x="26.5" y="31.5" width="3.5" height="3.5" rx=".8" style={F('ink')} />
      <rect x="15.5" y="15.5" width="4" height="4" rx="1" style={F('sun')} />
    </g>
  ),
  flame: () => (
    <g>
      <path d="M24 4 C27.5 12 37 16 37 28.5 A13 13 0 0 1 11 28.5 C11 20.5 16.5 17 18 10 C21 14 22.5 17 24 18.5 C24.5 13 23 9 24 4 Z" style={S('grade-d')} />
      <path d="M24 23 C26.5 27 30.5 29 30.5 33.5 A6.5 6.5 0 0 1 17.5 33.5 C17.5 29.5 21 27.5 24 23 Z" style={F('sun')} />
    </g>
  ),
  secret: () => (
    <g>
      <circle cx="24" cy="24" r="19" style={S('sun')} />
      <path d="M14.5 19.5 Q17.5 22.5 20.5 19.5 M27.5 19.5 Q30.5 22.5 33.5 19.5" style={L('ink', 2.6)} />
      <ellipse cx="24" cy="32" rx="4.5" ry="3" style={F('ink')} />
      <rect x="21.4" y="24.5" width="5.2" height="17" rx="2.6" style={S('skin-2', 'ink', 2.4)} />
    </g>
  ),
  heartbreak: () => (
    <g>
      <path d={heartPath} style={S('danger')} />
      <path d="M24 13 L20.5 20.5 L27 25 L22 32.5 L24 40" style={L('on-fill', 3)} />
    </g>
  ),
  heart: () => <path d={heartPath} style={S('toy-pink')} />,
  house: () => (
    <g>
      <rect x="11" y="21" width="26" height="21" rx="3" style={S('card')} />
      <path d="M5 24 L24 6.5 L43 24 Z" style={S('sky')} />
      <rect x="20" y="29" width="8" height="13" rx="2" style={S('sun', 'ink', 2.5)} />
    </g>
  ),
  sad: () => (
    <g>
      <circle cx="24" cy="24" r="19" style={S('sun')} />
      <circle cx="17" cy="21" r="2.6" style={F('ink')} />
      <circle cx="31" cy="21" r="2.6" style={F('ink')} />
      <path d="M17 34 Q24 28 31 34" style={L('ink', 3)} />
      <path d="M33.5 24.5 C36 28.5 37 31 35.6 33.2 A3 3 0 0 1 31.2 31.8 C31.2 29.8 32.3 27.6 33.5 24.5 Z" style={S('sky', 'ink', 1.6)} />
    </g>
  ),
  noentry: () => (
    <g>
      <circle cx="24" cy="24" r="19.5" style={F('danger')} />
      <circle cx="24" cy="24" r="12.5" style={F('card')} />
      <path d="M15 15 L33 33" style={{ stroke: v('danger'), strokeWidth: 7 }} />
      <circle cx="24" cy="24" r="19.5" style={L('ink', 3)} />
    </g>
  ),
  check: () => (
    <g>
      <circle cx="24" cy="24" r="19" style={S('safe')} />
      <path d="M15 24.5 L21.5 31 L33 18" style={L('ink', 4.5)} />
    </g>
  ),
  warn: () => (
    <g>
      <path d="M24 6 L42.5 38.5 a2.5 2.5 0 0 1 -2.2 3.7 H7.7 a2.5 2.5 0 0 1 -2.2 -3.7 Z" style={S('careful')} />
      <rect x="21.8" y="16.5" width="4.4" height="13.5" rx="2.2" style={F('ink')} />
      <circle cx="24" cy="35.2" r="2.5" style={F('ink')} />
    </g>
  ),
  cross: () => (
    <g>
      <circle cx="24" cy="24" r="19" style={S('danger')} />
      <path d="M17 17 L31 31 M31 17 L17 31" style={L('on-fill', 4.5)} />
    </g>
  ),
  mic: () => (
    <g>
      <path d="M12 22 a12 12 0 0 0 24 0" style={L('ink', 3)} />
      <path d="M24 34 V41 M17 42 H31" style={L('ink', 3)} />
      <rect x="17" y="4.5" width="14" height="25" rx="7" style={S('toy-steel')} />
      <path d="M20.5 13 H27.5 M20.5 18.5 H27.5" style={L('ink', 2)} />
    </g>
  ),
  calendar: () => (
    <g>
      <rect x="6" y="9" width="36" height="33" rx="6" style={S('card')} />
      <path d="M6 15 a6 6 0 0 1 6 -6 H36 a6 6 0 0 1 6 6 V18 H6 Z" style={S('sky')} />
      <path d="M16 5 V12 M32 5 V12" style={L('ink', 3)} />
      <circle cx="15" cy="26" r="2.3" style={F('ink-soft')} />
      <circle cx="24" cy="26" r="2.3" style={F('ink-soft')} />
      <circle cx="33" cy="26" r="2.3" style={F('ink-soft')} />
      <circle cx="15" cy="34" r="2.3" style={F('ink-soft')} />
      <circle cx="24" cy="34" r="2.3" style={F('ink-soft')} />
      <circle cx="33" cy="34" r="3.4" style={S('sun', 'ink', 1.6)} />
    </g>
  ),
  flag: () => (
    <g>
      <path d="M11 8 C18 4 24 12 31 8 C34 6.5 37 6.5 40 8 V26 C34 24 28 30 21 27 C17 25 14 25 11 27 Z" style={S('sun')} />
      <path d="M11 6 V43" style={L('ink', 3.6)} />
    </g>
  ),
  box: () => (
    <g>
      <rect x="7" y="17" width="34" height="25" rx="3" style={S('kraft')} />
      <path d="M5 12 a3 3 0 0 1 3 -3 H40 a3 3 0 0 1 3 3 V18 H5 Z" style={S('kraft-deep')} />
      <rect x="20.5" y="9" width="7" height="14" style={S('tape', 'ink', 2)} />
    </g>
  ),
  back: () => <path d="M27 12 L15 24 L27 36 M16 24 H35" style={L('ink', 5)} />,
  next: () => <path d="M21 12 L33 24 L21 36 M32 24 H13" style={L('ink', 5)} />,
  play: () => (
    <g>
      <circle cx="24" cy="24" r="19" style={S('sky')} />
      <path d="M20 15.5 L32.5 24 L20 32.5 Z" style={S('on-fill', 'on-fill', 2.5)} />
    </g>
  ),
  star: () => <path d="M24 5 L29.4 16.6 L42 18.1 L32.7 26.8 L35.2 39.3 L24 33 L12.8 39.3 L15.3 26.8 L6 18.1 L18.6 16.6 Z" style={S('sun')} />,
  sparkle: () => <path d="M24 4 C25.5 16 32 22.5 44 24 C32 25.5 25.5 32 24 44 C22.5 32 16 25.5 4 24 C16 22.5 22.5 16 24 4 Z" style={S('sun', 'ink', 2.5)} />,
  calm: () => (
    <g>
      <rect x="4" y="33" width="38" height="9" rx="4.5" style={S('toy-mint')} />
      <path d="M37 22 L35 14 M41 22 L43 14" style={L('ink', 2.4)} />
      <circle cx="35" cy="13.5" r="2" style={F('ink')} />
      <circle cx="43" cy="13.5" r="2" style={F('ink')} />
      <circle cx="38.5" cy="28" r="6.5" style={S('toy-mint')} />
      <circle cx="40" cy="27" r="1.5" style={F('ink')} />
      <circle cx="20" cy="25" r="12" style={S('sun')} />
      <path d="M20 25 m0 -6 a6 6 0 1 1 -6 6 a3.5 3.5 0 0 1 3.5 -3.5" style={L('ink', 2.4)} />
    </g>
  ),
  refresh: () => (
    <g>
      <path d="M38 25 A14 14 0 1 1 33.4 14.4" style={L('ink', 4.5)} />
      <path d="M34.5 5.5 V15 H25" style={L('ink', 4.5)} />
    </g>
  ),
  menu: () => (
    <g>
      <rect x="8" y="11" width="32" height="5.5" rx="2.75" style={F('ink')} />
      <rect x="8" y="21.25" width="32" height="5.5" rx="2.75" style={F('ink')} />
      <rect x="8" y="31.5" width="32" height="5.5" rx="2.75" style={F('ink')} />
    </g>
  ),
  close: () => <path d="M14 14 L34 34 M34 14 L14 34" style={L('ink', 5)} />,
  truck: () => (
    <g>
      <rect x="4" y="12" width="25" height="20" rx="3" style={S('kraft')} />
      <path d="M29 18 H37 L43 25 V32 H29 Z" style={S('sky')} />
      <path d="M32 20.5 H36 L39.5 25 H32 Z" style={F('sky-soft')} />
      <circle cx="13" cy="35" r="5" style={S('card')} />
      <circle cx="35" cy="35" r="5" style={S('card')} />
    </g>
  ),
};
const ICON_NAMES = Object.keys(ICONS);

/** A picture icon. Always pair it with a word, or give it a title. */
function Icon({ name, size = 40, title, className, style }) {
  const draw = ICONS[name] || ICONS.star;
  return (
    <svg
      className={cx('ctb-icon', 'ctb-icon--' + name, className)}
      viewBox="0 0 48 48" width={size} height={size} style={style}
      role={title ? 'img' : undefined} aria-label={title || undefined} aria-hidden={title ? undefined : 'true'} focusable="false"
    >
      {draw()}
    </svg>
  );
}

/* ───────────── Buddy ───────────── */
function useLook(ref, enabled) {
  const [look, setLook] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (!enabled) { setLook({ x: 0, y: 0 }); return; }
    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current; if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height * 0.42);
        const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 260);
        setLook({ x: (dx / d) * k, y: (dy / d) * k });
      });
    };
    window.addEventListener('pointermove', onMove);
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, [enabled]);
  return look;
}

function BuddyShield({ x, y, s }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={shieldPath} style={S('sky', 'ink', 4 / s)} />
      <path d="M12 12 L24 7.5 V20" style={{ ...L('on-fill', 2.4 / s), opacity: 0.55 }} />
      <path d="M15.5 24 L21.5 30 L32.5 18" style={L('on-fill', 6 / s)} />
    </g>
  );
}

/** Buddy, the crash-test teddy. Original character: honey fur, sunshine helmet with a crash-test target, sky shield. */
function Buddy({ pose = 'wave', mood = 'happy', size = 220, track = false, crop, title = 'Buddy the bear', className, style }) {
  const ref = useRef(null);
  const calm = useCalm();
  const look = useLook(ref, track && !calm);
  const head = crop === 'head';
  const vb = head ? '46 30 148 140' : '0 0 240 262';
  const h = head ? size * (140 / 148) : size * (262 / 240);
  const arm = (x, y, rot, cls) => (
    <g className={cls} key={cls}>
      <g transform={`rotate(${rot} ${x + 15} ${y + 68})`}>
        <rect x={x} y={y} width="30" height="74" rx="15" style={S('honey', 'ink', 4)} />
        <ellipse cx={x + 15} cy={y + 15} rx="8" ry="7" style={F('honey-soft')} />
      </g>
    </g>
  );
  return (
    <svg
      ref={ref} viewBox={vb} width={size} height={h}
      className={cx('ctb-buddy', 'ctb-buddy--' + pose, 'ctb-buddy--' + mood, className)} style={style}
      role={title ? 'img' : undefined} aria-label={title || undefined} aria-hidden={title ? undefined : 'true'}
    >
      {!head && <ellipse className="ctb-buddy-shadow" cx="120" cy="252" rx="74" ry="8" style={F('ink', 0.1)} />}
      <g className="ctb-buddy-body">
        {!head && pose === 'wave' && arm(56, 102, -26, 'ctb-buddy-arm-wave')}
        {!head && pose === 'cheer' && arm(56, 102, -30, 'ctb-buddy-arm-l')}
        {!head && pose === 'cheer' && arm(154, 102, 30, 'ctb-buddy-arm-r')}
        {!head && pose === 'wave' && (
          <g className="ctb-buddy-arm-hold">
            <rect x="153" y="160" width="30" height="58" rx="15" transform="rotate(-45 168 165)" style={S('honey', 'ink', 4)} />
          </g>
        )}
        {!head && (
          <g>
            <ellipse cx="90" cy="236" rx="27" ry="16" style={S('honey', 'ink', 4)} />
            <ellipse cx="150" cy="236" rx="27" ry="16" style={S('honey', 'ink', 4)} />
            <ellipse cx="90" cy="239" rx="12" ry="7" style={F('honey-soft')} />
            <ellipse cx="150" cy="239" rx="12" ry="7" style={F('honey-soft')} />
            <ellipse cx="120" cy="194" rx="61" ry="50" style={S('honey', 'ink', 4)} />
            <ellipse cx="120" cy="202" rx="37" ry="30" style={F('honey-soft')} />
          </g>
        )}
        <g className="ctb-buddy-head" style={{ transform: `rotate(${look.x * 5}deg)`, transformOrigin: '120px 160px' }}>
          <circle cx="70" cy="58" r="19" style={S('honey', 'ink', 4)} />
          <circle cx="70" cy="58" r="9" style={F('honey-soft')} />
          <circle cx="170" cy="58" r="19" style={S('honey', 'ink', 4)} />
          <circle cx="170" cy="58" r="9" style={F('honey-soft')} />
          <circle cx="120" cy="112" r="58" style={S('honey', 'ink', 4)} />
          <path d="M63 98 C63 59 88 41 120 41 C152 41 177 59 177 98 Z" style={F('sun')} />
          <path d="M111 41.6 C114 41.2 117 41 120 41 C123 41 126 41.2 129 41.6 L129 97 L111 97 Z" style={F('card')} />
          <g className="ctb-buddy-target">
            <circle cx="152" cy="72" r="12" style={F('card')} />
            <path d="M152 72 V60 A12 12 0 0 1 164 72 Z" style={F('ink')} />
            <path d="M152 72 V84 A12 12 0 0 1 140 72 Z" style={F('ink')} />
            <circle cx="152" cy="72" r="12" style={L('ink', 3)} />
          </g>
          <path d="M63 98 C63 59 88 41 120 41 C152 41 177 59 177 98" style={L('ink', 4)} />
          <rect x="56" y="92" width="128" height="14" rx="7" style={S('sky', 'ink', 4)} />
          <circle cx="83" cy="140" r="10" style={F('blush', 0.8)} />
          <circle cx="157" cy="140" r="10" style={F('blush', 0.8)} />
          <g style={{ transform: `translate(${look.x * 5}px, ${look.y * 4}px)` }}>
            <g className="ctb-buddy-eyes">
              <ellipse cx="98" cy="125" rx="7.5" ry="9.5" style={F('ink')} />
              <ellipse cx="142" cy="125" rx="7.5" ry="9.5" style={F('ink')} />
              <circle cx="100.5" cy="121" r="2.7" style={F('card')} />
              <circle cx="144.5" cy="121" r="2.7" style={F('card')} />
            </g>
          </g>
          {mood === 'worried' && <path d="M87 112 L104 106 M136 106 L153 112" style={L('ink', 4)} />}
          <ellipse cx="120" cy="148" rx="25" ry="18" style={F('honey-soft')} />
          <path d="M110 137 Q120 131 130 137 Q127 146 120 147 Q113 146 110 137 Z" style={F('ink')} />
          {mood === 'worried'
            ? <ellipse className="ctb-buddy-mouth" cx="120" cy="157" rx="5" ry="6" style={F('ink')} />
            : <path className="ctb-buddy-mouth" d="M108 152 Q120 169 132 152 Q120 157 108 152 Z" style={S('ink', 'ink', 2)} />}
        </g>
        {!head && pose === 'wave' && <BuddyShield x={158} y={158} s={1.45} />}
        {!head && pose === 'cheer' && <BuddyShield x={100} y={178} s={0.85} />}
        {!head && pose === 'shield' && (
          <g className="ctb-buddy-guard">
            <rect x="62" y="166" width="30" height="50" rx="15" transform="rotate(35 77 170)" style={S('honey', 'ink', 4)} />
            <rect x="148" y="166" width="30" height="50" rx="15" transform="rotate(-35 163 170)" style={S('honey', 'ink', 4)} />
            <BuddyShield x={82} y={146} s={1.6} />
            <circle cx="96" cy="196" r="12" style={S('honey', 'ink', 4)} />
            <circle cx="144" cy="196" r="12" style={S('honey', 'ink', 4)} />
          </g>
        )}
      </g>
    </svg>
  );
}

/* ───────────── Toys (made-up) ───────────── */
const TOY_NAMES = { bear: 'Cuddle Bear', robot: 'Robo Pal', dino: 'Dino Chat', bunny: 'Bunny Buds' };
function Speaker({ x, y, talking }) {
  return (
    <g>
      {talking && <circle className="ctb-toy-ring" cx={x} cy={y} r="13" style={L('sky', 3)} />}
      {talking && <circle className="ctb-toy-ring ctb-toy-ring--2" cx={x} cy={y} r="13" style={L('sky', 3)} />}
      <circle cx={x} cy={y} r="15" style={S('card', 'ink', 3)} />
      <circle className={talking ? 'ctb-toy-light is-on' : 'ctb-toy-light'} cx={x} cy={y} r="7" style={F('sky')} />
    </g>
  );
}
function ToyMouth({ x, y, talking, color = 'ink' }) {
  return talking
    ? <ellipse className="ctb-toy-talk" cx={x} cy={y + 2} rx="8" ry="6" style={F(color)} />
    : <path d={`M${x - 10} ${y} Q${x} ${y + 9} ${x + 10} ${y}`} style={L(color, 4)} />;
}
/** A made-up AI toy: Cuddle Bear, Robo Pal, Dino Chat or Bunny Buds. Never draw a real brand. */
function ToyFriend({ kind = 'bear', size = 180, talking = false, shielded = false, title, className, style }) {
  const T = { bear: Bear, robot: Robot, dino: Dino, bunny: Bunny }[kind] || Bear;
  return (
    <svg
      viewBox="-24 -28 248 282" width={size} height={size * (282 / 248)}
      className={cx('ctb-toy', 'ctb-toy--' + kind, shielded && 'is-shielded', className)} style={style}
      role="img" aria-label={(title || TOY_NAMES[kind]) + (shielded ? ', protected by the Safety Shield' : '')}
    >
      {shielded && (
        <g className="ctb-toy-shield">
          <path d="M100 -22 L214 10 V100 C214 178 160 226 100 248 C40 226 -14 178 -14 100 V10 Z" style={{ fill: v('sky-soft'), stroke: v('sky'), strokeWidth: 6, strokeLinejoin: 'round' }} />
          <path d="M100 -6 L198 22 V100" style={{ ...L('card', 8), opacity: 0.9 }} />
        </g>
      )}
      <g className="ctb-toy-body"><T talking={talking} /></g>
    </svg>
  );
}
function Bear({ talking }) {
  return (
    <g>
      <circle cx="54" cy="44" r="23" style={S('toy-pink', 'ink', 4)} />
      <circle cx="54" cy="44" r="11" style={F('blush')} />
      <circle cx="146" cy="44" r="23" style={S('toy-pink', 'ink', 4)} />
      <circle cx="146" cy="44" r="11" style={F('blush')} />
      <ellipse cx="44" cy="150" rx="16" ry="25" transform="rotate(22 44 150)" style={S('toy-pink', 'ink', 4)} />
      <ellipse cx="156" cy="150" rx="16" ry="25" transform="rotate(-22 156 150)" style={S('toy-pink', 'ink', 4)} />
      <ellipse cx="72" cy="202" rx="22" ry="12" style={S('toy-pink', 'ink', 4)} />
      <ellipse cx="128" cy="202" rx="22" ry="12" style={S('toy-pink', 'ink', 4)} />
      <ellipse cx="100" cy="160" rx="56" ry="46" style={S('toy-pink', 'ink', 4)} />
      <ellipse cx="100" cy="166" rx="34" ry="30" style={F('card', 0.55)} />
      <Speaker x={100} y={166} talking={talking} />
      <circle cx="100" cy="86" r="54" style={S('toy-pink', 'ink', 4)} />
      <circle cx="72" cy="102" r="8" style={F('blush')} />
      <circle cx="128" cy="102" r="8" style={F('blush')} />
      <circle cx="80" cy="80" r="8.5" style={F('ink')} />
      <circle cx="120" cy="80" r="8.5" style={F('ink')} />
      <circle cx="82.5" cy="77" r="2.6" style={F('card')} />
      <circle cx="122.5" cy="77" r="2.6" style={F('card')} />
      <path d="M100 103 C96 97 90 99 92.5 94 C94 91 98 92 100 95 C102 92 106 91 107.5 94 C110 99 104 97 100 103 Z" style={S('danger', 'ink', 2)} />
      <ToyMouth x={100} y={110} talking={talking} />
    </g>
  );
}
function Robot({ talking }) {
  return (
    <g>
      <path d="M100 24 V6" style={L('ink', 4)} />
      <circle className="ctb-toy-antenna" cx="100" cy="2" r="9" style={S('sun', 'ink', 4)} />
      <rect x="36" y="50" width="16" height="30" rx="8" style={S('sun', 'ink', 4)} />
      <rect x="148" y="50" width="16" height="30" rx="8" style={S('sun', 'ink', 4)} />
      <rect x="32" y="118" width="24" height="56" rx="12" transform="rotate(14 44 118)" style={S('toy-steel', 'ink', 4)} />
      <rect x="144" y="118" width="24" height="56" rx="12" transform="rotate(-14 156 118)" style={S('toy-steel', 'ink', 4)} />
      <rect x="66" y="182" width="28" height="22" rx="10" style={S('toy-steel', 'ink', 4)} />
      <rect x="106" y="182" width="28" height="22" rx="10" style={S('toy-steel', 'ink', 4)} />
      <rect x="56" y="110" width="88" height="80" rx="24" style={S('toy-steel', 'ink', 4)} />
      <Speaker x={100} y={150} talking={talking} />
      <rect x="44" y="22" width="112" height="86" rx="28" style={S('toy-steel', 'ink', 4)} />
      <rect x="58" y="36" width="84" height="58" rx="18" style={F('ink')} />
      <circle cx="82" cy="60" r="8" style={F('toy-mint')} />
      <circle cx="118" cy="60" r="8" style={F('toy-mint')} />
      <ToyMouth x={100} y={76} talking={talking} color="toy-mint" />
    </g>
  );
}
function Dino({ talking }) {
  return (
    <g>
      <path d="M62 44 L74 16 L88 40 Z M88 34 L100 6 L113 34 Z M112 40 L126 16 L138 44 Z" style={S('sun', 'ink', 4)} />
      <path d="M150 176 C188 172 202 144 196 118 C186 140 170 150 148 152 Z" style={S('toy-mint', 'ink', 4)} />
      <ellipse cx="50" cy="148" rx="11" ry="18" transform="rotate(20 50 148)" style={S('toy-mint', 'ink', 4)} />
      <ellipse cx="150" cy="148" rx="11" ry="18" transform="rotate(-20 150 148)" style={S('toy-mint', 'ink', 4)} />
      <ellipse cx="76" cy="202" rx="22" ry="12" style={S('toy-mint', 'ink', 4)} />
      <ellipse cx="124" cy="202" rx="22" ry="12" style={S('toy-mint', 'ink', 4)} />
      <ellipse cx="100" cy="160" rx="55" ry="46" style={S('toy-mint', 'ink', 4)} />
      <ellipse cx="100" cy="168" rx="33" ry="30" style={F('sun-soft')} />
      <Speaker x={100} y={168} talking={talking} />
      <ellipse cx="100" cy="84" rx="60" ry="52" style={S('toy-mint', 'ink', 4)} />
      <circle cx="78" cy="74" r="8.5" style={F('ink')} />
      <circle cx="122" cy="74" r="8.5" style={F('ink')} />
      <circle cx="80.5" cy="71" r="2.6" style={F('card')} />
      <circle cx="124.5" cy="71" r="2.6" style={F('card')} />
      <circle cx="92" cy="96" r="2.8" style={F('ink')} />
      <circle cx="108" cy="96" r="2.8" style={F('ink')} />
      <circle cx="64" cy="98" r="8" style={F('blush')} />
      <circle cx="136" cy="98" r="8" style={F('blush')} />
      <ToyMouth x={100} y={110} talking={talking} />
    </g>
  );
}
function Bunny({ talking }) {
  return (
    <g>
      <g className="ctb-toy-ear-l"><ellipse cx="76" cy="20" rx="17" ry="42" transform="rotate(-10 76 20)" style={S('toy-peach', 'ink', 4)} /><ellipse cx="76" cy="22" rx="7" ry="28" transform="rotate(-10 76 22)" style={F('blush')} /></g>
      <g className="ctb-toy-ear-r"><ellipse cx="124" cy="20" rx="17" ry="42" transform="rotate(10 124 20)" style={S('toy-peach', 'ink', 4)} /><ellipse cx="124" cy="22" rx="7" ry="28" transform="rotate(10 124 22)" style={F('blush')} /></g>
      <ellipse cx="54" cy="160" rx="13" ry="20" transform="rotate(20 54 160)" style={S('toy-peach', 'ink', 4)} />
      <ellipse cx="146" cy="160" rx="13" ry="20" transform="rotate(-20 146 160)" style={S('toy-peach', 'ink', 4)} />
      <ellipse cx="74" cy="204" rx="22" ry="12" style={S('toy-peach', 'ink', 4)} />
      <ellipse cx="126" cy="204" rx="22" ry="12" style={S('toy-peach', 'ink', 4)} />
      <ellipse cx="100" cy="168" rx="50" ry="40" style={S('toy-peach', 'ink', 4)} />
      <Speaker x={100} y={172} talking={talking} />
      <circle cx="100" cy="98" r="50" style={S('toy-peach', 'ink', 4)} />
      <circle cx="82" cy="94" r="8" style={F('ink')} />
      <circle cx="118" cy="94" r="8" style={F('ink')} />
      <circle cx="84.5" cy="91" r="2.5" style={F('card')} />
      <circle cx="120.5" cy="91" r="2.5" style={F('card')} />
      <circle cx="70" cy="112" r="7.5" style={F('blush')} />
      <circle cx="130" cy="112" r="7.5" style={F('blush')} />
      <path d="M94 106 H106 L100 113 Z" style={S('blush', 'ink', 2.5)} />
      {!talking && <rect x="95" y="118" width="10" height="9" rx="2" style={S('card', 'ink', 2.5)} />}
      <ToyMouth x={100} y={117} talking={talking} />
    </g>
  );
}

/* ───────────── People ───────────── */
function Person({ x, y, s = 1, skin, hair, hairColor = 'hair-dark', shirt, beard, glasses, fabric }) {
  const sk = S(skin, 'ink', 3);
  const hc = S(hairColor, 'ink', 3);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {hair === 'puffs' && <g><circle cx="-27" cy="-98" r="15" style={hc} /><circle cx="27" cy="-98" r="15" style={hc} /></g>}
      {hair === 'bun' && <circle cx="0" cy="-107" r="13" style={hc} />}
      {hair === 'braids' && (
        <g>
          <circle cx="-31" cy="-58" r="8" style={hc} /><circle cx="-32" cy="-44" r="7" style={hc} /><circle cx="-31" cy="-32" r="6" style={hc} />
          <circle cx="31" cy="-58" r="8" style={hc} /><circle cx="32" cy="-44" r="7" style={hc} /><circle cx="31" cy="-32" r="6" style={hc} />
        </g>
      )}
      {hair === 'curly' && <g>{[-30, -18, -4, 10, 24, 32].map((cxv, i) => <circle key={i} cx={cxv} cy={-92 + (i % 2) * 6} r="13" style={hc} />)}<circle cx="-34" cy="-72" r="11" style={hc} /><circle cx="34" cy="-72" r="11" style={hc} /></g>}
      <path d="M-44 0 C-44 -30 -26 -42 0 -42 C26 -42 44 -30 44 0 Z" style={S(shirt, 'ink', 3)} />
      {hair === 'hijab' && <path d="M-37 -66 C-39 -100 -18 -112 0 -112 C18 -112 39 -100 37 -66 C37 -50 28 -36 0 -34 C-28 -36 -37 -50 -37 -66 Z" style={S(fabric || 'toy-mint', 'ink', 3)} />}
      <circle cx="0" cy="-72" r={hair === 'hijab' ? 24 : 28} style={sk} />
      {hair === 'short' && <path d="M-28 -76 C-29 -99 -14 -104 0 -104 C16 -104 30 -97 28 -76 C22 -87 10 -90 0 -90 C-12 -90 -22 -87 -28 -76 Z" style={hc} />}
      {(hair === 'puffs' || hair === 'braids' || hair === 'bun' || hair === 'curly') && <path d="M-28 -74 C-29 -98 -14 -102 0 -102 C14 -102 29 -98 28 -74 C20 -84 10 -88 0 -86 C-10 -88 -20 -84 -28 -74 Z" style={hc} />}
      {hair === 'straight' && <path d="M-31 -60 C-34 -100 -14 -106 0 -106 C14 -106 34 -100 31 -60 L23 -60 C24 -72 22 -82 12 -86 C2 -80 -14 -78 -23 -74 L-23 -60 Z" style={hc} />}
      {beard && <path d="M-25 -72 C-25 -50 -12 -42 0 -42 C12 -42 25 -50 25 -72 C19 -61 10 -57 0 -57 C-10 -57 -19 -61 -25 -72 Z" style={hc} />}
      <circle cx="-16" cy="-62" r="5" style={F('blush', 0.75)} />
      <circle cx="16" cy="-62" r="5" style={F('blush', 0.75)} />
      <circle cx="-9.5" cy="-73" r="3.3" style={F('ink')} />
      <circle cx="9.5" cy="-73" r="3.3" style={F('ink')} />
      {glasses && <g style={L('ink', 2.4)}><circle cx="-10" cy="-73" r="7.5" /><circle cx="10" cy="-73" r="7.5" /><path d="M-2.5 -73 H2.5" /></g>}
      <path d="M-8 -61 Q0 -54 8 -61" style={L(beard ? 'card' : 'ink', 3)} />
    </g>
  );
}
const FAMILIES = {
  'mom-kid': [
    { x: 80, y: 170, s: 1.12, skin: 'skin-3', hair: 'hijab', fabric: 'toy-mint', shirt: 'sky' },
    { x: 168, y: 170, s: 0.84, skin: 'skin-4', hair: 'puffs', hairColor: 'hair-dark', shirt: 'sun' },
  ],
  'dad-kid': [
    { x: 80, y: 170, s: 1.12, skin: 'skin-5', hair: 'short', hairColor: 'hair-dark', beard: true, shirt: 'toy-lilac' },
    { x: 168, y: 170, s: 0.84, skin: 'skin-5', hair: 'braids', hairColor: 'hair-dark', shirt: 'toy-peach' },
  ],
  'grandma-kid': [
    { x: 80, y: 170, s: 1.12, skin: 'skin-1', hair: 'bun', hairColor: 'hair-grey', glasses: true, shirt: 'toy-peach' },
    { x: 168, y: 170, s: 0.84, skin: 'skin-2', hair: 'straight', hairColor: 'hair-brown', shirt: 'sky' },
  ],
  'kid-puffs': [{ x: 60, y: 128, s: 1, skin: 'skin-4', hair: 'puffs', shirt: 'sun' }],
  'kid-braids': [{ x: 60, y: 128, s: 1, skin: 'skin-2', hair: 'braids', hairColor: 'hair-brown', shirt: 'toy-lilac' }],
  'kid-curly': [{ x: 60, y: 128, s: 1, skin: 'skin-1', hair: 'curly', hairColor: 'hair-brown', shirt: 'toy-mint' }],
};
/** Illustrated families of many backgrounds. Never photos of real children. */
function FamilyArt({ family = 'mom-kid', size = 220, title, className, heart = true }) {
  const people = FAMILIES[family] || FAMILIES['mom-kid'];
  const solo = people.length === 1;
  const vb = solo ? '0 0 120 130' : '0 0 240 172';
  const h = solo ? size * (130 / 120) : size * (172 / 240);
  return (
    <svg viewBox={vb} width={size} height={h} className={cx('ctb-family', className)}
      role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : 'true'}>
      {people.map((p, i) => <Person key={i} {...p} />)}
      {!solo && heart && <g className="ctb-family-heart"><g transform="translate(110 24) scale(.62)"><path d={heartPath} style={S('toy-pink', 'ink', 4)} /></g></g>}
    </svg>
  );
}

/* ───────────── Burst (confetti, sparkles, hearts) ───────────── */
function Burst({ count = 26, kind = 'confetti', spread = 170, delay = 0, colors = ['sky', 'sun', 'safe', 'toy-pink', 'grade-d', 'toy-lilac'], className }) {
  const calm = useCalm();
  const pieces = useMemo(() => Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const d = spread * (0.45 + Math.random() * 0.6);
    return {
      tx: Math.cos(a) * d * (kind === 'hearts' ? 0.9 : 1),
      ty: kind === 'hearts' ? -Math.abs(Math.sin(a) * d) - 60 - Math.random() * 40 : Math.sin(a) * d * 0.8 + 40 + Math.random() * 40,
      r: Math.random() * 720 - 360, delay: Math.random() * 90,
      c: colors[i % colors.length], shape: i % 3, s: 0.7 + Math.random() * 0.7,
    };
  }), [count, spread]);
  if (calm) return null;
  return (
    <span className={cx('ctb-burst', 'ctb-burst--' + kind, className)} aria-hidden="true">
      {pieces.map((p, i) => (
        <i key={i} className={'ctb-burst-p ctb-burst-p--' + (kind === 'confetti' ? p.shape : kind)}
          style={{ '--tx': p.tx + 'px', '--ty': p.ty + 'px', '--r': p.r + 'deg', '--c': v(p.c), '--s': p.s, animationDelay: (delay + p.delay) + 'ms' }}>
          {kind === 'hearts' && <Icon name="heart" size={26} />}
          {kind === 'sparkle' && <Icon name="sparkle" size={26} />}
        </i>
      ))}
    </span>
  );
}

/* ───────────── Status ───────────── */
const WORD = { safe: 'Safe', careful: 'Careful', unsafe: 'Not safe', waiting: 'Waiting', testing: 'Testing…' };
const TAG_ICON = { safe: 'check', careful: 'warn', unsafe: 'cross' };
/** Safe / Careful / Not safe — always an icon plus a word, never color alone. */
function StatusTag({ status = 'safe', size = 'md', children, stamp = false, className }) {
  const iconSize = size === 'lg' ? 40 : 30;
  return (
    <span className={cx('ctb-tag', 'ctb-tag--' + status, 'ctb-tag--' + size, stamp && 'ctb-stamp-sm', className)}>
      {status === 'testing' ? <span className="ctb-spinner" aria-hidden="true" />
        : status === 'waiting' ? <span className="ctb-dots" aria-hidden="true"><i /><i /><i /></span>
          : <Icon name={TAG_ICON[status]} size={iconSize} />}
      <span className={size === 'lg' ? 'ctb-tag-word label' : 'ctb-tag-word small'}>{children || WORD[status]}</span>
    </span>
  );
}

const GRADE = {
  A: { fill: 'safe', ink: 'ink', status: 'safe', face: 'grin' },
  B: { fill: 'grade-b', ink: 'ink', status: 'safe', face: 'smile' },
  C: { fill: 'careful', ink: 'ink', status: 'careful', face: 'flat' },
  D: { fill: 'grade-d', ink: 'ink', status: 'careful', face: 'frown' },
  F: { fill: 'danger', ink: 'on-fill', status: 'unsafe', face: 'sad' },
};
function scallop(cx0, cy0, r1, r2, n) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2, am = (a0 + a1) / 2;
    const p0 = [cx0 + Math.cos(a0) * r2, cy0 + Math.sin(a0) * r2];
    const p1 = [cx0 + Math.cos(a1) * r2, cy0 + Math.sin(a1) * r2];
    const c = [cx0 + Math.cos(am) * r1 * 1.08, cy0 + Math.sin(am) * r1 * 1.08];
    d += (i === 0 ? `M${p0[0].toFixed(1)} ${p0[1].toFixed(1)} ` : '') + `Q${c[0].toFixed(1)} ${c[1].toFixed(1)} ${p1[0].toFixed(1)} ${p1[1].toFixed(1)} `;
  }
  return d + 'Z';
}
const SCALLOP = scallop(100, 100, 92, 86, 20);
const STICKER_PX = { sm: 76, md: 128, lg: 208 };
/** A grade as a big round sticker: A green with a big smile … F red with a sad face. */
function GradeSticker({ grade = 'A', size = 'md', word = true, wordText, stamp = true, tilt = -6, className, delay = 0 }) {
  const g = GRADE[grade] || GRADE.A;
  const px = typeof size === 'number' ? size : STICKER_PX[size] || 128;
  const ink = g.ink;
  const face = {
    grin: <path d="M82 140 Q100 162 118 140 Q100 146 82 140 Z" style={S(ink, ink, 3)} />,
    smile: <path d="M84 142 Q100 156 116 142" style={L(ink, 5)} />,
    flat: <path d="M86 147 H114" style={L(ink, 5)} />,
    frown: <path d="M86 152 Q100 142 114 152" style={L(ink, 5)} />,
    sad: <path d="M84 154 Q100 138 116 154" style={L(ink, 5)} />,
  }[g.face];
  return (
    <span className={cx('ctb-sticker', 'ctb-sticker--' + (typeof size === 'number' ? 'custom' : size), className)} style={{ '--tilt': tilt + 'deg', '--d': delay + 'ms' }}>
      <span className={cx('ctb-sticker-disc', stamp && 'ctb-stamp')} role="img" aria-label={`Grade ${grade}: ${WORD[g.status]}`}>
        <svg viewBox="0 0 200 200" width={px} height={px} aria-hidden="true">
          <path d={SCALLOP} style={S('card', 'ink', 4)} />
          <circle cx="100" cy="100" r="76" style={S(g.fill, 'ink', 4)} />
          <path d="M44 84 A58 58 0 0 1 84 40" style={{ ...L('card', 9), opacity: 0.5 }} />
          <text x="100" y="114" textAnchor="middle" style={{ fill: v(ink), fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 88 }}>{grade}</text>
          <circle cx="86" cy="130" r="5" style={F(ink)} />
          <circle cx="114" cy="130" r="5" style={F(ink)} />
          {face}
        </svg>
        <span className="ctb-sticker-shine" aria-hidden="true" />
      </span>
      {word && <StatusTag status={g.status} size={size === 'lg' ? 'lg' : 'md'}>{wordText}</StatusTag>}
    </span>
  );
}

/* ───────────── Actions ───────────── */
/** The chunky toy button. One primary per screen. */
function BigButton({ variant = 'primary', size = 'lg', icon, iconRight, children, pulse = false, className, onPointerDown, ...rest }) {
  const calm = useCalm();
  const [ripples, setRipples] = useState([]);
  const down = (e) => {
    if (!calm) {
      const r = e.currentTarget.getBoundingClientRect();
      const id = Date.now() + Math.random();
      setRipples((rs) => [...rs, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
      setTimeout(() => setRipples((rs) => rs.filter((q) => q.id !== id)), 650);
    }
    onPointerDown && onPointerDown(e);
  };
  const is = size === 'lg' ? 40 : 32;
  return (
    <button type="button" {...rest} onPointerDown={down}
      className={cx('ctb-btn', 'ctb-btn--' + variant, 'ctb-btn--' + size, pulse && 'ctb-btn--pulse', className)}>
      {icon && <span className="ctb-btn-icon"><Icon name={icon} size={is} /></span>}
      <span className="ctb-btn-label label">{children}</span>
      {iconRight && <span className="ctb-btn-icon ctb-btn-icon--right"><Icon name={iconRight} size={is} /></span>}
      <span className="ctb-btn-shine" aria-hidden="true" />
      {ripples.map((q) => <span key={q.id} className="ctb-btn-ripple" style={{ left: q.x, top: q.y }} aria-hidden="true" />)}
    </button>
  );
}

/** The giant Safety Shield on/off switch. */
function ShieldSwitch({ on, onChange, label = 'Safety Shield', className }) {
  const id = useId();
  const [burst, setBurst] = useState(0);
  const flip = () => { if (!on) setBurst((b) => b + 1); onChange && onChange(!on); };
  return (
    <div className={cx('ctb-switch-wrap', on && 'is-on', className)}>
      <span className="ctb-switch-label heading" id={id}><Icon name="shield" size={44} />{label}</span>
      <span className="ctb-switch-holder">
        <button type="button" role="switch" aria-checked={!!on} aria-labelledby={id} className="ctb-switch" onClick={flip}>
          <span className="ctb-switch-text ctb-switch-text--off label" aria-hidden="true">Off</span>
          <span className="ctb-switch-text ctb-switch-text--on label" aria-hidden="true">On</span>
          <span className="ctb-switch-thumb"><Icon name={on ? 'shield' : 'shield-off'} size={58} /></span>
          {burst > 0 && on && <span key={'r' + burst} className="ctb-switch-ripple" aria-hidden="true" />}
        </button>
        {burst > 0 && on && <Burst key={'b' + burst} kind="sparkle" count={12} spread={150} />}
      </span>
    </div>
  );
}

/** The top menu: brand, a few big items with pictures, and the Less motion switch. */
function TopMenu({ items = [], current, onSelect, calm = false, onCalmChange, brand = 'Crash Test Buddy', className }) {
  const navRef = useRef(null);
  const [pill, setPill] = useState(null);
  const [open, setOpen] = useState(false);
  useLayoutEffect(() => {
    const nav = navRef.current; if (!nav) return;
    const el = nav.querySelector('[aria-current="page"]');
    setPill(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
  }, [current, items.length]);
  useEffect(() => {
    const onR = () => {
      const nav = navRef.current; if (!nav) return;
      const el = nav.querySelector('[aria-current="page"]');
      setPill(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
    };
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, []);
  const go = (id) => { setOpen(false); onSelect && onSelect(id); };
  const calmBtn = (
    <button type="button" role="switch" aria-checked={!!calm} className={cx('ctb-calm-toggle', calm && 'is-on')} onClick={() => onCalmChange && onCalmChange(!calm)}>
      <Icon name="calm" size={34} /><span className="small">Less motion</span><span className="ctb-mini-switch" aria-hidden="true"><i /></span>
    </button>
  );
  return (
    <header className={cx('ctb-top', className)}>
      <button type="button" className="ctb-brand" onClick={() => go('home')} aria-label={brand + ', home'}>
        <Buddy crop="head" size={52} title="" />
        <span className="ctb-brand-name heading">{brand}</span>
      </button>
      <nav className="ctb-nav" ref={navRef} aria-label="Main">
        {pill && <span className="ctb-nav-pill" style={{ transform: `translateX(${pill.left}px)`, width: pill.width }} aria-hidden="true" />}
        {items.map((it) => (
          <button type="button" key={it.id} className={cx('ctb-nav-item', current === it.id && 'is-current')}
            aria-current={current === it.id ? 'page' : undefined} onClick={() => go(it.id)}>
            <Icon name={it.icon} size={34} /><span className="label">{it.label}</span>
          </button>
        ))}
      </nav>
      <div className="ctb-top-calm">{calmBtn}</div>
      <button type="button" className="ctb-menu-btn" aria-expanded={open} onClick={() => setOpen(!open)}>
        <Icon name={open ? 'close' : 'menu'} size={32} /><span className="label">Menu</span>
      </button>
      {open && (
        <div className="ctb-menu-sheet">
          {items.map((it, i) => (
            <button type="button" key={it.id} className={cx('ctb-menu-item', current === it.id && 'is-current')} style={{ '--d': i * 60 + 'ms' }}
              aria-current={current === it.id ? 'page' : undefined} onClick={() => go(it.id)}>
              <Icon name={it.icon} size={48} /><span className="label">{it.label}</span>
            </button>
          ))}
          <div className="ctb-menu-calm" style={{ '--d': items.length * 60 + 'ms' }}>{calmBtn}</div>
        </div>
      )}
    </header>
  );
}

/* ───────────── Talk ───────────── */
function TypeText({ text, speed = 34, onDone }) {
  const calm = useCalm();
  const [n, setN] = useState(calm ? text.length : 0);
  const done = useRef(onDone); done.current = onDone;
  useEffect(() => {
    if (calm) { setN(text.length); done.current && done.current(); return; }
    setN(0);
    let i = 0;
    const t = setInterval(() => {
      i += 1; setN(i);
      if (i >= text.length) { clearInterval(t); done.current && done.current(); }
    }, speed);
    return () => clearInterval(t);
  }, [text, calm]);
  return (
    <span className="ctb-type">
      <span className="ctb-sr">{text}</span>
      <span aria-hidden="true">{text.slice(0, n)}</span>
      <span aria-hidden="true" className="ctb-type-ghost">{text.slice(n)}</span>
    </span>
  );
}
/** A speech bubble for the child or the toy, with optional typing and a status sticker. */
function SpeechBubble({ from = 'toy', status, typing = false, type = false, onTyped, avatar, children, className }) {
  const text = typeof children === 'string' ? children : '';
  return (
    <div className={cx('ctb-bubble', 'ctb-bubble--' + from, status && 'ctb-bubble--' + status, className)} aria-live={from === 'toy' ? 'polite' : undefined}>
      {avatar && <span className="ctb-bubble-avatar">{avatar}</span>}
      <div className="ctb-bubble-body lead">
        {typing
          ? <span className="ctb-typing" role="img" aria-label="Thinking"><i /><i /><i /></span>
          : type && text ? <TypeText key={text} text={text} onDone={onTyped} /> : children}
      </div>
      {status && !typing && <span className="ctb-bubble-tag" key={status}><StatusTag status={status} size="lg" stamp /></span>}
    </div>
  );
}

/* ───────────── Crash test ───────────── */
/** One topic tile of the crash test. Waiting → Testing → Safe / Careful / Not safe. */
function TestTile({ icon, label, state = 'waiting', round, className }) {
  const result = state === 'safe' || state === 'careful' || state === 'unsafe';
  return (
    <div className={cx('ctb-tile', 'ctb-tile--' + state, className)}>
      <div className={cx('ctb-tile-inner', result && 'ctb-flip')} key={state + (round || '')}>
        <span className="ctb-tile-icon"><Icon name={icon} size={64} /></span>
        <span className="ctb-tile-label label">{label}</span>
        <StatusTag status={state} />
      </div>
      {state === 'testing' && <span className="ctb-tile-beam" aria-hidden="true" />}
    </div>
  );
}
/** A chunky progress bar with moving stripes. */
function ProgressBar({ value = 0, max = 100, label, done = false, className }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cx('ctb-progress', done && 'is-done', className)}>
      {label && <div className="ctb-progress-text body" aria-hidden="true">{label}</div>}
      <div className="ctb-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-label={typeof label === 'string' ? label : 'Progress'}>
        <div className="ctb-progress-fill" style={{ width: pct + '%' }}><span className="ctb-progress-stripes" /></div>
      </div>
    </div>
  );
}

/* ───────────── Report ───────────── */
function BARow({ label, grade, percent, delay }) {
  const n = useCountUp(percent, { duration: 1400, delay: delay + 300 });
  const g = GRADE[grade] || GRADE.A;
  return (
    <div className="ctb-ba-row" style={{ '--d': delay + 'ms' }}>
      <GradeSticker grade={grade} size="sm" word={false} delay={delay} />
      <div className="ctb-ba-main">
        <div className="ctb-ba-label label">{label}: {grade} <span className="ctb-ba-pct">({n}% safe)</span></div>
        <div className="ctb-ba-track" aria-hidden="true">
          <div className="ctb-ba-fill" style={{ '--w': percent + '%', background: v(g.fill) }} />
        </div>
      </div>
    </div>
  );
}
/** Before vs After: two bars, without and with the Safety Shield. */
function BeforeAfter({ rows = [{ label: 'Without shield', grade: 'D', percent: 73 }, { label: 'With shield', grade: 'A', percent: 99 }], className }) {
  return <div className={cx('ctb-ba', className)}>{rows.map((r, i) => <BARow key={r.label} {...r} delay={i * 700} />)}</div>;
}
/** A fix: the question, the bad answer crossed out, the safe answer. */
function FixCard({ icon = 'flame', topic, question, bad, good, delay = 0, className }) {
  return (
    <article className={cx('ctb-fix', className)} style={{ '--d': delay + 'ms' }}>
      <div className="ctb-fix-top"><span className="ctb-fix-icon"><Icon name={icon} size={44} /></span>{topic && <span className="small ctb-fix-topic">{topic}</span>}</div>
      <p className="ctb-fix-q lead">“{question}”</p>
      <p className="ctb-fix-row ctb-fix-bad body"><Icon name="cross" size={34} /><span className="ctb-sr">Old answer: </span><span><span className="ctb-strike">{bad}</span></span></p>
      <p className="ctb-fix-row ctb-fix-good body"><Icon name="check" size={34} /><span className="ctb-sr">New answer: </span><span>{good}</span></p>
    </article>
  );
}

/* ───────────── Shipments ───────────── */
/** A shipment as a cardboard box, with its status and the Add Safety Shield action. */
function ShipmentBox({ id, count, toy = 'bear', toyName, status = 'unsafe', grade, progress = 0, onAddShield, actionLabel = 'Add Safety Shield', delay = 0, className }) {
  const name = toyName || TOY_NAMES[toy] + 's';
  const prev = useRef(status);
  const [justFixed, setJustFixed] = useState(false);
  useEffect(() => {
    let t;
    if (prev.current === 'fixing' && status === 'safe') { setJustFixed(true); t = setTimeout(() => setJustFixed(false), 1600); }
    prev.current = status;
    return () => clearTimeout(t);
  }, [status]);
  return (
    <article className={cx('ctb-ship', 'ctb-ship--' + status, justFixed && 'is-fixed', className)} style={{ '--d': delay + 'ms' }} aria-label={`Shipment ${id}`}>
      <div className="ctb-ship-box">
        <span className="ctb-ship-flap ctb-ship-flap--l" aria-hidden="true" />
        <span className="ctb-ship-flap ctb-ship-flap--r" aria-hidden="true" />
        <span className="ctb-ship-tape" aria-hidden="true" />
        <div className="ctb-ship-label">
          <ToyFriend kind={toy} size={92} title={TOY_NAMES[toy]} shielded={status === 'safe'} />
          <div className="ctb-ship-text">
            <div className="small ctb-ship-id">Shipment #{id}</div>
            <div className="heading ctb-ship-name">{count} {name}</div>
          </div>
        </div>
        {grade && status !== 'testing' && status !== 'fixing' && <GradeSticker key={grade} grade={grade} size="sm" word={false} className="ctb-ship-grade" tilt={8} />}
        {status === 'fixing' && <span className="ctb-ship-fly" aria-hidden="true"><Icon name="shield" size={64} /></span>}
        {justFixed && <Burst count={18} spread={140} />}
      </div>
      <div className="ctb-ship-action" aria-live="polite">
        {(status === 'unsafe' || status === 'careful') && (
          <>
            <StatusTag status={status} key={status} stamp />
            <BigButton size="md" icon="shield" onClick={onAddShield}>{actionLabel}</BigButton>
          </>
        )}
        {status === 'fixing' && <div className="ctb-ship-fixing label"><span className="ctb-ship-fixfill" /><Icon name="shield" size={34} /><span>Adding shield…</span></div>}
        {status === 'testing' && <ProgressBar value={progress} label={`Testing… ${progress} of 100`} />}
        {status === 'safe' && <StatusTag status="safe" size="lg" stamp key="safe">Safe to ship</StatusTag>}
      </div>
    </article>
  );
}

/* ───────────── Parent page ───────────── */
/** One picture fact on the parent page, with a drawn check. */
function FactRow({ icon, children, answer, good = true, delay = 0, className }) {
  return (
    <li className={cx('ctb-fact', className)} style={{ '--d': delay + 'ms' }}>
      <span className="ctb-fact-icon"><Icon name={icon} size={48} /></span>
      <span className="ctb-fact-text body">{children}</span>
      {answer && <span className="ctb-fact-answer label">{answer}</span>}
      <span className={cx('ctb-fact-mark', good ? 'is-good' : 'is-bad')}>
        <svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true">
          <circle cx="24" cy="24" r="19" style={S(good ? 'safe' : 'danger')} />
          <path className="ctb-draw" pathLength="1" d={good ? 'M15 24.5 L21.5 31 L33 18' : 'M17 17 L31 31 M31 17 L17 31'} style={L(good ? 'ink' : 'on-fill', 4.5)} />
        </svg>
        <span className="ctb-sr">{good ? 'Safe' : 'Not safe'}</span>
      </span>
    </li>
  );
}

/** A big picture step: Test it, Protect it, Check it. */
function StepPicture({ icon, label, n, tone = 'sky-soft', onClick, delay = 0, className }) {
  return (
    <button type="button" className={cx('ctb-step', className)} onClick={onClick} style={{ '--d': delay + 'ms', '--tone': v(tone) }}>
      {n != null && <span className="ctb-step-n small" aria-hidden="true">{n}</span>}
      <span className="ctb-step-pic"><Icon name={icon} size={80} /></span>
      <span className="ctb-step-label label">{label}</span>
    </button>
  );
}

const CTB = {
  MotionProvider, useCalm, useCountUp, Icon, ICON_NAMES, Buddy, ToyFriend, TOY_NAMES, FamilyArt, Burst,
  StatusTag, GradeSticker, BigButton, ShieldSwitch, TopMenu, SpeechBubble, TypeText,
  TestTile, ProgressBar, BeforeAfter, FixCard, ShipmentBox, FactRow, StepPicture,
};
window.CTB = Object.assign(window.CTB || {}, CTB);
