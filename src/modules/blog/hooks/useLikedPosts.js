import { useState, useCallback } from 'react';

const LIKES_KEY = 'idz_blog_liked_ids';

/**
 * Gerencia os IDs de posts curtidos em memória,
 * evitando JSON.parse síncrono a cada render.
 */
export function useLikedPosts() {
  const [likedIds, setLikedIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(LIKES_KEY) || '[]'));
    } catch {
      return new Set();
    }
  });

  const isLiked = useCallback((postId) => likedIds.has(postId), [likedIds]);

  const syncAfterToggle = useCallback((postId) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  }, []);

  return { isLiked, syncAfterToggle };
}
