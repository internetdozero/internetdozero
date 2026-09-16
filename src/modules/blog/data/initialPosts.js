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
    tags: ["Tutoriais", "Hardware", "Inteligência Artificial"],
    bilingual: true,
    sections_pt: [
      {
        id: "intro",
        title: "Por que rodar modelos localmente?",
        content: "Se você tiver paixão pelo universo da inteligência artificial, talvez uma ótima ideia seja [começar a rodar modelos locais](#quantizacao) direto no seu computador.\n\nVocê não precisa de um cluster corporativo para ter IA útil no dia a dia. Com o avanço das quantizações modernas, modelos de 8B a 14B parâmetros rodam com folga em placas de consumo.\n\nMais importante do que economizar tokens em API externa: ninguém além de você vê o que está sendo processado."
      },
      {
        id: "quantizacao",
        title: "Entendendo quantização GGUF e EXL2",
        content: "Quantização é a técnica de reduzir a precisão dos pesos do modelo (de 16-bit para 4-bit ou 5-bit) com perda quase imperceptível de coerência.\n\n• **Q4_K_M**: O padrão ouro de custo-benefício. Cabe em 8GB de VRAM e roda com extrema velocidade.\n• **Q5_K_M**: Coerência máxima para textos longos, ideal se você tem 12GB a 16GB de VRAM."
      },
      {
        id: "stack",
        title: "Ferramentas populares para execução local",
        content: "Aqui estão os ecossistemas mais populares para rodar modelos no seu sistema:\n\n1. [Ollama](https://ollama.com)\n\nSe você quer praticidade imediata, o [Ollama](https://ollama.com) permite baixar e subir modelos com um único comando no terminal, oferecendo API local compatível com qualquer biblioteca moderna.\n\n2. [llama.cpp](https://github.com/ggerganov/llama.cpp)\n\nPara controle absoluto de camadas na GPU, threads de CPU e máximo desempenho nativo em C++, o [llama.cpp](https://github.com/ggerganov/llama.cpp) continua sendo o motor definitivo."
      },
      {
        id: "conclusao",
        title: "Veredito e primeiros passos",
        content: "Comece com um modelo 8B como Llama 3.1 ou Qwen 2.5 7B. A soberania de ter o modelo operando offline no seu hardware compensa cada gigabyte baixado."
      }
    ]
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
    sections_pt: [
      {
        id: "o-chiado",
        title: "O ritual sonoro da meia-noite",
        content: "Aquele chiado característico do modem de 56kbps não era apenas ruído: era um ritual solene de passagem. Esperar a virada para a meia-noite de sábado para pagar apenas um pulso na conta telefônica era a engenharia de sobrevivência dos pioneiros."
      },
      {
        id: "o-quarto-escuro",
        title: "O quarto escuro e a tela CRT",
        content: "A tela de tubo CRT de 14 polegadas iluminando o quarto escuro, o medo visceral dos pais acordarem com os tons de discagem e o MSN abrindo devagar.\n\nNão havia algoritmo dizendo o que sentir. Era você, alguns fóruns e a sensação de que a internet era um território livre a ser explorado."
      }
    ],
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
    sections_pt: [
      {
        id: "anos-2000",
        title: "A era das páginas pessoais caóticas",
        content: "Nos anos 2000, qualquer um podia ter seu cantinho na rede. Páginas em HTML puro, sem métrica de vaidade, sem rastreamento de anúncios e sem algoritmo otimizando tempo de tela."
      },
      {
        id: "cercados",
        title: "Os cercados das grandes plataformas",
        content: "Hoje, a maior parte do tráfego passa por poucas plataformas centralizadas. Ter um [site independente](/) e autoral não é só nostalgia: é um ato de soberania digital."
      }
    ]
  }
];
