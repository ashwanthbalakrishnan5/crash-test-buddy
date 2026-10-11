import { useEffect } from 'react';
import { usePath } from './router.jsx';
import Landing from './landing/Landing.jsx';
import App from './app/App.jsx';

export default function Root() {
  const path = usePath();
  const inApp = path === '/app' || path.startsWith('/app/');
  useEffect(() => { document.documentElement.classList.toggle('is-app', inApp); }, [inApp]);
  return inApp ? <App /> : <Landing />;
}
