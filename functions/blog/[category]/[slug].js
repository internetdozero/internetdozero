const SITE = 'https://internetdozero.com.br';

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

function plainText(value) {
  return String(value || '').replace(/[#*_`>[\]!-]/g, '').replace(/\s+/g, ' ').trim();
}

function parse(row) {
  return {
    ...row,
    sections: JSON.parse(row.sections_pt || '[]'),
    tags: JSON.parse(row.tags_pt || '[]')
  };
}

function articleMarkup(post) {
  const sections = post.sections.length ? post.sections : [{ title: 'Introdução', content: post.subtitle_pt || '' }];
  return `<article><p>${escapeHtml(post.category)}</p><h1>${escapeHtml(post.title_pt)}</h1><p>${escapeHtml(post.subtitle_pt)}</p>${sections.map((section) => `<section><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(plainText(section.content))}</p></section>`).join('')}</article>`;
}

export async function onRequestGet(context) {
  const { slug } = context.params;
  const row = await context.env.DB?.prepare(`SELECT * FROM posts WHERE published = 1 AND slug = ? LIMIT 1`).bind(slug).first();
  if (!row) return context.next();

  const post = parse(row);
  const url = `${SITE}/blog/${context.params.category}/${encodeURIComponent(post.slug)}`;
  const description = plainText(post.subtitle_pt || post.title_pt).slice(0, 160);
  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title_pt,
    description,
    datePublished: post.created_at,
    dateModified: post.created_at,
    author: { '@type': 'Person', name: post.author || 'Eduardo S.' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url }
  }).replace(/</g, '\\u003c');
  const metadata = `<title>${escapeHtml(post.title_pt)} — Internet do Zero</title><meta name="description" content="${escapeHtml(description)}"><link rel="canonical" href="${url}"><meta property="og:title" content="${escapeHtml(post.title_pt)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${url}"><script type="application/ld+json">${structuredData}</script>`;
  const shell = await context.next();
  const html = await shell.text();
  const body = html.replace('</head>', `${metadata}</head>`).replace('<div id="root"></div>', `<div id="root">${articleMarkup(post)}</div>`);
  return new Response(body, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600' } });
}
