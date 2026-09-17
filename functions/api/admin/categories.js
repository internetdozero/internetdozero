import { requireAdmin } from '../../_lib/auth';
import { json, readJson } from '../../_lib/response';

export async function onRequestPost(context) {
  const auth = await requireAdmin(context.request, context.env, { csrf: true });
  if (auth.response) return auth.response;
  const name = String((await readJson(context.request))?.name || '').trim().slice(0, 60);
  if (!name) return json({ error: 'Nome obrigatório' }, 400);
  await context.env.DB.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)').bind(name).run();
  return json({ name }, 201);
}
