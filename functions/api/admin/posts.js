import { requireAdmin } from '../../_lib/auth';
import { json, readJson } from '../../_lib/response';

const fields = ['title_pt', 'subtitle_pt', 'category', 'author', 'reading_time', 'slug', 'tags_pt', 'sections_pt', 'type'];
function calculateReadingTime(sections = []) {
  const words = sections.map((section) => `${section.title || ''} ${section.content || ''}`).join(' ').trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min`;
}
function clean(body) {
  const post = Object.fromEntries(fields.map((field) => [field, body?.[field]]));
  if (!post.title_pt || !post.category || !post.sections_pt?.length) return null;
  if (post.title_pt.length > 180 || post.subtitle_pt?.length > 300 || post.author?.length > 80) return null;
  post.tags_pt = Array.isArray(post.tags_pt) ? post.tags_pt.slice(0, 20).map((tag) => String(tag).slice(0, 40)) : [];
  post.sections_pt = Array.isArray(post.sections_pt) ? post.sections_pt.slice(0, 30) : [];
  post.reading_time = calculateReadingTime(post.sections_pt);
  return post;
}

function parse(row) { return { ...row, tags_pt: JSON.parse(row.tags_pt || '[]'), sections_pt: JSON.parse(row.sections_pt || '[]'), comments: [], commentsCount: Number(row.comments_count || 0), likes: Number(row.likes || 0), createdAt: row.created_at, readingTime: row.reading_time }; }

export async function onRequestGet(context) {
  const auth = await requireAdmin(context.request, context.env);
  if (auth.response) return auth.response;
  const url = new URL(context.request.url);
  const limit = Math.min(20, Math.max(1, Number(url.searchParams.get('limit') || 10)));
  const cursor = url.searchParams.get('cursor');
  const params = [];
  const where = [];
  if (cursor) { where.push('p.created_at < ?'); params.push(cursor); }
  const { results } = await context.env.DB.prepare(`SELECT p.*, COUNT(c.id) AS comments_count FROM posts p LEFT JOIN comments c ON c.post_id = p.id AND c.status = 'approved' ${where.length ? `WHERE ${where.join(' AND ')}` : ''} GROUP BY p.id ORDER BY p.created_at DESC LIMIT ?`).bind(...params, limit + 1).all();
  return json({ items: results.slice(0, limit).map(parse), nextCursor: results.length > limit ? results[limit - 1].created_at : null });
}

export async function onRequestPost(context) {
  const auth = await requireAdmin(context.request, context.env, { csrf: true });
  if (auth.response) return auth.response;
  const post = clean(await readJson(context.request));
  if (!post) return json({ error: 'Dados de publicação inválidos' }, 400);
  const id = crypto.randomUUID();
  await context.env.DB.prepare('INSERT INTO posts (id, slug, type, title_pt, subtitle_pt, category, author, reading_time, tags_pt, sections_pt, created_at, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)').bind(id, post.slug || id, post.type || 'article', post.title_pt, post.subtitle_pt || '', post.category, post.author || 'Eduardo S.', post.reading_time || '5 min', JSON.stringify(post.tags_pt), JSON.stringify(post.sections_pt), new Date().toISOString()).run();
  return json({ id }, 201);
}

export async function onRequestPatch(context) {
  const auth = await requireAdmin(context.request, context.env, { csrf: true });
  if (auth.response) return auth.response;
  const id = new URL(context.request.url).searchParams.get('id');
  const post = clean(await readJson(context.request));
  if (!id || !post) return json({ error: 'Dados de publicação inválidos' }, 400);
  await context.env.DB.prepare('UPDATE posts SET slug=?, type=?, title_pt=?, subtitle_pt=?, category=?, author=?, reading_time=?, tags_pt=?, sections_pt=? WHERE id=?').bind(post.slug || id, post.type || 'article', post.title_pt, post.subtitle_pt || '', post.category, post.author || 'Eduardo S.', post.reading_time || '5 min', JSON.stringify(post.tags_pt), JSON.stringify(post.sections_pt), id).run();
  return json({ ok: true });
}

export async function onRequestDelete(context) {
  const auth = await requireAdmin(context.request, context.env, { csrf: true });
  if (auth.response) return auth.response;
  const id = new URL(context.request.url).searchParams.get('id');
  if (!id) return json({ error: 'ID obrigatório' }, 400);
  await context.env.DB.prepare('DELETE FROM posts WHERE id=?').bind(id).run();
  return json({ ok: true });
}
