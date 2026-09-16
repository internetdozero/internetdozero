import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { blogApi } from './services/blogApi';
import { useLikedPosts } from './hooks/useLikedPosts';
import { BlogHeader } from './components/BlogHeader';
import { FeaturedPost } from './components/FeaturedPost';
import { BlogSidebar } from './components/BlogSidebar';
import { PostDetail } from './components/PostDetail';
import { BlogFeed } from './components/BlogFeed';

export function BlogView({ postSlug, onNavigate, lang = 'pt', onToggleLang }) {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [activeTag, setActiveTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { isLiked, syncAfterToggle } = useLikedPosts();
  const isEn = lang === 'en';

  useEffect(() => {
    blogApi.getPosts().then(setPosts);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [postSlug, activeTab]);

  // Derive selectedPost from slug + posts (single source of truth)
  const selectedPost = useMemo(() => {
    if (!postSlug || !posts.length) return null;
    return posts.find((p) => p.slug === postSlug) || null;
  }, [postSlug, posts]);

  const handleSelectPost = useCallback((post) => {
    if (post) {
      const base = `/blog/${post.slug}`;
      onNavigate(isEn ? `${base}?lang=en` : base);
    } else {
      onNavigate(isEn ? '/blog?lang=en' : '/blog');
    }
  }, [isEn, onNavigate]);

  const handleBackToHub = useCallback(() => {
    onNavigate(isEn ? '/?lang=en' : '/');
  }, [isEn, onNavigate]);

  const handleToggleLike = useCallback(async (id) => {
    const { posts: updatedPosts } = await blogApi.toggleLike(id);
    setPosts(updatedPosts);
    syncAfterToggle(id);
  }, [syncAfterToggle]);

  const handleAddComment = useCallback(async (id, commentData) => {
    const { posts: updatedPosts } = await blogApi.addComment(id, commentData);
    setPosts(updatedPosts);
  }, []);

  const thoughts = useMemo(() => posts.filter((p) => p.type === 'thought'), [posts]);
  const longFormPosts = useMemo(() => posts.filter((p) => p.type !== 'thought'), [posts]);

  const allTags = useMemo(() => {
    const counts = {};
    longFormPosts.forEach((p) => {
      const tags = isEn && p.tags_en ? p.tags_en : (p.tags_pt || p.tags || []);
      tags.forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [longFormPosts, isEn]);

  const filteredLongPosts = useMemo(() => {
    return longFormPosts.filter((post) => {
      const matchesTab = activeTab === 'all' || post.type === activeTab;
      const tags = isEn && post.tags_en ? post.tags_en : (post.tags_pt || post.tags || []);
      const matchesTag = !activeTag || tags.includes(activeTag);
      const q = searchQuery.toLowerCase();
      const title = (isEn && post.title_en ? post.title_en : (post.title_pt || post.title || '')).toLowerCase();
      const subtitle = (isEn && post.subtitle_en ? post.subtitle_en : (post.subtitle_pt || post.subtitle || '')).toLowerCase();
      const matchesSearch = !q || title.includes(q) || subtitle.includes(q) || tags.some((t) => t.toLowerCase().includes(q));

      return matchesTab && matchesTag && matchesSearch;
    });
  }, [longFormPosts, activeTab, activeTag, searchQuery, isEn]);

  if (selectedPost) {
    return (
      <PostDetail
        post={selectedPost}
        postLang={lang}
        onToggleLang={onToggleLang}
        isLiked={isLiked(selectedPost.id)}
        onToggleLike={handleToggleLike}
        onAddComment={handleAddComment}
        onBack={() => handleSelectPost(null)}
      />
    );
  }

  const featured = activeTab === 'all' && !activeTag && !searchQuery ? filteredLongPosts[0] : null;
  const feedPosts = featured ? filteredLongPosts.slice(1) : filteredLongPosts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <BlogHeader
        onBackToHub={handleBackToHub}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setActiveTag(null);
        }}
        postCount={longFormPosts.length}
        thoughtCount={thoughts.length}
        lang={lang}
      />

      {featured && (
        <FeaturedPost
          post={featured}
          isLiked={isLiked(featured.id)}
          onToggleLike={handleToggleLike}
          onSelect={handleSelectPost}
          lang={lang}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <BlogFeed
          activeTab={activeTab}
          thoughts={thoughts}
          feedPosts={feedPosts}
          activeTag={activeTag}
          isLikedFn={isLiked}
          onToggleLike={handleToggleLike}
          onSelectPost={handleSelectPost}
          lang={lang}
        />

        <div className="lg:col-span-4">
          <BlogSidebar
            posts={longFormPosts}
            thoughts={thoughts.slice(0, 4)}
            tags={allTags}
            activeTag={activeTag}
            onSelectTag={setActiveTag}
            onToggleLike={handleToggleLike}
            onSelectThought={handleSelectPost}
            onSelectPost={handleSelectPost}
            selectedPostId={selectedPost?.id}
            postLang={lang}
            lang={lang}
          />
        </div>
      </div>
    </div>
  );
}
