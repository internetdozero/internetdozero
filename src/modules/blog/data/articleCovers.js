const covers = {
  'launch-own-corner': '/images/articles/website.webp',
  'launch-account-security': '/images/articles/security.webp',
  'launch-backup-routine': '/images/articles/backup.webp'
};

export function getArticleCover(post) {
  return covers[post.id] || covers[post.slug] || null;
}
