import { initialPosts } from '../data/initialPosts';

const STORAGE_KEY = 'idz_blog_posts_v1';
const LIKES_KEY = 'idz_blog_liked_ids';

export const blogApi = {
  getPosts: async () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (_) {}
    return initialPosts;
  },

  savePosts: (posts) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch (_) {}
  },

  addPost: async (postData) => {
    const posts = await blogApi.getPosts();
    const newPost = {
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
      ...postData
    };
    const updated = [newPost, ...posts];
    blogApi.savePosts(updated);
    return newPost;
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
