export async function publishArticle(db, article, env) {
  const id = crypto.randomUUID();
  const slug = slugify(article.title_pt);
  const words = article.sections_pt.reduce((acc, sec) => acc + (sec.content?.split(/\s+/).length || 0), 0);
  const readingTime = `${Math.ceil(words / 200)} min`;
  const published = Number(env.AUTO_PUBLISH || '0');
  const type = 'article';
  const author = env.AUTHOR || 'Eduardo S.';
  const createdAt = new Date().toISOString();

  const query = `
    INSERT INTO posts 
    (id, slug, type, title_pt, subtitle_pt, category, author, reading_time, tags_pt, sections_pt, likes, created_at, published)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
  `;

  await db.prepare(query).bind(
    id,
    slug,
    type,
    article.title_pt,
    article.subtitle_pt || '',
    article.category,
    author,
    readingTime,
    JSON.stringify(article.tags_pt || []),
    JSON.stringify(article.sections_pt || []),
    createdAt,
    published
  ).run();

  return { id, slug, published };
}

function slugify(text) {
  return text.toString().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80)
    .replace(/-$/, '');
}
