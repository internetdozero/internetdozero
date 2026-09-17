const covers = {
  'launch-own-corner': '/images/articles/website.jpeg',
  'launch-account-security': '/images/articles/security.jpeg',
  'launch-backup-routine': '/images/articles/backup.jpeg'
};

export function getArticleCover(post) {
  return covers[post.id] || covers[post.slug] || null;
}
