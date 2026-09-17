const SITE = 'https://internetdozero.com.br';

function escapeXml(value) {
  return String(value).replace(/[<>&'"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[character]));
}

function slugify(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const toolSlugs = [
  'compressor-de-imagem',
  'gerador-de-senhas',
  'masterizador-de-audio',
  'remover-metadados',
  'cortador-de-audio',
  'extrator-de-audio',
  'contador-de-texto',
  'gerador-de-qr-code',
  'comparador-de-texto',
  'formatador-json'
];

export async function onRequestGet(context) {
  const urls = [
    { loc: `${SITE}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${SITE}/tools`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${SITE}/blog`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${SITE}/links`, priority: '0.5', changefreq: 'monthly' },
    ...toolSlugs.map((slug) => ({ loc: `${SITE}/tools/${slug}`, priority: '0.8', changefreq: 'weekly' }))
  ];

  if (context.env?.DB) {
    try {
      const { results } = await context.env.DB.prepare('SELECT category, slug, created_at FROM posts WHERE published = 1 ORDER BY created_at DESC').all();
      results.forEach((post) => {
        const cat = slugify(post.category) || 'geral';
        urls.push({
          loc: `${SITE}/blog/${cat}/${encodeURIComponent(post.slug)}`,
          lastmod: post.created_at,
          changefreq: 'monthly',
          priority: '0.7'
        });
      });
    } catch (_) {}
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((url) => `  <url>\n    <loc>${escapeXml(url.loc)}</loc>${url.lastmod ? `\n    <lastmod>${escapeXml(url.lastmod)}</lastmod>` : ''}\n    <changefreq>${url.changefreq || 'weekly'}</changefreq>\n    <priority>${url.priority}</priority>\n  </url>`)
    .join('\n')}\n</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=3600'
    }
  });
}
