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
    
    // Minimal regex parsing for XML RSS titles
    const itemRegex = /<item>[\s\S]*?<title><!\[CDATA\[(.*?)\]\]><\/title>[\s\S]*?<\/item>/g;
    const topics = [];
    let match;
    let count = 0;
    while ((match = itemRegex.exec(xml)) !== null && count < 3) {
      topics.push({
        title: match[1],
        summary: `Tópico em alta no Brasil: ${match[1]}`,
        category: 'Cultura Digital',
        suggestedTags: [match[1].toLowerCase().replace(/\s+/g, '-')]
      });
      count++;
    }
    return topics;
  } catch (err) {
    console.error('Fallback failed:', err);
    return [];
  }
}
