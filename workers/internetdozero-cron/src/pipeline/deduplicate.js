export async function deduplicateTopics(db, topics) {
  console.log('Deduplicating topics against last 30 days of posts...');
  try {
    const { results } = await db.prepare(
      "SELECT slug, title_pt, tags_pt FROM posts WHERE created_at > datetime('now', '-30 days')"
    ).all();

    const existingPosts = results || [];

    for (const topic of topics) {
      const topicWords = extractKeywords(topic.title);
      let isDuplicate = false;

      for (const post of existingPosts) {
        const postTitleWords = extractKeywords(post.title_pt);
        let postTags = [];
        try {
          postTags = JSON.parse(post.tags_pt || '[]');
        } catch(_) {}
        
        const postKeywords = new Set([...postTitleWords, ...postTags.map(t => t.toLowerCase())]);
        
        let overlapCount = 0;
        for (const word of topicWords) {
          if (postKeywords.has(word)) {
            overlapCount++;
          }
        }

        if (overlapCount >= 2) {
          isDuplicate = true;
          console.log(`Topic "${topic.title}" is duplicate of post "${post.title_pt}"`);
          break;
        }
      }

      if (!isDuplicate) {
        return topic;
      }
    }

    return null;
  } catch (err) {
    console.error('Error deduplicating topics:', err);
    // If we fail to read DB, return the first topic as fallback
    return topics[0] || null;
  }
}

function extractKeywords(text) {
  if (!text) return new Set();
  const words = text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, '')
    .split(/\s+/)
    .filter(w => w.length > 3);
  return new Set(words);
}
