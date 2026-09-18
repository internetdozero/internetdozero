const MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash-001'
];

function parseJson(text) {
  if (!text) return null;
  const clean = text.replace(/```(?:json)?\s*/gi, '').replace(/```\s*$/gi, '').trim();
  try {
    return JSON.parse(clean);
  } catch (_) {
    const start = clean.indexOf('{');
    const end = clean.lastIndexOf('}');
    if (start < 0 || end <= start) return null;
    try { return JSON.parse(clean.slice(start, end + 1)); } catch (_) { return null; }
  }
}

export async function generateArticle(env, topic) {
  console.log(`Generating article for topic: ${topic.title}`);
  const referenceDate = new Date().toISOString().slice(0, 10);
  let lastFailure = 'no response';

  const articlePrompt = `Você é o redator do blog internetdozero. Seu estilo é:
- Didático e direto, sem jargões corporativos
- Tom de conversa, como explicar algo para um amigo inteligente
- Usa analogias concretas do cotidiano
- Seções com substância real, não padding
- Links para fontes reais no corpo do texto (formato Markdown)
- Conclusão prática: o que o leitor pode fazer agora

REGRAS ABSOLUTAS:
- NUNCA use: "neste artigo vamos explorar", "é importante ressaltar", "em um mundo cada vez mais conectado", "nos dias de hoje", "vamos mergulhar", "sem mais delongas"
- NÃO comece com uma definição de dicionário
- Varie a abertura: história breve, pergunta provocativa, dado surpreendente, cenário do cotidiano
- Seções podem ter tamanhos diferentes (2 a 5 parágrafos cada)
- Tenha opinião cautelosa, não fique em cima do muro
- O tom é humano, não robótico
- A data de referência desta pauta é ${referenceDate}. Escreva considerando esse dia, não o seu
  conhecimento antigo. Antes de afirmar que algo é recente, atual, aprovado, em votação ou vigente,
  confirme o status na pesquisa.
- Diferencie claramente fato atual, contexto histórico e previsão. Para cada fato temporal relevante,
  use a data exata (dia/mês/ano) e nunca trate uma notícia antiga como novidade.
- Não invente leis, projetos, órgãos, empresas, estudos, números ou links. Só cite entidades que a
  pesquisa confirmou e prefira a fonte oficial correspondente. Se não conseguir confirmar, não cite.
- Não faça propaganda de ferramentas do site. Só mencione uma ferramenta se ela resolver diretamente
  uma tarefa concreta do leitor; em temas de política, sociedade, notícias ou análise geral, não inclua
  recomendações artificiais nem frases promocionais.

Escreva um artigo completo sobre "${topic.title}".
Contexto e resumo: ${topic.summary}
Categoria: ${topic.category}
Tags sugeridas: ${(topic.suggestedTags || []).join(', ')}

O output deve ser estritamente no seguinte formato JSON:
{
  "title_pt": "...",
  "subtitle_pt": "...",
  "category": "${topic.category}",
  "tags_pt": ["..."],
  "sections_pt": [
    { "id": "slug-da-secao", "title": "Título", "content": "Markdown..." }
  ]
}`;

  for (const model of MODELS) {
    try {
      const url = env.AI_GATEWAY_URL
        ? `${env.AI_GATEWAY_URL.replace(/\/$/, '')}/v1/models/${model}:generateContent`
        : `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;
      const request = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(env.AI_GATEWAY_URL ? { 'x-goog-api-key': env.GEMINI_API_KEY } : {})
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: articlePrompt }] }],
          tools: [{ googleSearch: {} }]
        }),
        signal: AbortSignal.timeout(45000)
      };
      let res = await fetch(url, request);

      if (!res.ok) {
        lastFailure = `${model} via gateway: ${res.status}`;
        console.error(`Article generation model ${model} returned ${res.status}: ${await res.text()}`);
        if (!env.AI_GATEWAY_URL) continue;
        res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`, {
          ...request,
          headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) {
          lastFailure = `${model} direct: ${res.status}`;
          console.error(`Article generation direct fallback ${model} returned ${res.status}: ${await res.text()}`);
          continue;
        }
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || '')
        .join(' ');
      const article = parseJson(text);
      if (article && article.title_pt && article.sections_pt?.length) {
        console.log(`Successfully generated article with model ${model}`);
        return article;
      }
      lastFailure = `${model}: invalid JSON`;
      console.error(`Article generation model ${model} returned no valid article JSON`);
    } catch (error) {
      lastFailure = `${model}: ${error.message}`;
      console.error(`Article generation model ${model} failed: ${error.message}`);
    }
  }

  if (env.DEEPSEEK_API_KEY) {
    const sources = await searchSources(topic.title);
    const sourceContext = sources.map((source, index) =>
      `[${index + 1}] ${source.title}\nData: ${source.date || 'não informada'}\nURL: ${source.url}\nResumo: ${source.summary}`
    ).join('\n\n');
    const deepseekPrompt = `${articlePrompt}

FONTES PESQUISADAS E DISPONÍVEIS:
${sourceContext || 'Nenhuma fonte foi encontrada. Não invente fontes nem fatos atuais.'}

Use somente as fontes acima para fatos atuais. Inclua no texto links Markdown para as fontes
que realmente sustentarem cada afirmação. Se as fontes forem insuficientes, escreva o artigo
como contexto histórico claramente identificado, sem fingir que é uma notícia de hoje.`;

    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.DEEPSEEK_API_KEY}` },
        body: JSON.stringify({
          model: 'deepseek-flash',
          messages: [{ role: 'user', content: deepseekPrompt }],
          stream: false
        }),
        signal: AbortSignal.timeout(60000)
      });
      if (!response.ok) throw new Error(`DeepSeek returned ${response.status}: ${await response.text()}`);
      const data = await response.json();
      const article = parseJson(data.choices?.[0]?.message?.content);
      if (article?.title_pt && article.sections_pt?.length) {
        console.log('Successfully generated article with DeepSeek');
        return article;
      }
      throw new Error('DeepSeek returned no valid article JSON');
    } catch (error) {
      console.error(`DeepSeek article generation failed: ${error.message}`);
    }
  }

  throw new Error(`Failed to generate article with all available models (${lastFailure})`);
}

async function searchSources(topic) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(`${topic} Brasil`)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) return [];
    const xml = await response.text();
    return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].slice(0, 6).map((match) => {
      const item = match[1];
      return {
        title: decodeXml(item.match(/<title>([\s\S]*?)<\/title>/i)?.[1]),
        url: decodeXml(item.match(/<link>([\s\S]*?)<\/link>/i)?.[1]),
        date: decodeXml(item.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1]),
        summary: decodeXml(item.match(/<description>([\s\S]*?)<\/description>/i)?.[1]).replace(/<[^>]+>/g, '')
      };
    }).filter((source) => source.title && source.url);
  } catch (error) {
    console.error(`News source search failed: ${error.message}`);
    return [];
  }
}

function decodeXml(value = '') {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").trim();
}

export async function validateArticleSources(article) {
  const urls = [...new Set(
    (article.sections_pt || [])
      .flatMap((section) => String(section.content || '').match(/https?:\/\/[^\s)]+/g) || [])
      .map((url) => url.replace(/[.,;:]+$/, ''))
  )];

  for (const url of urls) {
    let response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(10000)
    });
    if (response.status === 405 || response.status === 403) {
      response = await fetch(url, {
        headers: { Range: 'bytes=0-1024' },
        redirect: 'follow',
        signal: AbortSignal.timeout(10000)
      });
    }
    if (!response.ok) {
      throw new Error(`Source validation failed (${response.status}): ${url}`);
    }
  }

  console.log(`Validated ${urls.length} article source link(s)`);
  return article;
}
