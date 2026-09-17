import { clearSessionCookie, requireAdmin } from '../../_lib/auth';
import { json } from '../../_lib/response';

export async function onRequestPost(context) {
  const auth = await requireAdmin(context.request, context.env, { csrf: true });
  if (auth.response) return auth.response;
  if (context.env.DB) await context.env.DB.prepare('INSERT OR REPLACE INTO revoked_sessions (session_id, expires_at) VALUES (?, ?)').bind(auth.session.id, auth.session.exp).run();
  return json({ ok: true }, 200, { 'Set-Cookie': clearSessionCookie() });
}
