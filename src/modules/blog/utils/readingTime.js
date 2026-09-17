const WORDS_PER_MINUTE = 200;

export function calculateReadingTime(text = '') {
  const words = String(text).trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))} min`;
}

export function getPostReadingTime(post) {
  const sections = post.sections_pt || post.sections || [];
  const content = sections.map((section) => `${section.title || ''} ${section.content || ''}`).join(' ');
  return content ? calculateReadingTime(content) : (post.readingTime || '1 min');
}
