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

export async function generateArticle(env, topic) {
  console.log(`Generating article for topic: ${topic.title}`);

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
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: articlePrompt }] }],
          tools: [{ googleSearch: {} }]
        }),
        signal: AbortSignal.timeout(45000)
      });

      if (!res.ok) continue;

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const article = parseJson(text);
      if (article && article.title_pt && article.sections_pt?.length) {
        console.log(`Successfully generated article with model ${model}`);
        return article;
      }
    } catch (_) {}
  }

  throw new Error('Failed to generate article with all available models');
}
