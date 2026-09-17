import { json } from '../_lib/response';

function parsePost(row) {
  return { ...row, likes: Number(row.likes || 0), comments: JSON.parse(row.comments || '[]'), tags_pt: JSON.parse(row.tags_pt || '[]'), sections_pt: JSON.parse(row.sections_pt || '[]') };
}

export async function onRequestGet(context) {
  if (!context.env.DB) return json({ error: 'D1 não configurado' }, 503);
  const { results } = await context.env.DB.prepare('SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC').all();
  return json(results.map(parsePost), 200, { 'Cache-Control': 'no-store' });
}
