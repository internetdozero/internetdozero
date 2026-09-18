const covers = {
  'launch-own-corner': '/images/articles/website.webp',
  'launch-account-security': '/images/articles/security.webp',
  'launch-backup-routine': '/images/articles/backup.webp'
};

export function getArticleCover(post) {
  return post.image_url || covers[post.id] || covers[post.slug] || null;
}

export function getArticleImageCredit(post) {
  if (!post.image_source || !post.image_license) return null;
  return { source: post.image_source, author: post.image_author, license: post.image_license, url: post.image_credit_url };
}
