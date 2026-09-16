import React, { useState, useEffect, useMemo } from 'react';
import { blogApi } from './services/blogApi';
import { BlogHeader } from './components/BlogHeader';
import { FeaturedPost } from './components/FeaturedPost';
import { PostListItem } from './components/PostListItem';
import { BlogSidebar } from './components/BlogSidebar';
import { PostDetail } from './components/PostDetail';
import { ThoughtCard } from './components/ThoughtCard';

export function BlogView({ onBackToHub }) {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [activeTag, setActiveTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    blogApi.getPosts().then(setPosts);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [selectedPost, activeTab]);

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

  const thoughts = useMemo(() => posts.filter((p) => p.type === 'thought'), [posts]);
  const longFormPosts = useMemo(() => posts.filter((p) => p.type !== 'thought'), [posts]);

  // Tag extraction
  const allTags = useMemo(() => {
    const counts = {};
    longFormPosts.forEach((p) => {
      p.tags?.forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [longFormPosts]);

  // Filtering
  const filteredLongPosts = useMemo(() => {
    return longFormPosts.filter((post) => {
      const matchesTab = activeTab === 'all' || post.type === activeTab;
      const matchesTag = !activeTag || (post.tags && post.tags.includes(activeTag));
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        (post.title && post.title.toLowerCase().includes(q)) ||
        (post.title_pt && post.title_pt.toLowerCase().includes(q)) ||
        (post.subtitle && post.subtitle.toLowerCase().includes(q)) ||
        (post.tags && post.tags.some((t) => t.toLowerCase().includes(q)));

      return matchesTab && matchesTag && matchesSearch;
    });
  }, [longFormPosts, activeTab, activeTag, searchQuery]);

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

  const featured = activeTab === 'all' && !activeTag && !searchQuery ? filteredLongPosts[0] : null;
  const feedPosts = featured ? filteredLongPosts.slice(1) : filteredLongPosts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <BlogHeader
        onBackToHub={onBackToHub}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setActiveTag(null);
        }}
        postCount={longFormPosts.length}
        thoughtCount={thoughts.length}
      />

      {/* Featured Lead Story */}
      {featured && (
        <FeaturedPost
          post={featured}
          isLiked={blogApi.isPostLiked(featured.id)}
          onToggleLike={handleToggleLike}
          onSelect={setSelectedPost}
        />
      )}

      {/* Two Column Editorial Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content Area */}
        <main className="lg:col-span-8">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 mb-2">
            <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
              {activeTab === 'thought' ? 'Todos os Pensamentos' : 'Publicações Recentes'}
            </h2>
            {activeTag && (
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                Filtro: #{activeTag}
              </span>
            )}
          </div>

          {activeTab === 'thought' ? (
            <div className="space-y-4 pt-4">
              {thoughts.map((thought) => (
                <ThoughtCard
                  key={thought.id}
                  thought={thought}
                  isLiked={blogApi.isPostLiked(thought.id)}
                  onToggleLike={handleToggleLike}
                  onSelect={setSelectedPost}
                />
              ))}
            </div>
          ) : (
            <div>
              {feedPosts.length === 0 ? (
                <div className="py-16 text-center text-sm font-mono text-zinc-500">
                  Nenhuma publicação encontrada para o filtro atual.
                </div>
              ) : (
                feedPosts.map((post) => (
                  <PostListItem
                    key={post.id}
                    post={post}
                    isLiked={blogApi.isPostLiked(post.id)}
                    onToggleLike={handleToggleLike}
                    onSelect={setSelectedPost}
                  />
                ))
              )}
            </div>
          )}
        </main>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <BlogSidebar
            thoughts={thoughts.slice(0, 4)}
            tags={allTags}
            activeTag={activeTag}
            onSelectTag={setActiveTag}
            onToggleLike={handleToggleLike}
            onSelectThought={setSelectedPost}
          />
        </div>
      </div>
    </div>
  );
}
