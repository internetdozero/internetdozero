import { useState, useEffect, useCallback } from 'react';
import { translations } from '../i18n/translations';

const STORAGE_KEY = 'internetdozero_lang';

function getInitialLanguage() {
  if (typeof window === 'undefined') return 'pt';

  // 1. Prioridade máxima: URL param ?lang=en ou ?lang=pt
  const params = new URLSearchParams(window.location.search);
  const paramLang = params.get('lang')?.toLowerCase();
  if (paramLang === 'en' || paramLang === 'pt') {
    try {
      localStorage.setItem(STORAGE_KEY, paramLang);
    } catch (_) {}
    return paramLang;
  }

  // 2. Preferência salva anteriormente pelo usuário
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'pt') return saved;
  } catch (_) {}

  // 3. Detecção automática baseada no navegador
  const browserLang = (navigator.language || (navigator.languages && navigator.languages[0]) || '').toLowerCase();
  if (browserLang.startsWith('en')) {
    return 'en';
  }

  return 'pt';
}

export function useLanguage() {
  const [lang, setLangState] = useState(getInitialLanguage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch (_) {}
  }, [lang]);

  const setLang = useCallback((newLang) => {
    if (newLang === 'pt' || newLang === 'en') {
      setLangState(newLang);
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === 'pt' ? 'en' : 'pt'));
  }, []);

  const t = translations[lang] || translations.pt;

  return {
    lang,
    setLang,
    toggleLang,
    t
  };
}
