const SITE = 'https://internetdozero.com.br';

const covers = {
  'launch-own-corner': '/images/articles/website.webp',
  'launch-account-security': '/images/articles/security.webp',
  'launch-backup-routine': '/images/articles/backup.webp',
  'como-publicar-um-site-proprio-sem-complicar': '/images/articles/website.webp',
  'um-checklist-pratico-para-proteger-suas-contas': '/images/articles/security.webp',
  'backup-sem-drama-uma-rotina-que-cabe-na-vida-real': '/images/articles/backup.webp'
};

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

function applyMetadata(html, { title, description, url, image, structuredData }) {
  let output = html;
  output = output.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  output = output.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${escapeHtml(description)}" />`);
  output = output.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i, `<link rel="canonical" href="${url}" />`);
  output = output.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  output = output.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  output = output.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i, `<meta property="og:url" content="${url}" />`);
  output = output.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:title" content="${escapeHtml(title)}" />`);
  output = output.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:description" content="${escapeHtml(description)}" />`);
  output = output.replace(/<meta\s+name="twitter:url"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:url" content="${url}" />`);
  if (image) {
    output = output.replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/?>/i, `<meta property="og:image" content="${image}" />`);
    output = output.replace(/<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:image" content="${image}" />`);
  }
  if (structuredData) {
    output = output.replace('</head>', `<script type="application/ld+json">${structuredData}</script></head>`);
  }
  return output;
}

export async function onRequestGet(context) {
  const { slug } = context.params;
  const row = await context.env.DB?.prepare(`SELECT * FROM posts WHERE published = 1 AND slug = ? LIMIT 1`).bind(slug).first();
  if (!row) return context.next();

  const post = parse(row);
  const url = `${SITE}/blog/${context.params.category}/${encodeURIComponent(post.slug)}`;
  const description = plainText(post.subtitle_pt || post.title_pt).slice(0, 160);
  const title = `${post.title_pt} — Internet do Zero`;
  const coverPath = post.image_url || covers[post.id] || covers[post.slug] || '/og-image.png';
  const imageUrl = coverPath.startsWith('http') ? coverPath : `${SITE}${coverPath}`;

  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title_pt,
    description,
    image: imageUrl,
    datePublished: post.created_at,
    dateModified: post.created_at,
    author: { '@type': 'Person', name: post.author || 'Eduardo S.' },
    publisher: { '@type': 'Organization', name: 'Internet do Zero', logo: { '@type': 'ImageObject', url: `${SITE}/og-image.png` } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url }
  }).replace(/</g, '\\u003c');

  const shell = await context.next();
  const html = await shell.text();
  const body = applyMetadata(html, { title, description, url, image: imageUrl, structuredData }).replace('<div id="root"></div>', `<div id="root">${articleMarkup(post)}</div>`);

  return new Response(body, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600' } });
}
