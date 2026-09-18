import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'
if (typeof window !== 'undefined') {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    const reloadKey = 'idz_chunk_reload';
    const last = sessionStorage.getItem(reloadKey);
    const now = Date.now();
    if (!last || now - Number(last) > 8000) {
      sessionStorage.setItem(reloadKey, String(now));
      window.location.reload();
    }
  });
}
if (import.meta.env.PROD && typeof window !== 'undefined' && window.location.pathname.startsWith('/tools') && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {}), { once: true });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary><App /></ErrorBoundary>
  </React.StrictMode>,
)
