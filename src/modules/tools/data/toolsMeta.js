export const toolsMetadata = {
  'compressor-de-imagem': {
    id: 'compressor-de-imagem',
    slugEn: 'image-compressor',
    namePt: 'Compressor de Imagens',
    nameEn: 'Image Compressor',
    h1Pt: 'Compressor de Imagens WebP, JPEG e PNG Online',
    h1En: 'Online WebP, JPEG & PNG Image Compressor',
    descPt: 'Reduza o peso de fotos e ilustrações sem perder qualidade. Processamento 100% local no seu navegador com suporte a WebP, JPEG e PNG.',
    descEn: 'Reduce photo and illustration file sizes without losing quality. 100% local in-browser processing supporting WebP, JPEG and PNG.',
    keywords: 'compressor de imagem, diminuir tamanho foto, webp converter, comprimir png online, comprimir jpeg gratis',
    schemaCategory: 'MultimediaApplication',
    faq: [
      { q: 'Meus arquivos são enviados para algum servidor?', a: 'Não. Todo o processamento é feito diretamente pelo Canvas da GPU/CPU do seu navegador. Nenhum byte sai da sua máquina.' },
      { q: 'Qual formato gera o menor tamanho de arquivo?', a: 'O formato WebP costuma gerar arquivos de 25% a 35% menores que o JPEG com a mesma fidelidade visual.' },
      { q: 'Existe limite de imagens ou tamanho?', a: 'O limite por imagem é de 20 MB para garantir desempenho suave e sem travamento na memória do seu navegador.' }
    ]
  },
  'gerador-de-senhas': {
    id: 'gerador-de-senhas',
    slugEn: 'password-generator',
    namePt: 'Gerador de Senhas',
    nameEn: 'Password Generator',
    h1Pt: 'Gerador de Senhas Fortes e Seguras Online',
    h1En: 'Strong & Secure Online Password Generator',
    descPt: 'Crie senhas criptograficamente seguras com letras, números e símbolos usando a Crypto API nativa. Zero transmissão ou armazenamento.',
    descEn: 'Create cryptographically strong passwords with letters, numbers, and symbols using native Crypto API. Zero data transmission or storage.',
    keywords: 'gerador de senhas seguras, criar senha forte, gerador de senha aleatoria, crypto api password',
    schemaCategory: 'SecurityApplication',
    faq: [
      { q: 'As senhas geradas são salvas ou rastreadas?', a: 'Não. As senhas são calculadas em memória pela Web Cryptography API do seu próprio navegador e descartadas imediatamente.' },
      { q: 'Quantos caracteres uma senha segura deve ter?', a: 'Recomendamos pelo menos 16 a 20 caracteres combinando maiúsculas, minúsculas, números e símbolos especiais.' }
    ]
  },
  'masterizador-de-audio': {
    id: 'masterizador-de-audio',
    slugEn: 'audio-master',
    namePt: 'Masterizador de Áudio',
    nameEn: 'Audio Masterizer',
    h1Pt: 'Masterizador de Áudio e Equalizador Dinâmico Online',
    h1En: 'Online Audio Masterizer & Dynamic Equalizer',
    descPt: 'Melhore a dinâmica, volume e presença dos seus arquivos de áudio direto no navegador através da Web Audio API.',
    descEn: 'Improve dynamics, volume, and clarity of your audio files directly in the browser via Web Audio API.',
    keywords: 'masterizar audio online, equalizador som, aumentar volume mp3, normalizar audio',
    schemaCategory: 'AudioApplication',
    faq: [
      { q: 'O áudio perde qualidade no processamento?', a: 'O processamento ocorre em ponto flutuante de 32 bits no pipeline do Web Audio e a exportação é feita em WAV sem perdas.' }
    ]
  },
  'remover-metadados': {
    id: 'remover-metadados',
    slugEn: 'metadata-remover',
    namePt: 'Removedor de Metadados EXIF',
    nameEn: 'Metadata Stripper',
    h1Pt: 'Removedor de Metadados EXIF e Dados GPS de Imagens',
    h1En: 'Remove EXIF Metadata & GPS Location from Photos',
    descPt: 'Limpe localização por GPS, modelo da câmera, data e dados pessoais embutidos em fotos antes de compartilhar na internet.',
    descEn: 'Strip GPS coordinates, camera model, date, and personal EXIF metadata from images before publishing online.',
    keywords: 'remover exif online, tirar gps foto, limpar metadados imagem, privacidade fotos',
    schemaCategory: 'UtilitiesApplication',
    faq: [
      { q: 'Por que remover metadados de fotos?', a: 'Fotos tiradas com celular contêm coordenadas exatas de GPS de onde foram tiradas, além de data, horário e modelo do aparelho.' }
    ]
  },
  'cortador-de-audio': {
    id: 'cortador-de-audio',
    slugEn: 'audio-trimmer',
    namePt: 'Cortador de Áudio',
    nameEn: 'Audio Trimmer',
    h1Pt: 'Cortador de Áudio e Editor de Faixas Online',
    h1En: 'Online Audio Trimmer & Waveform Cutter',
    descPt: 'Corte trechos exatos de músicas e gravações com prévia visual da forma de onda e exportação sem compressão adicional.',
    descEn: 'Cut precise audio segments and recordings with visual waveform preview and local lossless export.',
    keywords: 'cortar audio online, aparar musica, cortar mp3 wav, editor de audio navegador',
    schemaCategory: 'AudioApplication',
    faq: [
      { q: 'Como exporto o trecho selecionado?', a: 'Basta ajustar os marcadores de início e fim na linha do tempo e clicar em Exportar WAV para baixar o arquivo pronto.' }
    ]
  },
  'extrator-de-audio': {
    id: 'extrator-de-audio',
    slugEn: 'video-audio-extractor',
    namePt: 'Extrator de Áudio de Vídeo',
    nameEn: 'Video Audio Extractor',
    h1Pt: 'Extrator de Áudio de Vídeos (MP4 para WAV) com WebAssembly',
    h1En: 'Extract Audio from Video (MP4 to WAV) via WebAssembly',
    descPt: 'Extraia o áudio de qualquer arquivo de vídeo usando FFmpeg.wasm localmente. Rápido, sem fila e sem gastar plano de dados com upload de vídeos pesados.',
    descEn: 'Extract audio from any video file locally using FFmpeg.wasm. Fast, private, and zero upload bandwidth.',
    keywords: 'extrair audio de video, converter mp4 para wav, extrair som video online, ffmpeg wasm local',
    schemaCategory: 'MultimediaApplication',
    faq: [
      { q: 'Preciso fazer upload do vídeo?', a: 'Não! O motor do FFmpeg roda compilado em WebAssembly dentro da sua aba, lendo o arquivo direto do seu disco.' }
    ]
  },
  'contador-de-texto': {
    id: 'contador-de-texto',
    slugEn: 'text-counter',
    namePt: 'Contador de Texto',
    nameEn: 'Text Counter',
    h1Pt: 'Contador de Palavras, Caracteres e Tempo de Leitura',
    h1En: 'Online Word, Character & Reading Time Counter',
    descPt: 'Analise textos em tempo real: contagem de caracteres, palavras sem espaços, parágrafos, linhas e estimativa de leitura para apresentações e redes sociais.',
    descEn: 'Real-time text analysis: character count, words without spaces, paragraphs, lines, and estimated reading time for speeches and social posts.',
    keywords: 'contador de palavras online, contar caracteres texto, tempo de leitura estimativa, limite caracteres twitter',
    schemaCategory: 'UtilitiesApplication',
    faq: [
      { q: 'Como é calculado o tempo de leitura?', a: 'Utilizamos a média padrão de leitura humana de 200 a 220 palavras por minuto em português e inglês.' }
    ]
  },
  'gerador-de-qr-code': {
    id: 'gerador-de-qr-code',
    slugEn: 'qr-code-generator',
    namePt: 'Gerador de QR Code',
    nameEn: 'QR Code Generator',
    h1Pt: 'Gerador de QR Code Grátis, Sem Expirar e Sem Anúncios',
    h1En: 'Free Static QR Code Generator (No Expiration, No Ads)',
    descPt: 'Crie QR Codes estáticos em PNG ou SVG para links, Pix, Wi-Fi e textos. Sem expiração, sem intermediários e com suporte a cores personalizadas.',
    descEn: 'Generate static PNG or SVG QR codes for links, Wi-Fi, and text. No expiration, no redirects, with custom color styling.',
    keywords: 'gerador de qr code gratis, qr code sem expirar, qr code pix sem taxa, criar qr code svg download',
    schemaCategory: 'UtilitiesApplication',
    faq: [
      { q: 'O QR Code expira depois de um tempo?', a: 'Não! Nossos QR Codes são 100% estáticos: o texto ou link é gravado diretamente no desenho geométrico. Eles nunca expiram nem dependem do nosso site continuar no ar.' },
      { q: 'Posso usar comercialmente em embalagens ou cardápios?', a: 'Sim, totalmente livre de royalties. Recomendamos baixar em SVG para impressão em alta resolução sem pixelar.' }
    ]
  },
  'comparador-de-texto': {
    id: 'comparador-de-texto',
    slugEn: 'text-diff-checker',
    namePt: 'Comparador de Texto (Diff)',
    nameEn: 'Text Diff Checker',
    h1Pt: 'Comparador de Texto e Código (Diff Linha a Linha) Online',
    h1En: 'Online Text & Code Diff Checker (Line by Line)',
    descPt: 'Compare dois textos, contratos ou códigos-fonte e visualize inserções, remoções e alterações linha a linha com destaque de cores instantâneo.',
    descEn: 'Compare two texts, documents, or code files with instant side-by-side or unified line-by-line diff highlighting.',
    keywords: 'comparar dois textos online, diff checker gratis, ver diferencas entre textos, comparar codigo',
    schemaCategory: 'DeveloperApplication',
    faq: [
      { q: 'O comparador funciona com arquivos de código?', a: 'Sim, suporta JavaScript, Python, JSON, Markdown, texto puro e qualquer arquivo de formato legível.' }
    ]
  },
  'formatador-json': {
    id: 'formatador-json',
    slugEn: 'json-formatter',
    namePt: 'Formatador de JSON',
    nameEn: 'JSON Formatter',
    h1Pt: 'Formatador, Validador e Minificador de JSON Online',
    h1En: 'Online JSON Formatter, Validator & Minifier',
    descPt: 'Formate, idente, valide e compacte JSON com detecção de erros de sintaxe em tempo real. Seguro para dados confidenciais pois nunca sai da máquina.',
    descEn: 'Format, indent, validate, and minify JSON with real-time syntax error checking. Safe for confidential tokens and payloads.',
    keywords: 'formatador json online, validar json syntax, embelezar json, minificar json local',
    schemaCategory: 'DeveloperApplication',
    faq: [
      { q: 'É seguro colar chaves de API ou payloads confidenciais?', a: 'Sim! Ao contrário de outros formatadores que enviam os dados para analytics ou logs de servidores, o processamento ocorre exclusivamente no seu navegador.' }
    ]
  },
  'descompactador-de-arquivos': {
    id: 'descompactador-de-arquivos',
    slugEn: 'archive-extractor',
    namePt: 'Descompactador de Arquivos',
    nameEn: 'Archive Extractor',
    h1Pt: 'Descompactar .7z, .rar, .zip e .tar Online no Navegador',
    h1En: 'Extract .7z, .rar, .zip & .tar Online in Browser',
    descPt: 'Abra, explore e extraia arquivos compactados nos formatos .7z, .rar, .zip, .tar, .tar.gz e .bz2 direto no navegador via WebAssembly. 100% privado e sem envio para servidores.',
    descEn: 'Open, browse and extract compressed archives (.7z, .rar, .zip, .tar, .tar.gz, .bz2) directly in your browser via WebAssembly. 100% private with zero server uploads.',
    keywords: 'descompactar 7z online, abrir rar no navegador, descompactar zip gratis, extrator de arquivos local, webassembly libarchive',
    schemaCategory: 'UtilitiesApplication',
    faq: [
      { q: 'Quais formatos compactados são suportados?', a: 'Suportamos .7z (7-Zip com compressão LZMA/LZMA2), .rar (versões v4 e v5), .zip, .tar, .tar.gz, .tgz e .bz2.' },
      { q: 'Meus arquivos sobem para a nuvem?', a: 'Não. Todo o processo de descompressão acontece no seu próprio processador através de WebAssembly e Web Workers.' },
      { q: 'Existe limite de tamanho para descompactar?', a: 'O limite depende da memória RAM disponível no seu navegador. Arquivos de centenas de megabytes descompactam suavemente.' }
    ]
  },
  'conversor-de-arquivos': {
    id: 'conversor-de-arquivos',
    slugEn: 'file-converter',
    namePt: 'Conversor de Arquivos',
    nameEn: 'File Converter',
    h1Pt: 'Conversor Universal de Arquivos Online',
    h1En: 'Universal Online File Converter',
    descPt: 'Converta arquivos entre diferentes formatos (PNG, JPG, WebP, AVIF, JSON, CSV, YAML, XML, MD, TXT, Áudio) 100% localmente no navegador. Rápido, seguro e sem limites artificiais.',
    descEn: 'Convert files between various formats (PNG, JPG, WebP, AVIF, JSON, CSV, YAML, XML, MD, TXT, Audio) 100% locally in your browser. Fast, secure and with zero limits.',
    keywords: 'converter arquivo online, converter png para webp, converter json para csv, converter csv para json, conversor x para y',
    schemaCategory: 'UtilitiesApplication',
    faq: [
      { q: 'Quais extensões posso converter?', a: 'Você pode converter imagens (PNG, JPG, WebP, AVIF, BMP, ICO), dados e textos (JSON, CSV, YAML, XML, Markdown, HTML, Base64) e áudio para WAV.' },
      { q: 'A conversão é confidencial?', a: 'Sim. Todas as transformações são executadas via Canvas API, Web Audio API e scripts puros no seu próprio dispositivo.' }
    ]
  }
};

export const toolAliases = {
  'image-compressor': 'compressor-de-imagem',
  'password-generator': 'gerador-de-senhas',
  'audio-master': 'masterizador-de-audio',
  'metadata-remover': 'remover-metadados',
  'audio-trimmer': 'cortador-de-audio',
  'video-audio-extractor': 'extrator-de-audio',
  'text-counter': 'contador-de-texto',
  'qr-code-generator': 'gerador-de-qr-code',
  'text-diff-checker': 'comparador-de-texto',
  'json-formatter': 'formatador-json',
  'archive-extractor': 'descompactador-de-arquivos',
  'file-converter': 'conversor-de-arquivos'
};
