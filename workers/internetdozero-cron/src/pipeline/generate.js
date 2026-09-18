export async function generateArticle(env, topic) {
  console.log(`Generating outline for topic: ${topic.title}`);
  
  // Step 1: Research outline with grounding
  const outlinePrompt = `Pesquise sobre o tópico: "${topic.title}".
Crie um esboço detalhado para um artigo de blog sobre isso.
Inclua fatos reais, fontes verificáveis e eventos recentes.
O esboço deve ter os pontos principais a serem abordados, mas mantenha-se em tópicos gerais, não escreva o artigo completo ainda.
Resuma também o contexto: ${topic.summary}`;

  let outline = "";
  try {
    const outlineUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`;
    const outlineRes = await fetch(outlineUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: outlinePrompt }] }],
        tools: [{ google_search: {} }]
      }),
      signal: AbortSignal.timeout(60000)
    });
    
    if (!outlineRes.ok) throw new Error(`Gemini outline error: ${outlineRes.status}`);
    const outlineData = await outlineRes.json();
    outline = outlineData.candidates?.[0]?.content?.parts?.[0]?.text || topic.summary;
  } catch (err) {
    console.error('Error generating outline, falling back to topic summary:', err);
    outline = topic.summary;
  }

  console.log(`Generating full article based on outline`);
  // Step 2: Full article generation
  const articlePrompt = `Baseado no seguinte esboço e fatos:
${outline}

Escreva um artigo completo sobre "${topic.title}".
A categoria sugerida é "${topic.category}". As tags sugeridas são: ${topic.suggestedTags.join(', ')}.

Você é o redator do blog internetdozero. Seu estilo é:
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

O output deve ser estritamente no seguinte formato JSON:
{
  "title_pt": "...",
  "subtitle_pt": "...",
  "category": "...",
  "tags_pt": ["..."],
  "sections_pt": [
    { "id": "slug-da-secao", "title": "Título", "content": "Markdown..." }
  ]
}`;

  const articleUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`;
  const articleRes = await fetch(articleUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: articlePrompt }] }],
      generationConfig: { response_mime_type: 'application/json' }
    }),
    signal: AbortSignal.timeout(60000)
  });

  if (!articleRes.ok) throw new Error(`Gemini article error: ${articleRes.status}`);
  const articleData = await articleRes.json();
  const articleText = articleData.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!articleText) throw new Error('No content generated for article');
  
  return JSON.parse(articleText);
}
