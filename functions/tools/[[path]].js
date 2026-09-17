const SITE = 'https://internetdozero.com.br';

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

const tools = {
  'compressor-de-imagem': {
    name: 'Compressor de Imagens',
    title: 'Compressor de Imagens WebP, JPEG e PNG Online',
    desc: 'Reduza o peso de fotos e ilustrações sem perder qualidade. Processamento 100% local no seu navegador com suporte a WebP, JPEG e PNG.',
    category: 'MultimediaApplication',
    faq: [
      { q: 'Meus arquivos são enviados para algum servidor?', a: 'Não. Todo o processamento é feito diretamente pelo Canvas da GPU/CPU do seu navegador. Nenhum byte sai da sua máquina.' },
      { q: 'Qual formato gera o menor tamanho de arquivo?', a: 'O formato WebP costuma gerar arquivos de 25% a 35% menores que o JPEG com a mesma fidelidade visual.' },
      { q: 'Existe limite de imagens ou tamanho?', a: 'O limite por imagem é de 20 MB para garantir desempenho suave e sem travamento na memória do seu navegador.' }
    ]
  },
  'gerador-de-senhas': {
    name: 'Gerador de Senhas',
    title: 'Gerador de Senhas Fortes e Seguras Online',
    desc: 'Crie senhas criptograficamente seguras com letras, números e símbolos usando a Crypto API nativa. Zero transmissão ou armazenamento.',
    category: 'SecurityApplication',
    faq: [
      { q: 'As senhas geradas são salvas ou rastreadas?', a: 'Não. As senhas são calculadas em memória pela Web Cryptography API do seu próprio navegador e descartadas imediatamente.' },
      { q: 'Quantos caracteres uma senha segura deve ter?', a: 'Recomendamos pelo menos 16 a 20 caracteres combinando maiúsculas, minúsculas, números e símbolos especiais.' }
    ]
  },
  'masterizador-de-audio': {
    name: 'Masterizador de Áudio',
    title: 'Masterizador de Áudio e Equalizador Dinâmico Online',
    desc: 'Melhore a dinâmica, volume e presença dos seus arquivos de áudio direto no navegador através da Web Audio API.',
    category: 'AudioApplication',
    faq: [
      { q: 'O áudio perde qualidade no processamento?', a: 'O processamento ocorre em ponto flutuante de 32 bits no pipeline do Web Audio e a exportação é feita em WAV sem perdas.' }
    ]
  },
  'remover-metadados': {
    name: 'Removedor de Metadados EXIF',
    title: 'Removedor de Metadados EXIF e Dados GPS de Imagens',
    desc: 'Limpe localização por GPS, modelo da câmera, data e dados pessoais embutidos em fotos antes de compartilhar na internet.',
    category: 'UtilitiesApplication',
    faq: [
      { q: 'Por que remover metadados de fotos?', a: 'Fotos tiradas com celular contêm coordenadas exatas de GPS de onde foram tiradas, além de data, horário e modelo do aparelho.' }
    ]
  },
  'cortador-de-audio': {
    name: 'Cortador de Áudio',
    title: 'Cortador de Áudio e Editor de Faixas Online',
    desc: 'Corte trechos exatos de músicas e gravações com prévia visual da forma de onda e exportação sem compressão adicional.',
    category: 'AudioApplication',
    faq: [
      { q: 'Como exporto o trecho selecionado?', a: 'Basta ajustar os marcadores de início e fim na linha do tempo e clicar em Exportar WAV para baixar o arquivo pronto.' }
    ]
  },
  'extrator-de-audio': {
    name: 'Extrator de Áudio de Vídeo',
    title: 'Extrator de Áudio de Vídeos (MP4 para WAV) com WebAssembly',
    desc: 'Extraia o áudio de qualquer arquivo de vídeo usando FFmpeg.wasm localmente. Rápido, sem fila e sem gastar plano de dados com upload de vídeos pesados.',
    category: 'MultimediaApplication',
    faq: [
      { q: 'Preciso fazer upload do vídeo?', a: 'Não! O motor do FFmpeg roda compilado em WebAssembly dentro da sua aba, lendo o arquivo direto do seu disco.' }
    ]
  },
  'contador-de-texto': {
    name: 'Contador de Texto',
    title: 'Contador de Palavras, Caracteres e Tempo de Leitura',
    desc: 'Analise textos em tempo real: contagem de caracteres, palavras sem espaços, parágrafos, linhas e estimativa de leitura para apresentações e redes sociais.',
    category: 'UtilitiesApplication',
    faq: [
      { q: 'Como é calculado o tempo de leitura?', a: 'Utilizamos a média padrão de leitura humana de 200 a 220 palavras por minuto em português e inglês.' }
    ]
  },
  'gerador-de-qr-code': {
    name: 'Gerador de QR Code',
    title: 'Gerador de QR Code Grátis, Sem Expirar e Sem Anúncios',
    desc: 'Crie QR Codes estáticos em PNG ou SVG para links, Pix, Wi-Fi e textos. Sem expiração, sem intermediários e com suporte a cores personalizadas.',
    category: 'UtilitiesApplication',
    faq: [
      { q: 'O QR Code expira depois de um tempo?', a: 'Não! Nossos QR Codes são 100% estáticos: o texto ou link é gravado diretamente no desenho geométrico. Eles nunca expiram nem dependem de redirecionamento.' },
      { q: 'Posso usar comercialmente em embalagens ou cardápios?', a: 'Sim, totalmente livre de royalties. Recomendamos baixar em SVG para impressão em alta resolução sem pixelar.' }
    ]
  },
  'comparador-de-texto': {
    name: 'Comparador de Texto (Diff)',
    title: 'Comparador de Texto e Código (Diff Linha a Linha) Online',
    desc: 'Compare dois textos, contratos ou códigos-fonte e visualize inserções, remoções e alterações linha a linha com destaque de cores instantâneo.',
    category: 'DeveloperApplication',
    faq: [
      { q: 'O comparador funciona com arquivos de código?', a: 'Sim, suporta JavaScript, Python, JSON, Markdown, texto puro e qualquer arquivo de formato legível.' }
    ]
  },
  'formatador-json': {
    name: 'Formatador de JSON',
    title: 'Formatador, Validador e Minificador de JSON Online',
    desc: 'Formate, idente, valide e compacte JSON com detecção de erros de sintaxe em tempo real. Seguro para dados confidenciais pois nunca sai da máquina.',
    category: 'DeveloperApplication',
    faq: [
      { q: 'É seguro colar chaves de API ou payloads confidenciais?', a: 'Sim! Ao contrário de outros formatadores que enviam os dados para analytics ou logs de servidores, o processamento ocorre exclusivamente no seu navegador.' }
    ]
  }
};

