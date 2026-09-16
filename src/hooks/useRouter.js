import { useState, useEffect, useCallback } from 'react';

export function useRouter() {
  const parseLocation = () => {
    if (typeof window === 'undefined') return { view: 'hub', postSlug: null };
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    if (path.startsWith('/blog')) {
      // /blog/nome-do-artigo → postSlug = "nome-do-artigo"
      const segments = path.replace(/\/+$/, '').split('/');
      const postSlug = segments.length > 2 ? segments.slice(2).join('/') : null;
      return { view: 'blog', postSlug };
    }
    return { view: 'hub', postSlug: null };
  };

  const [route, setRoute] = useState(parseLocation);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseLocation());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((url) => {
    if (typeof window === 'undefined') return;
    window.history.pushState({}, '', url);
    setRoute(parseLocation());
  }, []);

  return {
    view: route.view,
    postSlug: route.postSlug,
    navigate
  };
}
