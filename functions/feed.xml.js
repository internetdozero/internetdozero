const SITE = 'https://internetdozero.com.br';

function escapeXml(value) {
  return String(value || '').replace(/[<>&'"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[character]));
}

function slugify(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export async function onRequestGet(context) {
  let posts = [];
  if (context.env?.DB) {
    try {
      const { results } = await context.env.DB.prepare('SELECT id, title_pt, subtitle_pt, category, slug, created_at FROM posts WHERE published = 1 ORDER BY created_at DESC LIMIT 20').all();
      posts = results || [];
    } catch (_) {}
  }

  const itemsXml = posts.map((post) => {
    const cat = slugify(post.category) || 'geral';
    const link = `${SITE}/blog/${cat}/${encodeURIComponent(post.slug)}`;
    const pubDate = post.created_at ? new Date(post.created_at).toUTCString() : new Date().toUTCString();
    return `    <item>
      <title>${escapeXml(post.title_pt)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(post.subtitle_pt || post.title_pt)}</description>
      <category>${escapeXml(post.category || 'Tecnologia')}</category>
      <pubDate>${pubDate}</pubDate>
    </item>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Internet do Zero</title>
    <link>${SITE}</link>
    <description>Ferramentas locais sem cadastro e blog sobre tecnologia independente.</description>
    <language>pt-BR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600, s-maxage=3600'
    }
  });
}
