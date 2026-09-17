import { createSession, sessionCookie } from '../../_lib/auth';
import { json, readJson, requestOriginAllowed } from '../../_lib/response';

export async function onRequestPost(context) {
  if (!requestOriginAllowed(context.request)) return json({ error: 'Origem inválida' }, 403);
  const body = await readJson(context.request);
  if (!context.env.ADMIN_PASSWORD || !body?.password || body.password !== context.env.ADMIN_PASSWORD) return json({ error: 'Senha inválida' }, 401);
  const session = await createSession(context.env);
  return json({ csrf: session.csrf }, 200, { 'Set-Cookie': sessionCookie(session.token) });
}
