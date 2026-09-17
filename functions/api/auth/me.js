import { getSession } from '../../_lib/auth';
import { json } from '../../_lib/response';

export async function onRequestGet(context) {
  const session = await getSession(context.request, context.env);
  return session ? json({ authenticated: true, csrf: session.csrf }) : json({ authenticated: false }, 401);
}
