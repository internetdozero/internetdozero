const SITE = 'https://internetdozero.com.br';

function escapeXml(value) {
  return String(value).replace(/[<>&'\"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '\"': '&quot;' }[character]));
}

export async function onRequestGet(context) {
  const urls = [
    { loc: `${SITE}/`, priority: '1.0' },
    { loc: `${SITE}/blog`, priority: '0.8' }
  ];
  if (context.env.DB) {
    const { results } = await context.env.DB.prepare('SELECT category, slug, created_at FROM posts WHERE published = 1 ORDER BY created_at DESC').all();
    results.forEach((post) => urls.push({ loc: `${SITE}/blog/${encodeURIComponent(post.category)}/${encodeURIComponent(post.slug)}`, lastmod: post.created_at, priority: '0.7' }));
  }
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${escapeXml(url.loc)}</loc>${url.lastmod ? `<lastmod>${escapeXml(url.lastmod)}</lastmod>` : ''}<changefreq>weekly</changefreq><priority>${url.priority}</priority></url>`).join('')}</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=300, s-maxage=3600' } });
}
