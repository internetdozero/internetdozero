import React, { Suspense, useState, useEffect, useCallback, lazy } from 'react';
import { useTheme } from './hooks/useTheme';
import { useRouter } from './hooks/useRouter';
import { useLanguage } from './hooks/useLanguage';
import { Header } from './components/Header';
import { HubView } from './components/HubView';
import { Footer } from './components/Footer';

const BlogView = lazy(() => import('./modules/blog/BlogView').then((m) => ({ default: m.BlogView })));
const CommandPalette = lazy(() => import('./components/CommandPalette').then((m) => ({ default: m.CommandPalette })));
const ModuleModal = lazy(() => import('./components/ModuleModal').then((m) => ({ default: m.ModuleModal })));

export function App() {
  const { theme, toggleTheme } = useTheme();
  const { view: currentView, postId, navigate } = useRouter();
  const { lang, setLang, toggleLang } = useLanguage();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentView, postId]);

  const handleSelectModule = useCallback((m) => {
    if (m.id === 'blog') {
      navigate(lang === 'en' ? '/blog?lang=en' : '/blog');
    } else {
      setSelectedModule(m);
    }
  }, [navigate, lang]);

  const handleScrollToModules = useCallback(() => {
    if (currentView !== 'hub') navigate(lang === 'en' ? '/?lang=en' : '/');
    setTimeout(() => {
      const el = document.getElementById('modulos');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [currentView, navigate, lang]);

  const handleGoHome = useCallback(() => {
    navigate(lang === 'en' ? '/?lang=en' : '/');
  }, [navigate, lang]);

  const handleOpenCommand = useCallback(() => setIsCommandOpen(true), []);
  const handleCloseCommand = useCallback(() => setIsCommandOpen(false), []);
  const handleCloseModule = useCallback(() => setSelectedModule(null), []);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 bg-grid-pattern transition-colors duration-300">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenCommand={handleOpenCommand}
        onOpenArsenal={handleScrollToModules}
        onGoHome={handleGoHome}
        readingPost={currentView === 'blog' && postId}
        lang={lang}
        onToggleLang={setLang}
        onBackToBlog={() => navigate(lang === 'en' ? '/blog?lang=en' : '/blog')}
      />

      <main className="flex-1">
        {currentView === 'blog' ? (
          <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><span className="text-sm font-mono text-zinc-500 animate-pulse">Carregando…</span></div>}>
            <BlogView
              postId={postId}
              onNavigate={navigate}
              lang={lang}
              onToggleLang={setLang}
            />
          </Suspense>
        ) : (
          <HubView onSelectModule={handleSelectModule} lang={lang} />
        )}
      </main>

      <Footer
        lang={lang}
        onOpenArsenal={handleScrollToModules}
      />

      <Suspense fallback={null}>
        {isCommandOpen && (
          <CommandPalette
            isOpen={isCommandOpen}
            onClose={handleCloseCommand}
            onSelectModule={handleSelectModule}
            theme={theme}
            toggleTheme={toggleTheme}
            lang={lang}
            toggleLang={toggleLang}
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {selectedModule && (
          <ModuleModal
            module={selectedModule}
            onClose={handleCloseModule}
            lang={lang}
          />
        )}
      </Suspense>
    </div>
  );
}
