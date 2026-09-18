const TOOLS_MAP = [
  { slug: 'compressor-de-imagem', keywords: ['imagem', 'foto', 'otimização', 'webp', 'comprimir', 'compressão'] },
  { slug: 'gerador-de-senhas', keywords: ['senha', 'segurança', 'autenticação', 'password', 'acesso'] },
  { slug: 'masterizador-de-audio', keywords: ['áudio', 'audio', 'música', 'masterização', 'som', 'equalização'] },
  { slug: 'remover-metadados', keywords: ['metadados', 'exif', 'privacidade', 'foto', 'rastreamento'] },
  { slug: 'cortador-de-audio', keywords: ['áudio', 'audio', 'cortar', 'editar', 'música', 'podcast'] },
  { slug: 'extrator-de-audio', keywords: ['vídeo', 'video', 'áudio', 'audio', 'extrair', 'converter', 'mp3'] },
  { slug: 'contador-de-texto', keywords: ['texto', 'palavras', 'caracteres', 'contagem', 'escrita'] },
  { slug: 'gerador-de-qr-code', keywords: ['qr code', 'código', 'compartilhar', 'link', 'digitalizar'] },
  { slug: 'comparador-de-texto', keywords: ['diff', 'comparar', 'texto', 'código', 'diferença'] },
  { slug: 'formatador-json', keywords: ['json', 'formatar', 'validar', 'dados', 'api'] },
  { slug: 'descompactador-de-arquivos', keywords: ['zip', 'rar', '7z', 'descompactar', 'extrair', 'arquivo'] },
  { slug: 'conversor-de-arquivos', keywords: ['converter', 'arquivo', 'formato', 'mídia'] }
];

export async function enrichArticle(db, article, siteUrl) {
  console.log('Enriching article with tool links and related posts');
  const enrichedArticle = { ...article };
  
  const injectedSlugs = new Set();
  const toolPhrases = [
    (name, url) => `\n\nSe precisar, o internetdozero tem um [${name}](${url}) que funciona direto no navegador, sem upload.`,
    (name, url) => `\n\nAliás, temos um [${name}](${url}) aqui no site que pode ajudar com isso — roda 100% no seu navegador.`
  ];

  for (let i = 0; i < enrichedArticle.sections_pt.length; i++) {
    if (injectedSlugs.size >= 2) break;
    const section = enrichedArticle.sections_pt[i];

    for (const tool of TOOLS_MAP) {
      if (injectedSlugs.has(tool.slug)) continue;
      const match = tool.keywords.some(kw =>
        section.content.toLowerCase().includes(kw)
      );

      if (match) {
        const name = tool.slug.replace(/-/g, ' ');
        const url = `${siteUrl}/tools/${tool.slug}`;
        const phrase = toolPhrases[injectedSlugs.size % toolPhrases.length];
        section.content += phrase(name, url);
        injectedSlugs.add(tool.slug);
        console.log(`Injected tool ${tool.slug} into section ${section.id}`);
        break;
      }
    }
  }

  try {
    const { results } = await db.prepare(
      "SELECT slug, title_pt, category FROM posts WHERE category = ? AND published = 1 ORDER BY created_at DESC LIMIT 3"
    ).bind(article.category).all();

    if (results && results.length > 0) {
      let readAlsoContent = "Quer continuar explorando? Aqui estão algumas sugestões:\n\n";
      for (const post of results) {
        const catSlug = post.category.toLowerCase().replace(/\s+/g, '-');
        readAlsoContent += `- [${post.title_pt}](/blog/${catSlug}/${post.slug})\n`;
      }
      
      enrichedArticle.sections_pt.push({
        id: 'leia-tambem',
        title: 'Leia também',
        content: readAlsoContent
      });
      console.log('Added related posts section');
    }
  } catch (err) {
    console.error('Failed to fetch related posts, skipping:', err);
  }

  return enrichedArticle;
}
