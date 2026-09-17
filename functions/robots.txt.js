export async function onRequestGet() {
  return new Response('User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: https://internetdozero.com.br/sitemap.xml\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
  });
}
