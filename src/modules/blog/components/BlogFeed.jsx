import React from 'react';
import { PostListItem } from './PostListItem';
import { ThoughtCard } from './ThoughtCard';

export function BlogFeed({
  activeTab,
  thoughts = [],
  feedPosts = [],
  activeTag,
  isLikedFn,
  onToggleLike,
  onSelectPost,
  lang = 'pt'
}) {
  const isEn = lang === 'en';

  return (
    <div className="lg:col-span-8">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 mb-2">
        <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
          {activeTab === 'thought' ? (isEn ? 'All Thoughts' : 'Todos os Pensamentos') : (isEn ? 'Recent Posts' : 'Publicações Recentes')}
        </h2>
        {activeTag && (
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
            {isEn ? 'Filter: #' : 'Filtro: #'}{activeTag}
          </span>
        )}
      </div>

      {activeTab === 'thought' ? (
        <div className="space-y-4 pt-4">
          {thoughts.map((thought) => (
            <ThoughtCard
              key={thought.id}
              thought={thought}
              isLiked={isLikedFn(thought.id)}
              onToggleLike={onToggleLike}
              onSelect={onSelectPost}
              lang={lang}
            />
          ))}
        </div>
      ) : (
        <div>
          {feedPosts.length === 0 ? (
            <div className="py-16 text-center text-sm font-mono text-zinc-500">
              {isEn ? 'No publications found for the current filter.' : 'Nenhuma publicação encontrada para o filtro atual.'}
            </div>
          ) : (
            feedPosts.map((post) => (
              <PostListItem
                key={post.id}
                post={post}
                isLiked={isLikedFn(post.id)}
                onToggleLike={onToggleLike}
                onSelect={onSelectPost}
                lang={lang}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
