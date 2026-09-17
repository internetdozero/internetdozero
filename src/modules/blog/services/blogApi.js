const STORAGE_KEY = 'idz_blog_posts_v1';
const LIKES_KEY = 'idz_blog_liked_ids';
const CATEGORIES_KEY = 'idz_blog_categories_v1';
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

function normalizeStoredPost(post) {
  const titlePt = post.title_pt || post.title || post.content || '';
  const titleEn = post.title_en || post.content_en || '';
  return {
    ...post,
    slug: post.slug || slugify(titlePt) || post.id,
    slug_en: post.slug_en || (titleEn ? slugify(titleEn) : slugify(titlePt) || post.id),
    category: post.category || post.tags_pt?.[0] || post.tags?.[0] || 'Geral'
  };
}

function readCache(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null');
    return Array.isArray(value) ? value : [];
  } catch (_) {
    return [];
  }
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
      if (remote?.items) {
        blogApi.savePosts(remote.items);
        return remote.items;
      }
    } catch (error) {
      if (!import.meta.env.DEV) throw error;
    }
    return readCache(STORAGE_KEY).map(normalizeStoredPost);
  },

  getCachedPosts: () => readCache(STORAGE_KEY).map(normalizeStoredPost),

  savePosts: (posts) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch (_) {}
  },

  getCategories: () => api('/api/categories').then((categories) => {
    blogApi.saveCategories(categories);
    return categories;
  }).catch(() => {
    if (!import.meta.env.DEV) throw new Error('Não foi possível carregar as categorias.');
    try {
      const stored = JSON.parse(localStorage.getItem(CATEGORIES_KEY) || 'null');
      if (Array.isArray(stored) && stored.length) return stored;
    } catch (_) {}
    return [];
  }),

  getCachedCategories: () => readCache(CATEGORIES_KEY),

  getPost: async (category, slug) => api(`/api/posts/${encodeURIComponent(category)}/${encodeURIComponent(slug)}`),
  getComments: async (postId, cursor) => api(`/api/posts/${encodeURIComponent(postId)}/comments${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`),
  getAdminPosts: async ({ cursor, query, type } = {}) => { const params = new URLSearchParams(); if (cursor) params.set('cursor', cursor); if (query) params.set('q', query); if (type) params.set('type', type); return api(`/api/admin/posts?${params}`); },
  getAdminComments: async ({ cursor, query, status } = {}) => { const params = new URLSearchParams(); if (cursor) params.set('cursor', cursor); if (query) params.set('q', query); if (status) params.set('status', status); return api(`/api/admin/comments?${params}`); },
  moderateComment: async (id, status) => api(`/api/admin/comments?id=${encodeURIComponent(id)}`, { method: 'PATCH', headers: { 'X-CSRF-Token': sessionStorage.getItem('idz_admin_csrf') || '' }, body: JSON.stringify({ status }) }),

  saveCategories: (categories) => {
    try { localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories)); } catch (_) {}
  },

  addPost: async (postData) => {
    try { await api('/api/admin/posts', { method: 'POST', headers: { 'X-CSRF-Token': sessionStorage.getItem('idz_admin_csrf') || '' }, body: JSON.stringify({ ...postData, reading_time: postData.readingTime, tags_pt: postData.tags_pt, sections_pt: postData.sections_pt }) }); notifyBlogChange(); const page = await api('/api/posts'); return page.items?.find((post) => post.slug === postData.slug); } catch (error) { if (hasAdminSession()) throw error; }
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
    if (!hasLiked) {
      try {
        const result = await api(`/api/posts/${encodeURIComponent(postId)}/like`, { method: 'POST' });
        const updatedPosts = posts.map((post) => post.id === postId ? { ...post, likes: result.likes } : post);
        blogApi.savePosts(updatedPosts);
        localStorage.setItem(LIKES_KEY, JSON.stringify([...likedIds, postId]));
        return { hasLiked: true, posts: updatedPosts };
      } catch (error) {
        if (!import.meta.env.DEV) throw error;
      }
    }
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
    if (/(https?:\/\/|www\.|\[[^\]]+\]\([^()]+\)|\b[a-z0-9-]+\.[a-z]{2,}(?:\/|\b))/i.test(text)) throw new Error('Links não são permitidos nos comentários.');
    try {
      const result = await api(`/api/comments?postId=${encodeURIComponent(postId)}`, { method: 'POST', body: JSON.stringify({ author, text }) });
      notifyBlogChange();
      return { newComment: result.comment, pending: result.pending };
    } catch (error) {
      if (error.message !== 'API 404' && error.message !== 'API 503') throw error;
    }
    if (!import.meta.env.DEV) throw new Error('Comentários indisponíveis no momento.');
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
