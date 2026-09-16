import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Sparkles, Terminal, BookOpen } from 'lucide-react';
import { blogApi } from './services/blogApi';
import { ThoughtCard } from './components/ThoughtCard';
import { PostCard } from './components/PostCard';
import { PostDetail } from './components/PostDetail';

export function BlogView({ onBackToHub }) {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    blogApi.getPosts().then(setPosts);
  }, []);

  const handleToggleLike = async (postId) => {
    const { posts: updatedPosts } = await blogApi.toggleLike(postId);
    setPosts(updatedPosts);
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(updatedPosts.find((p) => p.id === postId));
    }
  };

  const handleAddComment = async (postId, commentData) => {
    const { posts: updatedPosts } = await blogApi.addComment(postId, commentData);
    setPosts(updatedPosts);
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(updatedPosts.find((p) => p.id === postId));
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesTab = activeTab === 'all' || post.type === activeTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      (post.content && post.content.toLowerCase().includes(q)) ||
      (post.title && post.title.toLowerCase().includes(q)) ||
      (post.title_pt && post.title_pt.toLowerCase().includes(q)) ||
      (post.tags && post.tags.some((t) => t.toLowerCase().includes(q)));
    return matchesTab && matchesSearch;
  });

  if (selectedPost) {
    return (
      <PostDetail
        post={selectedPost}
        onBack={() => setSelectedPost(null)}
        isLiked={blogApi.isPostLiked(selectedPost.id)}
        onToggleLike={handleToggleLike}
        onAddComment={handleAddComment}
      />
    );
  }

  const tabs = [
    { id: 'all', label: 'Tudo' },
    { id: 'thought', label: '💭 Pensamentos' },
    { id: 'story', label: '📖 Histórias' },
    { id: 'article', label: '📰 Artigos' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <button
            onClick={onBackToHub}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Hub Central</span>
          </button>
          <h1 className="text-3xl font-extrabold font-mono text-zinc-900 dark:text-white">
            O Blog do Zero
          </h1>
          <p className="text-sm text-zinc-500 font-sans mt-1">
            Pensamentos rápidos, crônicas autorais e artigos sem censura de temas.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar publicações..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 my-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black font-bold shadow-sm'
                : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-emerald-500/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feed List */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 font-mono">
              Nenhuma publicação encontrada para o filtro selecionado.
            </p>
          </div>
        ) : (
          filteredPosts.map((post) =>
            post.type === 'thought' ? (
              <ThoughtCard
                key={post.id}
                thought={post}
                isLiked={blogApi.isPostLiked(post.id)}
                onToggleLike={handleToggleLike}
                onSelect={setSelectedPost}
              />
            ) : (
              <PostCard
                key={post.id}
                post={post}
                isLiked={blogApi.isPostLiked(post.id)}
                onToggleLike={handleToggleLike}
                onSelect={setSelectedPost}
              />
            )
          )
        )}
      </div>
    </div>
  );
}
