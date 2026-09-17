import { useState, useEffect, useCallback } from 'react';

export function useRouter() {
  const parseLocation = () => {
    if (typeof window === 'undefined') return { view: 'hub', postSlug: null };
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    if (path.startsWith('/admin')) {
      return { view: 'admin', postSlug: null };
    }

    if (path.startsWith('/blog')) {
      const segments = path.replace(/\/+$/, '').split('/');
      const parts = segments.slice(2).filter(Boolean).map((part) => decodeURIComponent(part));
      const postCategory = parts.length > 1 ? parts[0] : null;
      let postSlug = parts.length > 1 ? parts.slice(1).join('/') : parts[0] || null;
      if (!postSlug) {
        postSlug = params.get('p') || null;
      }
      return { view: 'blog', postSlug, postCategory };
    }
    return { view: 'not-found', postSlug: null, postCategory: null };
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
    postCategory: route.postCategory,
    navigate
  };
}
