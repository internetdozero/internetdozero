const MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3.7-flash'
];

function parseJson(text) {
  if (!text) return null;
  const clean = text.replace(/```(?:json)?\s*/gi, '').replace(/```\s*$/gi, '').trim();
  try {
    return JSON.parse(clean);
  } catch (_) {
    return null;
  }
}

export async function discoverTopics(env) {
  console.log('Discovering topics using Gemini with resilient fallback...');
  const prompt = `Você é um analista de tendências digitais.
Liste 3 tópicos quentes e atuais sobre tecnologia, internet, segurança ou cultura digital no Brasil hoje.
Retorne um JSON estruturado exatamente assim:
{
  "topics": [
    {
      "title": "título do tópico",
      "summary": "resumo do que está acontecendo",
      "category": "Tecnologia",
      "suggestedTags": ["tag1", "tag2"]
    }
  ]
}
A categoria DEVE ser uma destas: Tecnologia, Segurança, Organização, Cultura Digital.`;

  for (const model of MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        }),
        signal: AbortSignal.timeout(30000)
      });

      if (!response.ok) continue;

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const result = parseJson(text);
      if (result?.topics?.length) {
        console.log(`Discovered topics using model ${model}`);
        return result.topics;
      }
    } catch (_) {}
  }

  console.log('Gemini discover failed for all models, falling back to Google Trends RSS');
  return await fallbackToGoogleTrends();
}

async function fallbackToGoogleTrends() {
  console.log('Fetching Google Trends RSS...');
  try {
    const response = await fetch('https://trends.google.com.br/trending/rss?geo=BR', {
      signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) throw new Error('Failed to fetch Google Trends');
    const xml = await response.text();
    
    const topics = extractRssTopics(xml);
    if (topics.length) return topics;
    throw new Error('Google Trends returned no usable topics');
  } catch (err) {
    console.error('Google Trends fallback failed:', err);
    return await fallbackToPublicFeeds();
  }
}

function extractRssTopics(xml) {
  const topics = [];
  const itemRegex = /<item\b[^>]*>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null && topics.length < 3) {
    const titleMatch = match[1].match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
    const title = decodeXml(titleMatch?.[1]);
    if (!title) continue;

      topics.push({
        title,
        summary: `Tópico em alta no Brasil: ${title}`,
        category: 'Cultura Digital',
        suggestedTags: [title.toLowerCase().replace(/\s+/g, '-')]
      });
  }

  return topics;
}

function decodeXml(value) {
  if (!value) return '';
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

async function fallbackToPublicFeeds() {
  const feeds = [
    {
      url: 'https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=5',
      parse: data => (data.hits || []).map(item => ({
        title: item.title,
        summary: item.story_text || `Discussão em alta no Hacker News: ${item.title}`,
        category: 'Tecnologia',
        suggestedTags: ['tecnologia', 'internet']
      }))
    },
    {
      url: 'https://dev.to/api/articles?top=1&per_page=5',
      parse: data => (Array.isArray(data) ? data : []).map(item => ({
        title: item.title,
        summary: `Artigo em alta na comunidade de desenvolvimento: ${item.title}`,
        category: 'Tecnologia',
        suggestedTags: item.tag_list || ['programação', 'internet']
      }))
    }
  ];

  for (const feed of feeds) {
    try {
      const response = await fetch(feed.url, { signal: AbortSignal.timeout(15000) });
      if (!response.ok) continue;
      const topics = feed.parse(await response.json())
        .filter(topic => topic.title)
        .slice(0, 3);
      if (topics.length) return topics;
    } catch (err) {
      console.error(`Public feed fallback failed for ${feed.url}:`, err);
    }
  }

  return [];
}
