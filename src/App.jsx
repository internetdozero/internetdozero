import React, { useState, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import { useRouter } from './hooks/useRouter';
import { Header } from './components/Header';
import { HubView } from './components/HubView';
import { CommandPalette } from './components/CommandPalette';
import { ModuleModal } from './components/ModuleModal';
import { Footer } from './components/Footer';
import { BlogView } from './modules/blog/BlogView';
import { blogApi } from './modules/blog/services/blogApi';

export function App() {
  const { theme, toggleTheme } = useTheme();
  const { view: currentView, postId, navigate } = useRouter();
  const [selectedPost, setSelectedPost] = useState(null);
  const [postLang, setPostLang] = useState('pt');
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    if (postId) {
      blogApi.getPosts().then((posts) => {
        const found = posts.find((p) => p.id === postId);
        if (found) setSelectedPost(found);
      });
    } else if (currentView !== 'blog') {
      setSelectedPost(null);
    }
  }, [postId, currentView]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentView, selectedPost]);

  const handleSelectModule = (m) => {
    if (m.id === 'blog') {
      navigate('/blog');
    } else {
      setSelectedModule(m);
    }
  };

  const handleSelectPost = (post) => {
    if (post) {
      navigate(`/blog?p=${post.id}`);
      setSelectedPost(post);
    } else {
      navigate('/blog');
      setSelectedPost(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 bg-grid-pattern transition-colors duration-300">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenCommand={() => setIsCommandOpen(true)}
        onOpenArsenal={() => {
          if (currentView !== 'hub') navigate('/');
          setTimeout(() => {
            const el = document.getElementById('modulos');
            el?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onGoHome={() => navigate('/')}
        readingPost={selectedPost}
        postLang={postLang}
        onTogglePostLang={setPostLang}
        onBackToBlog={() => handleSelectPost(null)}
      />

      <main className="flex-1">
        {currentView === 'blog' ? (
          <BlogView
            onBackToHub={() => navigate('/')}
            selectedPost={selectedPost}
            onSelectPost={handleSelectPost}
            postLang={postLang}
          />
        ) : (
          <HubView onSelectModule={handleSelectModule} />
        )}
      </main>

      <Footer
        onOpenArsenal={() => {
          if (currentView !== 'hub') navigate('/');
          setTimeout(() => {
            const el = document.getElementById('modulos');
            el?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />

      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onSelectModule={handleSelectModule}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <ModuleModal
        module={selectedModule}
        onClose={() => setSelectedModule(null)}
      />
    </div>
  );
}
