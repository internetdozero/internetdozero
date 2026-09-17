const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

export function json(data, status = 200, headers = {}) {
  return Response.json(data, { status, headers: { ...securityHeaders, 'Cache-Control': 'no-store', ...headers } });
}

export function serverError(error) {
  console.error('API failure:', error);
  return json({ error: 'Serviço temporariamente indisponível.' }, 503);
}

export function requestOriginAllowed(request) {
  const origin = request.headers.get('Origin');
  if (!origin) return true;
  const requestOrigin = new URL(request.url).origin;
  if (origin === requestOrigin) return true;
  const isLocalProxy = new URL(request.url).hostname === 'localhost' && /^http:\/\/(localhost|127\.0\.0\.1):5173$/.test(origin);
  return isLocalProxy;
}

export async function readJson(request) {
  const length = Number(request.headers.get('Content-Length') || 0);
  if (length > 128 * 1024) return null;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).length > 128 * 1024) return null;
    return JSON.parse(text);
  } catch (_) { return null; }
}
