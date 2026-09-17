const buckets = new Map();

export function rateLimit(request, { limit, windowMs }) {
  const key = `${request.headers.get('CF-Connecting-IP') || 'unknown'}:${new URL(request.url).pathname}`;
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.expiresAt <= now) {
    buckets.set(key, { count: 1, expiresAt: now + windowMs });
    return null;
  }
  current.count += 1;
  if (current.count > limit) return Math.ceil((current.expiresAt - now) / 1000);
  return null;
}
