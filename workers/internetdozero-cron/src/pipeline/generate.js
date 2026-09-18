const MODELS = ['openai/gpt-5.6-luna'];

function parseJson(text) {
  if (!text) return null;
  const clean = text.replace(/```(?:json)?\s*/gi, '').replace(/```\s*$/gi, '').trim();
  try { return JSON.parse(clean); } catch (_) {
    const start = clean.indexOf('{');
    const end = clean.lastIndexOf('}');
    if (start < 0 || end <= start) return null;
    try { return JSON.parse(clean.slice(start, end + 1)); } catch (_) { return null; }
  }
}

function buildPrompt(topic) {
  const date = new Date().toISOString().slice(0, 10);
  return `Você é o redator do blog internetdozero. Escreva em português do Brasil, com tom humano,
didático e direto, sem jargão corporativo. Use seções claras e uma conclusão prática.

REGRAS:
- A data de referência é ${date}; confirme o status atual antes de chamar algo de recente, aprovado,
  em votação ou vigente. Diferencie fato atual, contexto histórico e previsão.
- Use datas exatas para fatos temporais relevantes.
- Não invente leis, projetos, órgãos, empresas, estudos, números ou links. Cite somente fatos e fontes
  confirmados pela pesquisa, preferindo fontes oficiais.
- Não faça propaganda de ferramentas do site; só mencione uma quando resolver diretamente uma tarefa
  concreta do leitor, e nunca em política, sociedade ou análise geral.
- Não use frases como "neste artigo vamos explorar", "é importante ressaltar" ou "nos dias de hoje".

Escreva um artigo completo sobre "${topic.title}".
Contexto: ${topic.summary}
Categoria: ${topic.category}
Tags sugeridas: ${(topic.suggestedTags || []).join(', ')}

Retorne estritamente JSON:
{"title_pt":"...","subtitle_pt":"...","category":"${topic.category}","tags_pt":["..."],
"sections_pt":[{"id":"slug","title":"Título","content":"Markdown com links das fontes"}]}`;
}

export async function generateArticle(env, topic) {
  console.log(`Generating article for topic: ${topic.title}`);
  const prompt = buildPrompt(topic);
  let lastFailure = 'no response';

  if (env.LOCAL_AI_URL && env.LOCAL_AI_TOKEN) {
    try {
      const response = await fetch(`${env.LOCAL_AI_URL.replace(/\/$/, '')}/api/editorial/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + env.LOCAL_AI_TOKEN,
          ...(env.LOCAL_AI_ACCESS_CLIENT_ID && env.LOCAL_AI_ACCESS_CLIENT_SECRET
            ? {
                'CF-Access-Client-Id': env.LOCAL_AI_ACCESS_CLIENT_ID,
                'CF-Access-Client-Secret': env.LOCAL_AI_ACCESS_CLIENT_SECRET
              }
            : {})
        },
        body: JSON.stringify({
          prompt,
          model: env.LOCAL_AI_MODEL || 'gemini-3.8-flash-medium',
          timeoutMs: 120000
        }),
        signal: AbortSignal.timeout(130000)
      });
      if (!response.ok) {
        lastFailure = `local Agy: ${response.status}`;
        console.error(`Local Agy failed: ${response.status} ${await response.text()}`);
      } else {
        const article = parseJson((await response.json()).choices?.[0]?.message?.content);
        if (article?.title_pt && article.sections_pt?.length) {
          console.log('Generated article with local Agy');
          return article;
        }
        lastFailure = 'local Agy: invalid JSON';
        console.error('Local Agy returned no valid article JSON');
      }
    } catch (error) {
      lastFailure = `local Agy: ${error.message}`;
      console.error(`Local Agy error: ${error.message}`);
    }
  }

  const sources = await searchSources(topic.title);
  const sourceContext = formatSources(sources);
  const sourcedPrompt = `${prompt}\n\nFONTES RSS DISPONÍVEIS:\n${sourceContext || 'Nenhuma fonte encontrada.'}\n
Use somente essas fontes para fatos atuais. Inclua links Markdown que sustentem as afirmações.`;

  for (const model of MODELS) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + env.OPENROUTER_API_KEY,
          'HTTP-Referer': env.SITE_URL,
          'X-Title': 'Internet do Zero'
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: sourcedPrompt }],
          max_tokens: 5000,
        }),
        signal: AbortSignal.timeout(60000)
      });
      if (!response.ok) {
        lastFailure = `${model}: ${response.status}`;
        console.error(`OpenRouter ${model} failed: ${response.status} ${await response.text()}`);
        continue;
      }
      const data = await response.json();
      const article = parseJson(data.choices?.[0]?.message?.content);
      if (article?.title_pt && article.sections_pt?.length) {
        console.log(`Generated article with OpenRouter ${model}`);
        return article;
      }
      lastFailure = `${model}: invalid JSON`;
    } catch (error) {
      lastFailure = `${model}: ${error.message}`;
      console.error(`OpenRouter ${model} error: ${error.message}`);
    }
  }

  if (env.DEEPSEEK_API_KEY) {
    const deepseekPrompt = sourcedPrompt;
    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + env.DEEPSEEK_API_KEY },
        body: JSON.stringify({ model: 'deepseek-flash', messages: [{ role: 'user', content: deepseekPrompt }], stream: false }),
        signal: AbortSignal.timeout(60000)
      });
      if (!response.ok) throw new Error(`${response.status}: ${await response.text()}`);
      const article = parseJson((await response.json()).choices?.[0]?.message?.content);
      if (article?.title_pt && article.sections_pt?.length) return article;
      throw new Error('invalid JSON');
    } catch (error) {
      console.error(`DeepSeek fallback failed: ${error.message}`);
    }
  }

  if (env.OPENROUTER_API_KEY && sources.length < 2) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + env.OPENROUTER_API_KEY,
          'HTTP-Referer': env.SITE_URL,
          'X-Title': 'Internet do Zero'
        },
        body: JSON.stringify({
          model: 'perplexity/sonar:online',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 5000,
          plugins: [{ id: 'web', max_results: 6 }]
        }),
        signal: AbortSignal.timeout(60000)
      });
      if (!response.ok) throw new Error(`${response.status}: ${await response.text()}`);
      const article = parseJson((await response.json()).choices?.[0]?.message?.content);
      if (article?.title_pt && article.sections_pt?.length) return article;
      throw new Error('invalid JSON');
    } catch (error) {
      console.error(`Sonar research fallback failed: ${error.message}`);
    }
  }
  throw new Error(`Failed to generate article with all available models (${lastFailure})`);
}

function formatSources(sources) {
  return sources.map((source, index) =>
    `[${index + 1}] ${source.title}\nData: ${source.date || 'não informada'}\nURL: ${source.url}\nResumo: ${source.summary}`
  ).join('\n\n');
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
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").trim();
}

export async function validateArticleSources(article) {
  const urls = [...new Set(
    (article.sections_pt || []).flatMap((section) =>
      String(section.content || '').match(/https?:\/\/[^\s)]+/g) || []
    ).map((url) => url.replace(/[.,;:]+$/, ''))
  )];
  for (const url of urls) {
    let response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(10000) });
    if (response.status === 405 || response.status === 403) {
      response = await fetch(url, { headers: { Range: 'bytes=0-1024' }, redirect: 'follow', signal: AbortSignal.timeout(10000) });
    }
    if (!response.ok) throw new Error(`Source validation failed (${response.status}): ${url}`);
  }
  console.log(`Validated ${urls.length} article source link(s)`);
  return article;
}
