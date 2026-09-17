import { initialPosts } from '../data/initialPosts';

const STORAGE_KEY = 'idz_blog_posts_v1';
const LIKES_KEY = 'idz_blog_liked_ids';
const CATEGORIES_KEY = 'idz_blog_categories_v1';
const DEFAULT_CATEGORIES = ['Tecnologia', 'Fitness', 'Inteligência Artificial', 'Crônicas'];

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
    try {
      const stored = JSON.parse(localStorage.getItem(CATEGORIES_KEY) || 'null');
      if (Array.isArray(stored) && stored.length) return stored;
    } catch (_) {}
    return DEFAULT_CATEGORIES;
  },

  saveCategories: (categories) => {
    try { localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories)); } catch (_) {}
  },

  addPost: async (postData) => {
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
    const posts = await blogApi.getPosts();
    const updatedPosts = posts.map((post) => post.id === postId ? { ...post, ...postData } : post);
    blogApi.savePosts(updatedPosts);
    return updatedPosts.find((post) => post.id === postId);
  },

  deletePost: async (postId) => {
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
