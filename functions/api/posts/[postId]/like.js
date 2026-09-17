import { json, requestOriginAllowed, serverError } from '../../../_lib/response';
import { rateLimit } from '../../../_lib/rateLimit';

export async function onRequestPost(context) {
  try {
    if (!requestOriginAllowed(context.request)) return json({ error: 'Origem inválida' }, 403);
    const retryAfter = rateLimit(context.request, { limit: 20, windowMs: 10 * 60 * 1000 });
    if (retryAfter) return json({ error: 'Muitas curtidas. Tente novamente mais tarde.' }, 429, { 'Retry-After': String(retryAfter) });
    const postId = context.params.postId;
    const result = await context.env.DB.prepare('UPDATE posts SET likes = likes + 1 WHERE id = ? AND published = 1').bind(postId).run();
    if (!result.meta?.changes) return json({ error: 'Publicação não encontrada' }, 404);
    const post = await context.env.DB.prepare('SELECT likes FROM posts WHERE id = ?').bind(postId).first();
    return json({ likes: Number(post?.likes || 0) }, 200);
  } catch (error) { return serverError(error); }
}

export async function onRequestDelete(context) {
  try {
    if (!requestOriginAllowed(context.request)) return json({ error: 'Origem inválida' }, 403);
    const retryAfter = rateLimit(context.request, { limit: 20, windowMs: 10 * 60 * 1000 });
    if (retryAfter) return json({ error: 'Muitas ações. Tente novamente mais tarde.' }, 429, { 'Retry-After': String(retryAfter) });
    const postId = context.params.postId;
    const result = await context.env.DB.prepare('UPDATE posts SET likes = MAX(likes - 1, 0) WHERE id = ? AND published = 1 AND likes > 0').bind(postId).run();
    if (!result.meta?.changes) return json({ error: 'Publicação não encontrada' }, 404);
    const post = await context.env.DB.prepare('SELECT likes FROM posts WHERE id = ?').bind(postId).first();
    return json({ likes: Number(post?.likes || 0) }, 200);
  } catch (error) { return serverError(error); }
}
