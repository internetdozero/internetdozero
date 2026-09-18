export async function deduplicateTopics(db, topics, { manual = false } = {}) {
  if (manual && topics && topics.length > 0) {
    return topics[0];
  }
  console.log('Deduplicating topics and enforcing daily editorial diversity...');
  try {
    const { results } = await db.prepare(
      "SELECT slug, title_pt, tags_pt, category, created_at FROM posts WHERE published = 1 AND created_at > datetime('now', '-30 days')"
    ).all();

    const existingPosts = results || [];
    const recentPillars = new Set(
      existingPosts
        .filter((post) => new Date(post.created_at || 0).getTime() > Date.now() - 24 * 60 * 60 * 1000)
        .map((post) => normalizePillar(post.category))
    );
    const seenPillars = new Set();

    for (const topic of topics) {
      const pillar = normalizePillar(topic.pillar || topic.category);
      if ((!manual && recentPillars.has(pillar)) || seenPillars.has(pillar)) {
        console.log(`Skipping topic "${topic.title}" to preserve daily pillar diversity`);
        continue;
      }
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
        seenPillars.add(pillar);
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

function normalizePillar(value) {
  const normalized = String(value || 'geral').toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/\s+e\s+/g, '-')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (normalized === 'tecnologia' || normalized === 'tecnologia-internet') return 'tecnologia-internet';
  if (normalized === 'seguranca' || normalized === 'seguranca-privacidade') return 'seguranca-privacidade';
  if (normalized === 'organizacao' || normalized === 'organizacao-produtividade') return 'organizacao-produtividade';
  return normalized;
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
