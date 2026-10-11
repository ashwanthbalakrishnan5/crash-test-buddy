import { useEffect } from 'react';
import { usePath, navigate } from './router.jsx';
import Landing from './landing/Landing.jsx';
import App from './app/App.jsx';

export default function Root() {
  const path = usePath();
  const inApp = path === '/app' || path.startsWith('/app/');
  useEffect(() => { document.documentElement.classList.toggle('is-app', inApp); }, [inApp]);
  // unknown pages fall back to the landing page with a clean URL
  useEffect(() => { if (!inApp && path !== '/') navigate('/' + window.location.hash, { replace: true }); }, [inApp, path]);
  return inApp ? <App /> : <Landing />;
}
