import { requireAdmin } from '../../_lib/auth';
import { json, readJson } from '../../_lib/response';

export async function onRequestPost(context) {
  const auth = await requireAdmin(context.request, context.env, { csrf: true });
  if (auth.response) return auth.response;
  const posts = await readJson(context.request);
  if (!Array.isArray(posts) || posts.length > 100) return json({ error: 'Importação inválida' }, 400);
  if (posts.length === 0) return json({ imported: 0 });
  const statements = posts.map((post) => context.env.DB.prepare('INSERT OR IGNORE INTO posts (id, slug, type, title_pt, subtitle_pt, category, author, reading_time, tags_pt, sections_pt, comments, likes, created_at, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)').bind(post.id, post.slug || post.id, post.type || 'article', String(post.title_pt || post.title || post.content || '').slice(0, 180), String(post.subtitle_pt || post.subtitle || ''), String(post.category || post.tags_pt?.[0] || post.tags?.[0] || 'Geral').slice(0, 60), String(post.author || 'Eduardo S.').slice(0, 80), String(post.readingTime || '5 min'), JSON.stringify(post.tags_pt || post.tags || []), JSON.stringify(post.sections_pt || []), JSON.stringify(post.comments || []), Number(post.likes || 0), post.createdAt || new Date().toISOString()));
  await context.env.DB.batch(statements);
  return json({ imported: posts.length });
}
