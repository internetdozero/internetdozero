import { json, serverError } from '../_lib/response';

function parsePost(row) {
  return { ...row, likes: Number(row.likes || 0), comments: [], commentsCount: Number(row.comments_count || 0), tags_pt: JSON.parse(row.tags_pt || '[]'), createdAt: row.created_at, readingTime: row.reading_time };
}

export async function onRequestGet(context) {
 try {
  if (!context.env.DB) return json({ error: 'D1 não configurado' }, 503);
  const url = new URL(context.request.url);
  const limit = Math.min(30, Math.max(1, Number(url.searchParams.get('limit') || 12)));
  const cursor = url.searchParams.get('cursor');
  const category = url.searchParams.get('category');
  const where = ['p.published = 1'];
  const values = [];
  if (category) { where.push('p.category = ?'); values.push(category); }
  if (cursor) { where.push('p.created_at < ?'); values.push(cursor); }
  const { results } = await context.env.DB.prepare(`SELECT p.id, p.slug, p.type, p.title_pt, p.subtitle_pt, p.category, p.author, p.reading_time, p.tags_pt, p.likes, p.created_at, p.image_url, p.image_alt, p.image_source, p.image_author, p.image_license, p.image_credit_url, COUNT(c.id) AS comments_count
    FROM posts p LEFT JOIN comments c ON c.post_id = p.id AND c.status = 'approved'
    WHERE ${where.join(' AND ')} GROUP BY p.id ORDER BY p.created_at DESC LIMIT ?`).bind(...values, limit + 1).all();
  const items = results.slice(0, limit).map(parsePost);
  const nextCursor = results.length > limit ? results[limit - 1].created_at : null;
  return json({ items, nextCursor }, 200, { 'Cache-Control': 'public, max-age=0, s-maxage=30, stale-while-revalidate=120' });
 } catch (error) { return serverError(error); }
}
