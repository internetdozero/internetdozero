const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

export function json(data, status = 200, headers = {}) {
  return Response.json(data, { status, headers: { ...securityHeaders, 'Cache-Control': 'no-store', ...headers } });
}

export function requestOriginAllowed(request) {
  const origin = request.headers.get('Origin');
  if (!origin) return true;
  return origin === new URL(request.url).origin;
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
