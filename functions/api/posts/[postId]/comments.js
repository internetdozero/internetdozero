import { json } from '../../../_lib/response';

export async function onRequestGet(context) {
  if (!context.env.DB) return json({ error: 'D1 não configurado' }, 503);
  const url = new URL(context.request.url);
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit') || 20)));
  const cursor = url.searchParams.get('cursor');
  const params = [context.params.postId];
  const where = ["post_id = ?", "status = 'approved'"];
  if (cursor) { where.push('created_at < ?'); params.push(cursor); }
  const { results } = await context.env.DB.prepare(`SELECT id, author, content AS text, created_at AS createdAt FROM comments WHERE ${where.join(' AND ')} ORDER BY created_at DESC LIMIT ?`).bind(...params, limit + 1).all();
  return json({ items: results.slice(0, limit), nextCursor: results.length > limit ? results[limit - 1].createdAt : null });
}
