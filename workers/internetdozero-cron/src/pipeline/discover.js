export async function discoverTopics(env) {
  console.log('Discovering topics using Gemini...');
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

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        tools: [{ google_search: {} }],
        generationConfig: { response_mime_type: 'application/json' }
      }),
      signal: AbortSignal.timeout(45000)
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} - ${await response.text()}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Invalid Gemini response structure');

    const result = JSON.parse(text);
    return result.topics;
  } catch (err) {
    console.error('Error with Gemini discover, falling back to Google Trends RSS:', err);
    return await fallbackToGoogleTrends();
  }
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
