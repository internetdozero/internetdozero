import React, { Suspense, useState, useEffect, useCallback, lazy } from 'react';
import { useTheme } from './hooks/useTheme';
import { useRouter } from './hooks/useRouter';
import { useLanguage } from './hooks/useLanguage';
import { Header } from './components/Header';
import { HubView } from './components/HubView';
import { Footer } from './components/Footer';
import { FeedbackModal } from './components/FeedbackModal';
import { ErrorBoundary } from './components/ErrorBoundary';

const BlogView = lazy(() => import('./modules/blog/BlogView').then((m) => ({ default: m.BlogView })));
const AdminView = lazy(() => import('./modules/blog/AdminView').then((m) => ({ default: m.AdminView })));
const CommandPalette = lazy(() => import('./components/CommandPalette').then((m) => ({ default: m.CommandPalette })));
const ModuleModal = lazy(() => import('./components/ModuleModal').then((m) => ({ default: m.ModuleModal })));

export function App() {
  const { theme, toggleTheme } = useTheme();
  const { view: currentView, postSlug, postCategory, navigate } = useRouter();
  const { lang, setLang, toggleLang } = useLanguage();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentView, postSlug]);

  const handleSelectModule = useCallback((m) => {
    if (m.id === 'blog') {
      navigate('/blog');
    } else {
      setSelectedModule(m);
    }
  }, [navigate]);

  const handleScrollToModules = useCallback(() => {
    if (currentView !== 'hub') navigate('/');
    setTimeout(() => {
      const el = document.getElementById('modulos');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [currentView, navigate]);

  const handleGoHome = useCallback(() => {
    navigate('/');
  }, [navigate]);
  const handleGoAdmin = useCallback(() => navigate('/admin'), [navigate]);

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
        onGoAdmin={handleGoAdmin}
        readingPost={currentView === 'blog' && postSlug}
        lang={lang}
        onToggleLang={setLang}
        onBackToBlog={() => navigate('/blog')}
      />

      <main className="flex-1">
        {currentView === 'admin' ? (
          <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><span className="text-sm font-mono text-zinc-500 animate-pulse">Carregando…</span></div>}>
            <ErrorBoundary><AdminView onNavigate={navigate} /></ErrorBoundary>
          </Suspense>
        ) : currentView === 'blog' ? (
          <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><span className="text-sm font-mono text-zinc-500 animate-pulse">Carregando…</span></div>}>
            <ErrorBoundary><BlogView
              postSlug={postSlug}
              postCategory={postCategory}
              onNavigate={navigate}
              lang={lang}
              onToggleLang={setLang}
            /></ErrorBoundary>
          </Suspense>
        ) : (
          <ErrorBoundary><HubView onSelectModule={handleSelectModule} lang={lang} /></ErrorBoundary>
        )}
      </main>

      <Footer
        lang={lang}
        onOpenArsenal={handleScrollToModules}
      />
      <FeedbackModal />

      <Suspense fallback={null}>
        {isCommandOpen && (
          <ErrorBoundary>
          <CommandPalette
            isOpen={isCommandOpen}
            onClose={handleCloseCommand}
            onSelectModule={handleSelectModule}
            theme={theme}
            toggleTheme={toggleTheme}
            lang={lang}
            toggleLang={toggleLang}
          />
          </ErrorBoundary>
        )}
      </Suspense>

      <Suspense fallback={null}>
        {selectedModule && (
          <ErrorBoundary>
          <ModuleModal
            module={selectedModule}
            onClose={handleCloseModule}
            lang={lang}
          />
          </ErrorBoundary>
        )}
      </Suspense>
    </div>
  );
}
