const TOOLS_MAP = [
  { slug: 'compressor-de-imagem', keywords: ['webp', 'jpeg', 'png', 'comprimir imagem', 'comprimir foto'] },
  { slug: 'gerador-de-senhas', keywords: ['criar senha', 'gerar senha', 'senha forte', 'gerenciador de senhas', 'autenticação de conta'] },
  { slug: 'masterizador-de-audio', keywords: ['masterizar áudio', 'masterização', 'equalização', 'mixagem'] },
  { slug: 'remover-metadados', keywords: ['metadados exif', 'remover metadados', 'privacidade de foto', 'dados exif'] },
  { slug: 'cortador-de-audio', keywords: ['cortar áudio', 'editar áudio', 'cortar música', 'editar podcast'] },
  { slug: 'extrator-de-audio', keywords: ['extrair áudio', 'converter vídeo em mp3', 'áudio de vídeo'] },
  { slug: 'contador-de-texto', keywords: ['contar palavras', 'contagem de caracteres', 'limite de palavras'] },
  { slug: 'gerador-de-qr-code', keywords: ['gerar qr code', 'código qr', 'qr code para link'] },
  { slug: 'comparador-de-texto', keywords: ['comparar textos', 'diferenças entre textos', 'comparar código'] },
  { slug: 'formatador-json', keywords: ['formatar json', 'validar json', 'json de api'] },
  { slug: 'descompactador-de-arquivos', keywords: ['descompactar zip', 'descompactar rar', 'abrir arquivo 7z'] },
  { slug: 'conversor-de-arquivos', keywords: ['converter arquivo', 'converter formato', 'converter mídia'] }
];

export async function enrichArticle(db, article, siteUrl) {
  console.log('Enriching article with tool links and related posts');
  const enrichedArticle = { ...article };
  
  const injectedSlugs = new Set();

  for (let i = 0; i < enrichedArticle.sections_pt.length; i++) {
    if (injectedSlugs.size >= 1) break;
    const section = enrichedArticle.sections_pt[i];

    for (const tool of TOOLS_MAP) {
      if (injectedSlugs.has(tool.slug)) continue;
      const match = tool.keywords.some((kw) => section.content.toLowerCase().includes(kw));

      if (match) {
        const name = tool.slug.replace(/-/g, ' ');
        const url = `${siteUrl}/tools/${tool.slug}`;
        section.content += `\n\nSe fizer sentido para este caso, o [${name}](${url}) é uma opção prática — direto no navegador.`;
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
