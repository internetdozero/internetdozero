const MODELS = ['perplexity/sonar'];

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
  console.log('Discovering broad, current topics using OpenRouter web search...');
  let lastFailure = 'no response';
  const prompt = `Você é o editor de um site brasileiro independente, curioso e útil.
Pesquise no Google e liste 6 pautas quentes, verificáveis e úteis para pessoas comuns no Brasil hoje.
Distribua as pautas entre pilares diferentes, no máximo uma por pilar: tecnologia e internet,
segurança e privacidade, organização e produtividade, dinheiro e consumo, cultura e entretenimento,
casa e vida prática, saúde e bem-estar, ideias e lazer.
Prefira assuntos que ajudem o leitor a entender algo, tomar uma decisão ou viver melhor.
Evite transformar tudo em notícia de tecnologia, repetir o mesmo acontecimento ou escolher manchetes
sem utilidade. Não invente fatos: use a pesquisa para confirmar o contexto atual.
Retorne um JSON estruturado exatamente assim:
{
  "topics": [
    {
      "title": "título do tópico",
      "summary": "resumo do que está acontecendo",
      "category": "Casa e vida prática",
      "pillar": "casa-vida-pratica",
      "suggestedTags": ["tag1", "tag2"]
    }
  ]
}
A categoria DEVE ser uma destas: Tecnologia e internet, Segurança e privacidade,
Organização e produtividade, Dinheiro e consumo, Cultura e entretenimento,
Casa e vida prática, Saúde e bem-estar, Ideias e lazer.
O campo pillar deve identificar o pilar em letras minúsculas e hífens.`;

  for (const model of MODELS) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + env.OPENROUTER_API_KEY, 'HTTP-Referer': env.SITE_URL, 'X-Title': 'Internet do Zero' },
        body: JSON.stringify({
          model: `${model}:online`,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1800,
          plugins: [{ id: 'web', max_results: 6 }]
        }),
        signal: AbortSignal.timeout(30000)
      });

      if (!response.ok) {
        lastFailure = `${model}: ${response.status}`;
        console.error(`OpenRouter topic model ${model} returned ${response.status}: ${await response.text()}`);
        continue;
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      const result = parseJson(text);
      if (result?.topics?.length) {
        console.log(`Discovered topics using model ${model}`);
        return result.topics;
      }
    } catch (error) {
      lastFailure = `${model}: ${error.message}`;
      console.error(`Topic discovery model ${model} failed: ${error.message}`);
    }
  }

  console.log(`OpenRouter discover failed for all models (${lastFailure}), falling back to Google Trends RSS`);
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
        category: categorizeFallbackTopic(title),
        pillar: normalizePillar(categorizeFallbackTopic(title)),
        suggestedTags: [title.toLowerCase().replace(/\s+/g, '-')]
      });
  }

  return topics;
}

function categorizeFallbackTopic(title) {
  const value = title.toLowerCase();
  if (/preço|inflação|salário|imposto|pix|banco|conta|compras|mercado/.test(value)) return 'Dinheiro e consumo';
  if (/saúde|doença|vacina|hospital|médico|alimentação|exercício/.test(value)) return 'Saúde e bem-estar';
  if (/filme|série|música|jogo|show|bbb|fazenda|ator|cantor/.test(value)) return 'Cultura e entretenimento';
  if (/chuva|calor|casa|receita|trânsito|viagem|feriado/.test(value)) return 'Casa e vida prática';
  return 'Cultura e entretenimento';
}

function normalizePillar(value) {
  return String(value || 'geral').toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/\s+e\s+/g, '-')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
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
        category: 'Tecnologia e internet',
        pillar: 'tecnologia-internet',
        suggestedTags: ['tecnologia', 'internet']
      }))
    },
    {
      url: 'https://dev.to/api/articles?top=1&per_page=5',
      parse: data => (Array.isArray(data) ? data : []).map(item => ({
        title: item.title,
        summary: `Artigo em alta na comunidade de desenvolvimento: ${item.title}`,
        category: 'Tecnologia e internet',
        pillar: 'tecnologia-internet',
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
