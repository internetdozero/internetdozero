import React, { useState } from 'react';
import { MessageSquare, Send, User } from 'lucide-react';
import { translations } from '../../../i18n/translations';
import { emitFeedback } from '../../../components/FeedbackModal';

export function PostComments({ comments = [], onAddComment, lang = 'pt' }) {
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = translations[lang] || translations.pt;
  const isEn = lang === 'en';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    try { await onAddComment({ author: author.trim() || (isEn ? 'Guest' : 'Visitante'), text }); setText(''); setAuthor(''); emitFeedback('success', isEn ? 'Comment sent.' : 'Comentário enviado.'); } catch (error) { emitFeedback('error', error.message.includes('Links') ? (isEn ? 'Links are not allowed in comments.' : 'Links não são permitidos nos comentários.') : (isEn ? 'Could not send the comment.' : 'Não foi possível enviar o comentário.')); }
    setIsSubmitting(false);
  };

  return (
    <section className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-emerald-500" />
        <h3 className="text-xl font-bold font-mono text-zinc-900 dark:text-white">
          {t.blog.commentsCount} ({comments.length})
        </h3>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
        <div className="mb-3">
          <label className="block text-xs font-mono text-zinc-500 mb-1">{t.blog.namePlaceholder}</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder={isEn ? "E.g. Guest or @handle" : "Ex: Visitante ou @seuuser"}
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-sm font-sans focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="mb-3">
          <label className="block text-xs font-mono text-zinc-500 mb-1">{t.blog.leaveComment} *</label>
          <textarea
            required
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.blog.commentPlaceholder}
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-sm font-sans focus:outline-none focus:border-emerald-500 transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !text.trim()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs transition-all disabled:opacity-50 cursor-pointer shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSubmitting ? (isEn ? 'Sending...' : 'Enviando...') : t.blog.sendComment}</span>
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center py-6 text-sm text-zinc-500 font-mono">
            {t.blog.noComments}
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 rounded-xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {comment.author}
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  {new Date(comment.createdAt).toLocaleDateString(isEn ? 'en-US' : 'pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed whitespace-pre-line">
                {comment.text}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
