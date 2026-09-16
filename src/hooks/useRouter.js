import { useState, useEffect, useCallback } from 'react';

export function useRouter() {
  const parseLocation = () => {
    if (typeof window === 'undefined') return { view: 'hub', postId: null };
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('p') || null;

    if (path.startsWith('/blog')) {
      return { view: 'blog', postId };
    }
    return { view: 'hub', postId: null };
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
    postId: route.postId,
    navigate
  };
}
