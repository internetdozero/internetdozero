import { requireAdmin } from '../../_lib/auth';
import { json } from '../../_lib/response';

export async function onRequestDelete(context) {
  const auth = await requireAdmin(context.request, context.env, { csrf: true });
  if (auth.response) return auth.response;
  const url = new URL(context.request.url);
  const postId = url.searchParams.get('postId');
  const commentId = url.searchParams.get('commentId');
  if (!postId || !commentId) return json({ error: 'IDs obrigatórios' }, 400);
  const result = await context.env.DB.prepare('DELETE FROM comments WHERE post_id=? AND id=?').bind(postId, commentId).run();
  if (!result.meta.changes) return json({ error: 'Comentário não encontrado' }, 404);
  return json({ ok: true });
}

export async function onRequestGet(context) {
  const auth = await requireAdmin(context.request, context.env);
  if (auth.response) return auth.response;
  const url = new URL(context.request.url);
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit') || 20)));
  const cursor = url.searchParams.get('cursor');
  const query = String(url.searchParams.get('q') || '').trim().slice(0, 80);
  const status = url.searchParams.get('status');
  const params = [];
  const where = [];
  if (cursor) { where.push('c.created_at < ?'); params.push(cursor); }
  if (query) { where.push('(c.author LIKE ? OR c.content LIKE ? OR p.title_pt LIKE ?)'); params.push(...Array(3).fill(`%${query}%`)); }
  if (['pending', 'approved', 'rejected'].includes(status)) { where.push('c.status = ?'); params.push(status); }
  const { results } = await context.env.DB.prepare(`SELECT c.id, c.post_id AS postId, c.author, c.content AS text, c.status, c.created_at AS createdAt, p.title_pt AS postTitle FROM comments c JOIN posts p ON p.id = c.post_id ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY c.created_at DESC LIMIT ?`).bind(...params, limit + 1).all();
  return json({ items: results.slice(0, limit), nextCursor: results.length > limit ? results[limit - 1].createdAt : null });
}

export async function onRequestPatch(context) {
  const auth = await requireAdmin(context.request, context.env, { csrf: true });
  if (auth.response) return auth.response;
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  const status = (await context.request.json().catch(() => null))?.status;
  if (!id || !['pending', 'approved', 'rejected'].includes(status)) return json({ error: 'Dados de moderação inválidos' }, 400);
  await context.env.DB.prepare('UPDATE comments SET status=? WHERE id=?').bind(status, id).run();
  return json({ ok: true });
}
