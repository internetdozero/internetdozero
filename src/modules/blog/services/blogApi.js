import { initialPosts } from '../data/initialPosts';

const STORAGE_KEY = 'idz_blog_posts_v1';
const LIKES_KEY = 'idz_blog_liked_ids';
const CATEGORIES_KEY = 'idz_blog_categories_v1';
const DEFAULT_CATEGORIES = ['Tecnologia', 'Fitness', 'Inteligência Artificial', 'Crônicas'];
const CHANGE_KEY = 'idz_blog_changed_v1';
const changeChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('idz-blog-sync') : null;

async function api(path, options = {}) {
  const response = await fetch(path, { cache: 'no-store', credentials: 'same-origin', ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } });
  if (!response.ok) { let data = {}; try { data = await response.json(); } catch (_) {} throw new Error(data.error || `API ${response.status}`); }
  return response.json();
}

function hasAdminSession() {
  return typeof sessionStorage !== 'undefined' && Boolean(sessionStorage.getItem('idz_admin_csrf'));
}

export function notifyBlogChange() {
  if (typeof window === 'undefined') return;
  changeChannel?.postMessage({ changedAt: Date.now() });
  localStorage.setItem(CHANGE_KEY, String(Date.now()));
  window.dispatchEvent(new Event(CHANGE_KEY));
}

export function subscribeToBlogChanges(handler) {
  if (typeof window === 'undefined') return () => {};
  const onStorage = (event) => { if (event.key === CHANGE_KEY) handler(); };
  const onLocal = () => handler();
  const onChannel = () => handler();
  window.addEventListener('storage', onStorage);
  window.addEventListener(CHANGE_KEY, onLocal);
  changeChannel?.addEventListener('message', onChannel);
  return () => { window.removeEventListener('storage', onStorage); window.removeEventListener(CHANGE_KEY, onLocal); changeChannel?.removeEventListener('message', onChannel); };
}

function slugify(text) {
  return text
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-')
    .slice(0, 80);
}

