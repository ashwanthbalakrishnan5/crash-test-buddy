// The design system's 19 parts (source/src/components.jsx), as ES exports.
import './react-global.js';
import '@ds/components.jsx';

export const {
  MotionProvider, useCalm, Icon, Buddy, ToyFriend, FamilyArt, Burst, StatusTag, GradeSticker, BigButton,
  ShieldSwitch, TopMenu, SpeechBubble, TestTile, ProgressBar, BeforeAfter, FixCard, ShipmentBox, FactRow, StepPicture,
} = window.CTB;
export const cx = (...a) => a.filter(Boolean).join(' ');
export const prefersReduced = () => { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } };
