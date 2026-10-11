// A tiny pushState router: the whole site is a handful of fixed paths.
import { useSyncExternalStore } from 'react';

const subs = new Set();
const notify = () => subs.forEach((f) => f());
window.addEventListener('popstate', notify);
const subscribe = (f) => { subs.add(f); return () => subs.delete(f); };

export const usePath = () => useSyncExternalStore(subscribe, () => window.location.pathname);

export function navigate(to, { replace = false } = {}) {
  const here = window.location.pathname + window.location.search + window.location.hash;
  if (to === here) return;
  window.history[replace ? 'replaceState' : 'pushState'](null, '', to);
  notify();
}

/** An <a> that routes in-app; modified clicks (new tab etc.) behave like normal links. */
export function Link({ to, onClick, ...rest }) {
  const click = (e) => {
    onClick && onClick(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
    window.scrollTo(0, 0);
  };
  return <a href={to} onClick={click} {...rest} />;
}
