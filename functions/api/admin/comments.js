import { requireAdmin } from '../../_lib/auth';
import { json } from '../../_lib/response';

export async function onRequestDelete(context) {
  const auth = await requireAdmin(context.request, context.env, { csrf: true });
  if (auth.response) return auth.response;
  const url = new URL(context.request.url);
  const postId = url.searchParams.get('postId');
  const commentId = url.searchParams.get('commentId');
  if (!postId || !commentId) return json({ error: 'IDs obrigatórios' }, 400);
  const post = await context.env.DB.prepare('SELECT comments FROM posts WHERE id=?').bind(postId).first();
  if (!post) return json({ error: 'Publicação não encontrada' }, 404);
  const comments = JSON.parse(post.comments || '[]').filter((comment) => comment.id !== commentId);
  await context.env.DB.prepare('UPDATE posts SET comments=? WHERE id=?').bind(JSON.stringify(comments), postId).run();
  return json({ ok: true });
}
