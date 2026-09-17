import { clearSessionCookie, requireAdmin } from '../../_lib/auth';
import { json } from '../../_lib/response';

export async function onRequestPost(context) {
  const auth = await requireAdmin(context.request, context.env, { csrf: true });
  if (auth.response) return auth.response;
  return json({ ok: true }, 200, { 'Set-Cookie': clearSessionCookie() });
}
