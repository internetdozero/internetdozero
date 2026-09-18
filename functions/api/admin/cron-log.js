import { requireAdmin } from '../../_lib/auth';
import { json } from '../../_lib/response';

export async function onRequestGet(context) {
  const auth = await requireAdmin(context.request, context.env);
  if (auth.response) return auth.response;

  try {
    const { results } = await context.env.DB.prepare(
      'SELECT * FROM cron_log ORDER BY ran_at DESC LIMIT 20'
    ).all();

    return json({ items: results || [] });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
