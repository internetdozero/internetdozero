import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { blogApi } from './services/blogApi';
import { useLikedPosts } from './hooks/useLikedPosts';
import { BlogHeader } from './components/BlogHeader';
import { FeaturedPost } from './components/FeaturedPost';
import { BlogSidebar } from './components/BlogSidebar';
import { PostDetail } from './components/PostDetail';
import { BlogFeed } from './components/BlogFeed';

function slugifyCategory(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function BlogView({ postSlug, postCategory, onNavigate, lang = 'pt', onToggleLang }) {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [activeTag, setActiveTag] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const { isLiked, syncAfterToggle } = useLikedPosts();
  const isEn = lang === 'en';

  useEffect(() => {
    blogApi.getPosts().then(setPosts);
    blogApi.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [postSlug, postCategory, activeTab]);

  // Derive selectedPost from slug + posts (matches PT slug, EN slug, or id fallback)
  const selectedPost = useMemo(() => {
    if (!postSlug || !posts.length) return null;
    return posts.find(
        (p) =>
          (p.slug === postSlug ||
            p.slug_en === postSlug ||
            p.id === postSlug ||
            (p.slug && p.slug.toLowerCase() === postSlug.toLowerCase()) ||
            (p.slug_en && p.slug_en.toLowerCase() === postSlug.toLowerCase())) &&
          (!postCategory || slugifyCategory(p.category || p.tags_pt?.[0] || p.tags?.[0] || 'Geral') === postCategory)
      ) || null;
  }, [postSlug, postCategory, posts]);

  const handleSelectPost = useCallback(
    (post) => {
      if (post) {
        const slug =
          (isEn && post.slug_en ? post.slug_en : post.slug) ||
          post.slug ||
          post.slug_en ||
          post.id;
        const category = slugifyCategory(post.category || post.tags_pt?.[0] || post.tags?.[0] || 'Geral');
        onNavigate(`/blog/${category}/${encodeURIComponent(slug)}`);
      } else {
        onNavigate('/blog');
      }
    },
    [isEn, onNavigate]
  );

  const handleBackToHub = useCallback(() => {
    onNavigate('/');
  }, [onNavigate]);

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

  const allCategories = useMemo(() => categories.map((name) => ({
    name,
    count: longFormPosts.filter((post) => (post.category || post.tags_pt?.[0] || post.tags?.[0] || 'Geral') === name).length
  })).filter((category) => category.count > 0), [categories, longFormPosts]);

  const filteredLongPosts = useMemo(() => {
    return longFormPosts.filter((post) => {
      const matchesTab = activeTab === 'all' || post.type === activeTab;
      const category = post.category || post.tags_pt?.[0] || post.tags?.[0] || 'Geral';
      const matchesCategory = !activeCategory || category === activeCategory;
      const tags = isEn && post.tags_en ? post.tags_en : (post.tags_pt || post.tags || []);
      const matchesTag = !activeTag || tags.includes(activeTag);
      const q = searchQuery.toLowerCase();
      const title = (isEn && post.title_en ? post.title_en : (post.title_pt || post.title || '')).toLowerCase();
      const subtitle = (isEn && post.subtitle_en ? post.subtitle_en : (post.subtitle_pt || post.subtitle || '')).toLowerCase();
      const matchesSearch = !q || title.includes(q) || subtitle.includes(q) || tags.some((t) => t.toLowerCase().includes(q));

      return matchesTab && matchesCategory && matchesTag && matchesSearch;
    });
  }, [longFormPosts, activeTab, activeCategory, activeTag, searchQuery, isEn]);

  if (selectedPost) {
    return (
      <PostDetail
        post={selectedPost}
        postLang={lang}
        isLiked={isLiked(selectedPost.id)}
        onToggleLike={handleToggleLike}
        onAddComment={handleAddComment}
        onBack={() => handleSelectPost(null)}
      />
    );
  }

  const featured = activeTab === 'all' && !activeCategory && !activeTag && !searchQuery ? filteredLongPosts[0] : null;
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
        categories={allCategories}
        activeCategory={activeCategory}
        onSelectCategory={(category) => { setActiveCategory(category); setActiveTag(null); setActiveTab('all'); }}
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
