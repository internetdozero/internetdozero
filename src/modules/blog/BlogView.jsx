import React, { useState, useEffect, useMemo } from 'react';
import { blogApi } from './services/blogApi';
import { BlogHeader } from './components/BlogHeader';
import { FeaturedPost } from './components/FeaturedPost';
import { BlogSidebar } from './components/BlogSidebar';
import { PostDetail } from './components/PostDetail';
import { BlogFeed } from './components/BlogFeed';

export function BlogView({ onBackToHub, selectedPost, onSelectPost, postLang = 'pt', lang = 'pt', onToggleLang }) {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [activeTag, setActiveTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const currentLang = lang || postLang;
  const isEn = currentLang === 'en';

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
      onSelectPost(updatedPosts.find((p) => p.id === postId));
    }
  };

  const handleAddComment = async (postId, commentData) => {
    const { posts: updatedPosts } = await blogApi.addComment(postId, commentData);
    setPosts(updatedPosts);
    if (selectedPost && selectedPost.id === postId) {
      onSelectPost(updatedPosts.find((p) => p.id === postId));
    }
  };

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
        postLang={currentLang}
        onToggleLang={onToggleLang}
        isLiked={blogApi.isPostLiked(selectedPost.id)}
        onToggleLike={handleToggleLike}
        onAddComment={handleAddComment}
        onBack={() => onSelectPost(null)}
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
        lang={currentLang}
      />

      {featured && (
        <FeaturedPost
          post={featured}
          isLiked={blogApi.isPostLiked(featured.id)}
          onToggleLike={handleToggleLike}
          onSelect={onSelectPost}
          lang={currentLang}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <BlogFeed
          activeTab={activeTab}
          thoughts={thoughts}
          feedPosts={feedPosts}
          activeTag={activeTag}
          isLikedFn={(id) => blogApi.isPostLiked(id)}
          onToggleLike={handleToggleLike}
          onSelectPost={onSelectPost}
          lang={currentLang}
        />

        <div className="lg:col-span-4">
          <BlogSidebar
            posts={longFormPosts}
            thoughts={thoughts.slice(0, 4)}
            tags={allTags}
            activeTag={activeTag}
            onSelectTag={setActiveTag}
            onToggleLike={handleToggleLike}
            onSelectThought={onSelectPost}
            onSelectPost={onSelectPost}
            selectedPostId={selectedPost?.id}
            postLang={currentLang}
            lang={currentLang}
          />
        </div>
      </div>
    </div>
  );
}