const aliases = {
  'image-compressor': 'compressor-de-imagem',
  'password-generator': 'gerador-de-senhas',
  'audio-master': 'masterizador-de-audio',
  'metadata-remover': 'remover-metadados',
  'audio-trimmer': 'cortador-de-audio',
  'video-audio-extractor': 'extrator-de-audio',
  'text-counter': 'contador-de-texto',
  'qr-code-generator': 'gerador-de-qr-code',
  'text-diff-checker': 'comparador-de-texto',
  'json-formatter': 'formatador-json'
};

function applyMetadata(html, { title, description, url, structuredData }) {
  let output = html;
  output = output.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  output = output.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${escapeHtml(description)}" />`);
  output = output.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i, `<link rel="canonical" href="${url}" />`);
  output = output.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  output = output.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  output = output.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i, `<meta property="og:url" content="${url}" />`);
  output = output.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:title" content="${escapeHtml(title)}" />`);
  output = output.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:description" content="${escapeHtml(description)}" />`);
  output = output.replace(/<meta\s+name="twitter:url"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:url" content="${url}" />`);
  if (structuredData) {
    output = output.replace('</head>', `<script type="application/ld+json">${structuredData}</script></head>`);
  }
  return output;
}

export async function onRequestGet(context) {
  const pathParam = context.params.path;
  const rawSlug = Array.isArray(pathParam) ? pathParam.join('/') : (pathParam || '');
  const slug = aliases[rawSlug] || rawSlug;

  const shell = await context.next();
  const html = await shell.text();

  if (!slug) {
    // /tools catalog page
    const title = 'Ferramentas Web Locais & Privadas — Internet do Zero';
    const description = '10 utilitários rápidos que rodam 100% no seu navegador sem enviar arquivos para servidores: compressor de imagem, extrator de áudio, QR Code e mais.';
    const url = `${SITE}/tools`;
    const listHtml = Object.entries(tools).map(([toolSlug, tool]) => `<li><a href="/tools/${toolSlug}"><strong>${escapeHtml(tool.name)}</strong>: ${escapeHtml(tool.desc)}</a></li>`).join('');
    const catalogPrerender = `<main><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p><ul>${listHtml}</ul></main>`;

    const body = applyMetadata(html, { title, description, url }).replace('<div id="root"></div>', `<div id="root">${catalogPrerender}</div>`);
    return new Response(body, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=300, s-maxage=3600' } });
  }

  const tool = tools[slug];
  if (!tool) {
    return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  const title = `${tool.title} — Internet do Zero`;
  const description = tool.desc;
  const url = `${SITE}/tools/${slug}`;

  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    headline: tool.title,
    description: tool.desc,
    url,
    applicationCategory: tool.category,
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL'
    }
  }).replace(/</g, '\\u003c');

  const faqHtml = tool.faq.map((f) => `<section><h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p></section>`).join('');
  const toolPrerender = `<article><h1>${escapeHtml(tool.title)}</h1><p>${escapeHtml(tool.desc)}</p><section><h2>Como usar</h2><ol><li>Selecione ou arraste seu arquivo no navegador.</li><li>Ajuste as opções desejadas.</li><li>Baixe o resultado diretamente sem esperar fila ou upload.</li></ol></section><section><h2>Privacidade e Processamento Local</h2><p>Processado 100% no seu computador ou celular. Nenhum dado ou arquivo é enviado para servidores externos.</p></section><section><h2>Dúvidas Frequentes</h2>${faqHtml}</section></article>`;

  const body = applyMetadata(html, { title, description, url, structuredData }).replace('<div id="root"></div>', `<div id="root">${toolPrerender}</div>`);
  return new Response(body, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=300, s-maxage=3600' } });
}
