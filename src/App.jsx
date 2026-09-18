import React, { Suspense, useState, useEffect, useCallback, lazy } from 'react';
import { useTheme } from './hooks/useTheme';
import { useRouter } from './hooks/useRouter';
import { useLanguage } from './hooks/useLanguage';
import { Header } from './components/Header';
import { HubView } from './components/HubView';
import { Footer } from './components/Footer';
import { FeedbackModal } from './components/FeedbackModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NotFound } from './components/NotFound';

function safeLazy(importFn) {
  return lazy(async () => {
    try {
      return await importFn();
    } catch (error) {
      if (typeof window !== 'undefined') {
        const reloadKey = 'idz_chunk_reload';
        const last = sessionStorage.getItem(reloadKey);
        const now = Date.now();
        if (!last || now - Number(last) > 8000) {
          sessionStorage.setItem(reloadKey, String(now));
          window.location.reload();
          return new Promise(() => {});
        }
      }
      throw error;
    }
  });
}

const BlogView = safeLazy(() => import('./modules/blog/BlogView').then((m) => ({ default: m.BlogView })));
const AdminView = safeLazy(() => import('./modules/blog/AdminView').then((m) => ({ default: m.AdminView })));
const ToolsView = safeLazy(() => import('./modules/tools/ToolsView').then((m) => ({ default: m.ToolsView })));
const LinksView = safeLazy(() => import('./modules/links/LinksView').then((m) => ({ default: m.LinksView })));
const QuizView = safeLazy(() => import('./modules/quiz/QuizView').then((m) => ({ default: m.QuizView })));
const CommandPalette = safeLazy(() => import('./components/CommandPalette').then((m) => ({ default: m.CommandPalette })));
const ModuleModal = safeLazy(() => import('./components/ModuleModal').then((m) => ({ default: m.ModuleModal })));

export function App() {
  const { theme, toggleTheme } = useTheme();
  const { view: currentView, postSlug, postCategory, blogCategories, blogCategory, toolSlug, quizSlug, navigate } = useRouter();
  const { lang, setLang, toggleLang } = useLanguage();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentView, postSlug, toolSlug, quizSlug]);

  const handleSelectModule = useCallback((m) => {
    if (m.id === 'blog') {
      navigate('/blog');
    } else if (m.id === 'tools') {
      navigate('/tools');
    } else if (m.id === 'quizzes' || m.id === 'quiz') {
      navigate('/quiz');
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

  const handleOpenCommand = useCallback(() => setIsCommandOpen(true), []);
  const handleCloseCommand = useCallback(() => setIsCommandOpen(false), []);
  const handleCloseModule = useCallback(() => setSelectedModule(null), []);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-300">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenCommand={handleOpenCommand}
        onOpenArsenal={handleScrollToModules}
        onGoHome={handleGoHome}
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
              showCategories={blogCategories}
              initialCategory={blogCategory}
              onNavigate={navigate}
              lang={lang}
              onToggleLang={setLang}
            /></ErrorBoundary>
          </Suspense>
        ) : currentView === 'tools' ? (
          <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><span className="text-sm font-mono text-zinc-500 animate-pulse">Carregando…</span></div>}>
            <ErrorBoundary><ToolsView onNavigate={navigate} toolSlug={toolSlug} lang={lang} /></ErrorBoundary>
          </Suspense>
        ) : currentView === 'links' ? (
          <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><span className="text-sm font-mono text-zinc-500 animate-pulse">Carregando…</span></div>}>
            <ErrorBoundary><LinksView onNavigate={navigate} lang={lang} /></ErrorBoundary>
          </Suspense>
        ) : currentView === 'quiz' ? (
          <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><span className="text-sm font-mono text-zinc-500 animate-pulse">Carregando…</span></div>}>
            <ErrorBoundary><QuizView onNavigate={navigate} quizSlug={quizSlug} lang={lang} /></ErrorBoundary>
          </Suspense>
        ) : currentView === 'not-found' ? (
          <NotFound onGoHome={handleGoHome} onGoBlog={() => navigate('/blog')} lang={lang} />
        ) : (
          <ErrorBoundary><HubView onSelectModule={handleSelectModule} lang={lang} /></ErrorBoundary>
        )}
      </main>

      <Footer
        lang={lang}
        onOpenArsenal={handleScrollToModules}
        onGoHome={handleGoHome}
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
