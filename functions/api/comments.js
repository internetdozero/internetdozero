import { json, readJson, requestOriginAllowed } from '../_lib/response';

const linkPattern = /(https?:\/\/|www\.|\[[^\]]+\]\([^\)]+\)|\b[a-z0-9-]+\.(com|com\.br|net|org|io|dev|co)\b)/i;

export async function onRequestPost(context) {
  if (!requestOriginAllowed(context.request)) return json({ error: 'Origem inválida' }, 403);
  const postId = new URL(context.request.url).searchParams.get('postId');
  const body = await readJson(context.request);
  const author = String(body?.author || 'Visitante').trim().slice(0, 80);
  const text = String(body?.text || '').trim().slice(0, 2000);
  if (!postId || !text) return json({ error: 'Comentário vazio' }, 400);
  if (linkPattern.test(text)) return json({ error: 'Links não são permitidos nos comentários.' }, 422);
  const post = await context.env.DB.prepare('SELECT id FROM posts WHERE id=? AND published=1').bind(postId).first();
  if (!post) return json({ error: 'Publicação não encontrada' }, 404);
  const comment = { id: crypto.randomUUID(), author, text, createdAt: new Date().toISOString() };
  await context.env.DB.prepare("INSERT INTO comments (id, post_id, author, content, status, created_at) VALUES (?, ?, ?, ?, 'pending', ?)").bind(comment.id, postId, author, text, comment.createdAt).run();
  return json({ comment, pending: true }, 201);
}