export const blogApi = {
  getPosts: async () => {
    try {
      const remote = await api('/api/posts');
      if (Array.isArray(remote) && remote.length > 0) return remote.map((post) => ({ ...post, createdAt: post.created_at || post.createdAt, readingTime: post.reading_time || post.readingTime }));
    } catch (_) {}
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const initialMap = new Map(initialPosts.map((p) => [p.id, p]));
          return parsed.map((post) => {
            const base = initialMap.get(post.id) || {};
            const titlePt = post.title_pt || post.title || post.content || '';
            const titleEn = post.title_en || post.content_en || '';
            const fallbackSlug = base.slug || slugify(titlePt) || post.id;
            const fallbackSlugEn = base.slug_en || (titleEn ? slugify(titleEn) : undefined) || fallbackSlug;
            return {
              ...base,
              ...post,
              slug: post.slug || fallbackSlug,
              slug_en: post.slug_en || fallbackSlugEn
              , category: post.category || base.category || post.tags_pt?.[0] || post.tags?.[0] || 'Geral'
            };
          });
        }
      }
    } catch (_) {}
    return initialPosts.map((post) => ({ ...post, category: post.category || post.tags_pt?.[0] || post.tags?.[0] || 'Geral' }));
  },

  savePosts: (posts) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch (_) {}
  },

  getCategories: () => {
    // The local fallback keeps the editor usable before its D1 binding exists.
    return api('/api/categories').catch(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(CATEGORIES_KEY) || 'null');
      if (Array.isArray(stored) && stored.length) return stored;
    } catch (_) {}
    return DEFAULT_CATEGORIES;
    });
  },

  saveCategories: (categories) => {
    try { localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories)); } catch (_) {}
  },

  addPost: async (postData) => {
    try { await api('/api/admin/posts', { method: 'POST', headers: { 'X-CSRF-Token': sessionStorage.getItem('idz_admin_csrf') || '' }, body: JSON.stringify({ ...postData, reading_time: postData.readingTime, tags_pt: postData.tags_pt, sections_pt: postData.sections_pt }) }); notifyBlogChange(); return (await api('/api/posts')).find((post) => post.slug === postData.slug); } catch (error) { if (hasAdminSession()) throw error; }
    const posts = await blogApi.getPosts();
    const title = postData.title_pt || postData.title || '';
    const newPost = {
      id: `post-${Date.now()}`,
      slug: postData.slug || slugify(title) || `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
      ...postData
    };
    const updated = [newPost, ...posts];
    blogApi.savePosts(updated);
    return newPost;
  },

  updatePost: async (postId, postData) => {
    try { await api(`/api/admin/posts?id=${encodeURIComponent(postId)}`, { method: 'PATCH', headers: { 'X-CSRF-Token': sessionStorage.getItem('idz_admin_csrf') || '' }, body: JSON.stringify({ ...postData, reading_time: postData.readingTime, tags_pt: postData.tags_pt, sections_pt: postData.sections_pt }) }); notifyBlogChange(); return postData; } catch (error) { if (hasAdminSession()) throw error; }
    const posts = await blogApi.getPosts();
    const updatedPosts = posts.map((post) => post.id === postId ? { ...post, ...postData } : post);
    blogApi.savePosts(updatedPosts);
    return updatedPosts.find((post) => post.id === postId);
  },

  deletePost: async (postId) => {
    try { await api(`/api/admin/posts?id=${encodeURIComponent(postId)}`, { method: 'DELETE', headers: { 'X-CSRF-Token': sessionStorage.getItem('idz_admin_csrf') || '' } }); notifyBlogChange(); return blogApi.getPosts(); } catch (error) { if (hasAdminSession()) throw error; }
    const posts = await blogApi.getPosts();
    const updatedPosts = posts.filter((post) => post.id !== postId);
    blogApi.savePosts(updatedPosts);
    return updatedPosts;
  },

  toggleLike: async (postId) => {
    const posts = await blogApi.getPosts();
    let likedIds = [];
    try {
      likedIds = JSON.parse(localStorage.getItem(LIKES_KEY) || '[]');
    } catch (_) {}

    const hasLiked = likedIds.includes(postId);
    const newLikedIds = hasLiked
      ? likedIds.filter((id) => id !== postId)
      : [...likedIds, postId];

    try {
      localStorage.setItem(LIKES_KEY, JSON.stringify(newLikedIds));
    } catch (_) {}

    const updatedPosts = posts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          likes: Math.max(0, (p.likes || 0) + (hasLiked ? -1 : 1))
        };
      }
      return p;
    });

    blogApi.savePosts(updatedPosts);
    return { hasLiked: !hasLiked, posts: updatedPosts };
  },

  isPostLiked: (postId) => {
    try {
      const likedIds = JSON.parse(localStorage.getItem(LIKES_KEY) || '[]');
      return likedIds.includes(postId);
    } catch (_) {
      return false;
    }
  },

  addComment: async (postId, { author, text }) => {
    if (/(https?:\/\/|www\.|\[[^\]]+\]\([^\)]+\)|\b[a-z0-9-]+\.(com|com\.br|net|org|io|dev|co)\b)/i.test(text)) throw new Error('Links não são permitidos nos comentários.');
    try {
      const result = await api(`/api/comments?postId=${encodeURIComponent(postId)}`, { method: 'POST', body: JSON.stringify({ author, text }) });
      notifyBlogChange();
      return { newComment: result.comment, posts: await blogApi.getPosts() };
    } catch (error) {
      if (error.message !== 'API 404' && error.message !== 'API 503') throw error;
    }
    const posts = await blogApi.getPosts();
    const strip = (s) => s.replace(/<[^>]*>/g, '');
    const newComment = {
      id: `c-${Date.now()}`,
      author: strip(author.trim()) || 'Visitante Anônimo',
      text: strip(text.trim()),
      createdAt: new Date().toISOString()
    };

    const updatedPosts = posts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...(p.comments || []), newComment]
        };
      }
      return p;
    });

    blogApi.savePosts(updatedPosts);
    return { newComment, posts: updatedPosts };
  }
};
