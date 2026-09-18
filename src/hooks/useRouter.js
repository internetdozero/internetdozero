import { useState, useEffect, useCallback } from 'react';

export function useRouter() {
  const parseLocation = () => {
    if (typeof window === 'undefined') return { view: 'hub', postSlug: null };
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    if (path.startsWith('/admin')) {
      return { view: 'admin', postSlug: null };
    }

    if (path.replace(/\/+$/, '') === '/links') {
      return { view: 'links', postSlug: null, postCategory: null };
    }

    if (path === '/tools' || path.startsWith('/tools/')) {
      const requestedToolSlug = path.split('/').filter(Boolean)[1] || null;
      const toolAliases = { 'image-compressor': 'compressor-de-imagem', 'password-generator': 'gerador-de-senhas', 'audio-master': 'masterizador-de-audio', 'metadata-remover': 'remover-metadados', 'audio-trimmer': 'cortador-de-audio', 'video-audio-extractor': 'extrator-de-audio', 'text-counter': 'contador-de-texto', 'qr-code-generator': 'gerador-de-qr-code', 'text-diff-checker': 'comparador-de-texto', 'json-formatter': 'formatador-json' };
      return { view: 'tools', toolSlug: toolAliases[requestedToolSlug] || requestedToolSlug, postSlug: null, postCategory: null };
    }

    if (path === '/quiz' || path.startsWith('/quiz/') || path === '/quizzes' || path.startsWith('/quizzes/')) {
      const requestedQuizSlug = path.split('/').filter(Boolean)[1] || null;
      return { view: 'quiz', quizSlug: requestedQuizSlug, postSlug: null, postCategory: null };
    }

    if (path.startsWith('/blog')) {
      if (path === '/blog/categorias') return { view: 'blog', postSlug: null, postCategory: null, blogCategories: true, blogCategory: null };
      const segments = path.replace(/\/+$/, '').split('/');
      const parts = segments.slice(2).filter(Boolean).map((part) => decodeURIComponent(part));
      const postCategory = parts.length > 1 ? parts[0] : null;
      let postSlug = parts.length > 1 ? parts.slice(1).join('/') : parts[0] || null;
      if (!postSlug) {
        postSlug = params.get('p') || null;
      }
      return { view: 'blog', postSlug, postCategory, blogCategories: false, blogCategory: params.get('category') || null };
    }
    if (path === '/') {
      return { view: 'hub', postSlug: null, postCategory: null };
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
    blogCategories: route.blogCategories,
    blogCategory: route.blogCategory,
    toolSlug: route.toolSlug,
    quizSlug: route.quizSlug,
    navigate
  };
}
