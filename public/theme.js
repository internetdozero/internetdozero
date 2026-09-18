if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
try {
  document.documentElement.classList.toggle('dark', localStorage.getItem('idz_theme') === 'dark');
} catch (_) {}
