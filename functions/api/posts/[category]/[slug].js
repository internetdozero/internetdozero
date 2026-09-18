import { json, serverError } from '../../../_lib/response';

function parse(row) {
  return { ...row, likes: Number(row.likes || 0), comments: [], commentsCount: Number(row.comments_count || 0), tags_pt: JSON.parse(row.tags_pt || '[]'), sections_pt: JSON.parse(row.sections_pt || '[]'), createdAt: row.created_at, readingTime: row.reading_time };
}

export async function onRequestGet(context) {
 try {
  if (!context.env.DB) return json({ error: 'D1 não configurado' }, 503);
  const { slug } = context.params;
  const row = await context.env.DB.prepare(`SELECT p.*, COUNT(c.id) AS comments_count
    FROM posts p LEFT JOIN comments c ON c.post_id = p.id AND c.status = 'approved'
    WHERE p.published = 1 AND (p.slug = ? OR p.id = ?) GROUP BY p.id`).bind(slug, slug).first();
  if (!row) return json({ error: 'Publicação não encontrada' }, 404);
  return json(parse(row), 200, { 'Cache-Control': 'public, max-age=0, s-maxage=30, stale-while-revalidate=120' });
 } catch (error) { return serverError(error); }
}
