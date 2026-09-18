export async function deduplicateTopics(db, topics, { manual = false } = {}) {
  if (!topics || topics.length === 0) return null;
  if (manual) {
    return { ...topics[0], requiresReview: false };
  }

  console.log('Analyzing topic freshness and deduplication...');
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

    let bestCandidate = topics[0];
    let minOverlap = Infinity;
    let bestIsRecentPillar = false;

    for (const topic of topics) {
      const pillar = normalizePillar(topic.pillar || topic.category);
      const isRecentPillar = recentPillars.has(pillar);
      const topicWords = extractKeywords(topic.title);

      let maxOverlapWithAnyPost = 0;
      for (const post of existingPosts) {
        const postTitleWords = extractKeywords(post.title_pt);
        let postTags = [];
        try {
          postTags = JSON.parse(post.tags_pt || '[]');
        } catch (_) {}
        const postKeywords = new Set([...postTitleWords, ...postTags.map((t) => t.toLowerCase())]);

        let overlap = 0;
        for (const word of topicWords) {
          if (postKeywords.has(word)) overlap++;
        }
        if (overlap > maxOverlapWithAnyPost) {
          maxOverlapWithAnyPost = overlap;
        }
      }

      // If clean topic without high overlap and not saturated pillar
      if (maxOverlapWithAnyPost < 2 && !isRecentPillar) {
        return { ...topic, requiresReview: false };
      }

      // Keep track of the least-overlapping candidate
      const score = maxOverlapWithAnyPost + (isRecentPillar ? 1 : 0);
      if (score < minOverlap) {
        minOverlap = score;
        bestCandidate = topic;
        bestIsRecentPillar = isRecentPillar;
      }
    }

    // Never reject: send best candidate for generation marked for review
    console.log(`Topic "${bestCandidate.title}" selected for generation with review flag (overlap: ${minOverlap})`);
    return {
      ...bestCandidate,
      requiresReview: true,
      reviewReason: bestIsRecentPillar ? 'Pilar publicado nas últimas 24h' : 'Possível similaridade com post recente'
    };
  } catch (err) {
    console.error('Error deduplicating topics:', err);
    return { ...topics[0], requiresReview: false };
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
