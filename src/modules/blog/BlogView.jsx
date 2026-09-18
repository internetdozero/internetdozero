import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { blogApi, subscribeToBlogChanges } from './services/blogApi';
import { useLikedPosts } from './hooks/useLikedPosts';
import { BlogHeader } from './components/BlogHeader';
import { FeaturedPost } from './components/FeaturedPost';
import { BlogSidebar } from './components/BlogSidebar';
import { PostDetail } from './components/PostDetail';
import { BlogFeed } from './components/BlogFeed';
import { BlogCategoriesView } from './components/BlogCategoriesView';
import { useSeo } from '../../hooks/useSeo';
import { getArticleCover } from './data/articleCovers';

function slugifyCategory(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function BlogView({ postSlug, postCategory, showCategories = false, initialCategory = null, onNavigate, lang = 'pt' }) {
  const [posts, setPosts] = useState(() => blogApi.getCachedPosts());
  const [activeTab, setActiveTab] = useState('all');
  const [activeTag, setActiveTag] = useState(null);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState(() => blogApi.getCachedCategories());
  const [isLoading, setIsLoading] = useState(() => blogApi.getCachedPosts().length === 0);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(() => Boolean(postSlug));
  const [detailComments, setDetailComments] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const { isLiked, syncAfterToggle } = useLikedPosts();
  const isEn = lang === 'en';
  const detailTitle = detail ? (isEn && detail.title_en ? detail.title_en : (detail.title_pt || detail.title || '')) : 'Internet do Zero — Hub & Laboratório Digital';
  useSeo({
    title: detail ? `${detailTitle} — Internet do Zero` : 'Blog — Internet do Zero',
    description: detail?.subtitle_pt || 'Textos sobre internet, tecnologia, cultura digital e ideias livres.',
    url: typeof window === 'undefined' ? '' : window.location.href,
    image: detail ? getArticleCover(detail) : undefined
  });

  useEffect(() => {
    setLoadError('');
    setIsLoading(posts.length === 0);
    Promise.all([blogApi.getPosts(), blogApi.getCategories()])
      .then(([nextPosts, nextCategories]) => { setPosts(nextPosts || []); setCategories(nextCategories || []); })
      .catch(() => setLoadError('Não foi possível carregar o blog. Tente novamente.'))
      .finally(() => setIsLoading(false));
    return subscribeToBlogChanges(() => { blogApi.getPosts().then((result) => setPosts(result || [])).catch(() => {}); blogApi.getCategories().then(setCategories).catch(() => {}); });
  }, [reloadKey]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [postSlug, postCategory, activeTab]);

  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    if (!postSlug) { setDetail(null); setDetailLoading(false); return; }
    let cancelled = false;
    setDetail(null);
    setDetailLoading(true);
    const loadDetail = async () => {
      const summary = posts.find((post) => post.slug === postSlug || post.slug_en === postSlug || post.id === postSlug);
      const category = postCategory || (summary && slugifyCategory(summary.category || summary.tags_pt?.[0] || summary.tags?.[0] || 'Geral'));
      if (!category) { setDetailLoading(false); return; }
      const post = await blogApi.getPost(category, postSlug);
      if (cancelled) return;
      setDetail(post);
      const result = await blogApi.getComments(post.id);
      if (!cancelled) { setDetailComments(result?.items || []); setDetailLoading(false); }
    };
    loadDetail().catch(() => { if (!cancelled) { setDetail(null); setDetailLoading(false); } });
    return () => { cancelled = true; };
  }, [postSlug, postCategory, posts]);

  // Resolve the route from the lightweight summary before fetching full content.
  const selectedSummary = useMemo(() => {
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

  const handleAddComment = useCallback((id, commentData) => blogApi.addComment(id, commentData), []);

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

  if (detail) {
    return (
      <PostDetail
        post={{ ...detail, comments: detailComments }}
        postLang={lang}
        isLiked={isLiked(detail.id)}
        onToggleLike={handleToggleLike}
        onAddComment={async (id, data) => { await handleAddComment(id, data); const result = await blogApi.getComments(id); setDetailComments(result?.items || []); }}
        onBack={() => handleSelectPost(null)}
        relatedPosts={posts.filter((post) => post.id !== detail.id && post.type !== 'thought').slice(0, 3)}
        onSelectPost={handleSelectPost}
      />
    );
  }

  if (showCategories) {
    return <BlogCategoriesView categories={categories} posts={longFormPosts} onBack={() => onNavigate('/blog')} onSelectCategory={(category) => onNavigate(`/blog?category=${encodeURIComponent(category)}`)} lang={lang} />;
  }

  if (postSlug && detailLoading) return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" aria-busy="true" aria-label="Carregando artigo"><div className="mx-auto max-w-3xl space-y-6"><div className="h-4 w-28 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" /><div className="h-14 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" /><div className="h-5 w-2/3 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" /><div className="aspect-[16/9] animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900" /></div></main>;

  if (loadError) return <main className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center gap-4 px-6 text-center"><p className="text-sm text-zinc-500">{loadError}</p><button type="button" onClick={() => setReloadKey((key) => key + 1)} className="rounded-sm bg-stone-900 px-4 py-2 text-sm font-medium text-stone-50 hover:bg-stone-700">Tentar novamente</button></main>;

  if (isLoading && posts.length === 0) return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" aria-busy="true" aria-label="Carregando textos"><div className="mb-10 space-y-4"><div className="h-3 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" /><div className="h-10 w-72 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" /><div className="h-5 w-full max-w-xl animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" /></div><div className="h-64 animate-pulse rounded-3xl bg-zinc-100 dark:bg-zinc-900" /><p className="mt-5 text-center text-xs font-mono text-zinc-500">Carregando textos…</p></main>;

  const featured = activeTab === 'all' && !activeCategory && !activeTag && !searchQuery ? filteredLongPosts[0] : null;
  const feedPosts = featured ? filteredLongPosts.slice(1) : filteredLongPosts;

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10">
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
        onViewAllCategories={() => onNavigate('/blog/categorias')}
      />

      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
        <main className="min-w-0">
          {featured && (
            <FeaturedPost
              post={featured}
              isLiked={isLiked(featured.id)}
              onToggleLike={handleToggleLike}
              onSelect={handleSelectPost}
              lang={lang}
            />
          )}
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
        </main>

        <div>
          <BlogSidebar
            posts={longFormPosts}
            thoughts={thoughts.slice(0, 4)}
            tags={allTags}
            activeTag={activeTag}
            onSelectTag={setActiveTag}
            onToggleLike={handleToggleLike}
            onSelectThought={handleSelectPost}
            onSelectPost={handleSelectPost}
            selectedPostId={selectedSummary?.id}
            postLang={lang}
            lang={lang}
          />
        </div>
      </div>
    </div>
  );
}
