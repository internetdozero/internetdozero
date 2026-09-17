import { createSession, sessionCookie } from '../../_lib/auth';
import { json, readJson, requestOriginAllowed } from '../../_lib/response';
import { verifyPassword } from '../../_lib/password';
import { rateLimit } from '../../_lib/rateLimit';

export async function onRequestPost(context) {
  if (!requestOriginAllowed(context.request)) return json({ error: 'Origem inválida' }, 403);
  const retryAfter = rateLimit(context.request, { limit: 10, windowMs: 15 * 60 * 1000 });
  if (retryAfter) return json({ error: 'Muitas tentativas. Tente novamente mais tarde.' }, 429, { 'Retry-After': String(retryAfter) });
  const body = await readJson(context.request);
  const validHash = await verifyPassword(String(body?.password || ''), context.env.ADMIN_PASSWORD_HASH);
  const localFallback = context.env.ADMIN_PASSWORD && context.env.ALLOW_PLAINTEXT_ADMIN_PASSWORD === 'true' && body?.password === context.env.ADMIN_PASSWORD;
  if (!validHash && !localFallback) return json({ error: 'Senha inválida' }, 401);
  const session = await createSession(context.env);
  return json({ csrf: session.csrf }, 200, { 'Set-Cookie': sessionCookie(session.token) });
}
