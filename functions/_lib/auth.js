import { requestOriginAllowed } from './response';

const COOKIE = '__Host-idz_session';
const encoder = new TextEncoder();

function toBase64Url(bytes) {
  let binary = ''; bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value) {
  const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function key(secret) {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function sign(value, secret) {
  return toBase64Url(new Uint8Array(await crypto.subtle.sign('HMAC', await key(secret), encoder.encode(value))));
}

function constantTimeEqual(left, right) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return result === 0;
}

function cookieValue(request) {
  return (request.headers.get('Cookie') || '').split(';').map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
}

export async function createSession(env) {
  if (!env.ADMIN_SESSION_SECRET || new TextEncoder().encode(env.ADMIN_SESSION_SECRET).length < 32) throw new Error('ADMIN_SESSION_SECRET ausente ou fraco');
  const payload = JSON.stringify({ id: toBase64Url(crypto.getRandomValues(new Uint8Array(18))), exp: Date.now() + 8 * 60 * 60 * 1000, csrf: toBase64Url(crypto.getRandomValues(new Uint8Array(24))) });
  const body = toBase64Url(encoder.encode(payload));
  const token = `${body}.${await sign(body, env.ADMIN_SESSION_SECRET)}`;
  return { token, csrf: JSON.parse(payload).csrf };
}

export async function getSession(request, env) {
  const token = cookieValue(request);
  if (!token || !env.ADMIN_SESSION_SECRET) return null;
  const [body, signature] = token.split('.');
  if (!body || !signature || !constantTimeEqual(signature, await sign(body, env.ADMIN_SESSION_SECRET))) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body)));
    if (payload.exp <= Date.now() || !payload.id) return null;
    if (env.DB) {
      const revoked = await env.DB.prepare('SELECT session_id FROM revoked_sessions WHERE session_id = ? AND expires_at > ?').bind(payload.id, Date.now()).first();
      if (revoked) return null;
    }
    return payload;
  } catch (_) { return null; }
}

export function sessionCookie(token, maxAge = 8 * 60 * 60) {
  return `${COOKIE}=${token}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=Lax`;
}

export function clearSessionCookie() { return `${COOKIE}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax`; }

export async function requireAdmin(request, env, { csrf = false } = {}) {
  if (!requestOriginAllowed(request)) return { response: jsonError('Origem inválida', 403) };
  const session = await getSession(request, env);
  if (!session) return { response: jsonError('Não autenticado', 401) };
  if (csrf && !constantTimeEqual(request.headers.get('X-CSRF-Token') || '', session.csrf)) return { response: jsonError('CSRF inválido', 403) };
  return { session };
}

function jsonError(message, status) { return Response.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } }); }
