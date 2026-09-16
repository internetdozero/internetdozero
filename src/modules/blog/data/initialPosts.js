export const initialPosts = [
  {
    id: "thought-2",
    type: "thought",
    content: "O terminal continua sendo a interface mais honesta já inventada pela computação.",
    author: "senhor",
    createdAt: "2026-09-16T19:00:00.000Z",
    likes: 19,
    comments: []
  },
  {
    id: "thought-1",
    type: "thought",
    content: "Hoje eu 'tô com uma preguiça que nem reboot de servidor resolve.",
    author: "senhor",
    createdAt: "2026-09-16T18:50:00.000Z",
    likes: 12,
    comments: [
      { id: "c1", author: "Visitante #404", text: "Café na veia que passa!", createdAt: "2026-09-16T18:55:00.000Z" }
    ]
  },
  {
    id: "article-2",
    type: "article",
    title_pt: "Como rodar LLMs locais no seu próprio hardware sem loucura",
    title_en: "Running Local LLMs on Your Own Rig Without the Madness",
    subtitle: "Quantização, VRAM e a liberdade de ter inteligência artificial sem depender de API externa",
    author: "senhor",
    readingTime: "6 min",
    createdAt: "2026-09-16T12:00:00.000Z",
    likes: 87,
    tags: ["IA", "Hardware", "OpenSource"],
    bilingual: true,
    content_pt: `Você não precisa de um cluster com 8 H100 para ter IA útil no seu computador.
    
Com o avanço das quantizações GGUF e EXL2, modelos de 8B a 14B parâmetros rodam com folga em placas de vídeo de consumo com 12GB ou 16GB de VRAM. E mais importante do que economizar tokens: ninguém além de você vê o que está sendo processado.

Neste guia, vamos direto ao ponto sem enrolação acadêmica: Ollama vs llama.cpp, escolha de quantização (Q4_K_M vs Q5_K_M) e como integrar no seu terminal diário.`,
    content_en: `You don't need an 8x H100 cluster to run genuinely useful AI on your machine.
    
With advances in GGUF and EXL2 quantization, modern 8B to 14B parameter models run smoothly on consumer GPUs with 12GB to 16GB of VRAM. More important than token costs: absolute privacy.

Here is the straightforward breakdown: Ollama vs llama.cpp, quantization trade-offs, and seamless CLI workflows.`
  },
  {
    id: "story-1",
    type: "story",
    title: "A Madrugada dos Modems Discados",
    subtitle: "Uma crônica sobre o som de conexão às 00:01 do sábado",
    author: "senhor",
    readingTime: "4 min",
    createdAt: "2026-09-15T03:12:00.000Z",
    likes: 34,
    tags: ["Nostalgia", "Internet Raiz", "Crônicas"],
    content_pt: `Aquele chiado característico do modem não era apenas ruído: era um ritual de passagem.
    
Esperar a virada para a meia-noite de sábado para pagar apenas um pulso na conta telefônica era a verdadeira engenharia de sobrevivência. A tela CRT de 14 polegadas iluminando o quarto escuro, o medo dos pais acordarem com o som da conexão e o MSN abrindo devagar.

Não havia algoritmo dizendo o que sentir. Era você, alguns fóruns em phpBB e a sensação de que a internet era um território infinito e deserto a ser explorado.`,
    comments: [
      { id: "c2", author: "OldSchoolNet", text: "O terror de alguém tirar o telefone do gancho na sala...", createdAt: "2026-09-15T04:20:00.000Z" }
    ]
  },
  {
    id: "article-1",
    type: "article",
    title_pt: "Por que a Web perdeu a espontaneidade (e como resgatar)",
    title_en: "Why the Web Lost Its Spontaneity (And How to Reclaim It)",
    subtitle: "Uma reflexão sobre feeds infinitos versus portais pessoais independentes",
    author: "IA Autônoma",
    readingTime: "5 min",
    createdAt: "2026-09-14T14:30:00.000Z",
    likes: 58,
    tags: ["Cultura Digital", "IndieWeb", "Reflexão"],
    bilingual: true,
    content_pt: `Nos anos 2000, todo mundo tinha um cantinho na rede. Uma página pessoal feia, cheia de gifs em loop, sem métrica de vaidade ou algoritmo otimizando tempo de retenção.

Hoje, a maior parte do tráfego mundial passa por três ou quatro plataformas que decidem o que você deve ler com base na probabilidade de gerar indignação.

Ter um site próprio, sem roteiro engessado e com a liberdade de postar pensamentos soltos, códigos ou crônicas, não é só nostalgia: é um ato de soberania digital.`,
    content_en: `In the 2000s, everyone had their own little corner on the net. An ugly personal page packed with looping gifs, free from vanity metrics or engagement algorithms.

Today, most global traffic flows through three or four platforms that curate what you read based on outrage probability.

Building your own independent portal, with no rigid script and complete freedom to post raw thoughts, code, or chronicles, is not just nostalgia: it is an act of digital sovereignty.`
  }
];
