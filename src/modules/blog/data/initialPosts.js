export const initialPosts = [
  {
    id: "thought-2",
    type: "thought",
    content: "O terminal continua sendo a interface mais honesta já inventada pela computação.",
    content_en: "The terminal remains the most honest interface ever invented in computing.",
    author: "senhor",
    createdAt: "2026-09-16T19:00:00.000Z",
    likes: 19,
    comments: []
  },
  {
    id: "thought-1",
    type: "thought",
    content: "Hoje eu 'tô com uma preguiça que nem reboot de servidor resolve.",
    content_en: "Today I'm lazy in a way that not even a cold server reboot can fix.",
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
    subtitle_pt: "Quantização, VRAM e a liberdade de ter inteligência artificial sem depender de API externa",
    subtitle_en: "Quantization, VRAM, and the freedom of running AI without third-party API dependencies",
    author: "senhor",
    readingTime: "6 min",
    createdAt: "2026-09-16T12:00:00.000Z",
    likes: 87,
    tags_pt: ["Tutoriais", "Hardware", "Inteligência Artificial"],
    tags_en: ["Tutorials", "Hardware", "Local LLMs"],
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
    ],
    sections_en: [
      {
        id: "intro",
        title: "Why run models locally?",
        content: "If you are passionate about artificial intelligence, a great step forward is to [run local LLMs](#quantizacao) right on your personal rig.\n\nYou do not need an enterprise server cluster for practical daily AI. Thanks to modern quantization breakthroughs, 8B to 14B parameter models run seamlessly on consumer-grade GPUs.\n\nEven more critical than cutting external API token bills: absolute privacy and digital sovereignty—nobody sees your prompt data."
      },
      {
        id: "quantizacao",
        title: "Understanding GGUF & EXL2 quantization",
        content: "Quantization reduces parameter weight precision (e.g. from 16-bit float down to 4-bit or 5-bit integers) with negligible coherence loss.\n\n• **Q4_K_M**: The sweet spot for price-to-performance. Fits comfortably within 8GB VRAM with blazing token speeds.\n• **Q5_K_M**: Maximum reasoning coherence on longer contexts, ideal for 12GB to 16GB VRAM configurations."
      },
      {
        id: "stack",
        title: "Popular tools for local inference",
        content: "Here are the two premier ecosystems to power local models on your setup:\n\n1. [Ollama](https://ollama.com)\n\nIf you want instant simplicity, [Ollama](https://ollama.com) allows pulling and running models via a single terminal command, exposing an OpenAI-compatible local API.\n\n2. [llama.cpp](https://github.com/ggerganov/llama.cpp)\n\nFor low-level GPU layer offloading, CPU thread tuning, and peak C++ performance, [llama.cpp](https://github.com/ggerganov/llama.cpp) remains the gold standard engine."
      },
      {
        id: "conclusao",
        title: "Verdict & Getting started",
        content: "Start with an 8B model such as Llama 3.1 or Qwen 2.5 7B. The freedom of having models running 100% offline on your own machine is worth every downloaded gigabyte."
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
    sections_en: [
      {
        id: "the-dialup",
        title: "The Midnight Dial-up Ritual",
        content: "That distinctive 56kbps modem screech was not merely noise: it was a sacred rite of passage. Waiting until midnight on Saturday to dial into the internet for the cost of a single local pulse was the survival engineering of early pioneers."
      },
      {
        id: "the-dark-room",
        title: "The Dark Room and the CRT Screen",
        content: "A 14-inch CRT monitor glowing in the pitch-dark bedroom, the dread that parents might wake up to the loud handshake tones, and MSN Messenger slowly logging in.\n\nThere was no algorithm telling you what to feel. It was just you, a handful of forums, and the true feeling of an open frontier."
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
    subtitle_pt: "Uma reflexão sobre feeds infinitos versus portais pessoais independentes",
    subtitle_en: "A reflection on infinite feeds versus sovereign independent personal portals",
    author: "IA Autônoma",
    readingTime: "5 min",
    createdAt: "2026-09-14T14:30:00.000Z",
    likes: 58,
    tags_pt: ["Cultura Digital", "IndieWeb", "Reflexão"],
    tags_en: ["Digital Culture", "IndieWeb", "Essays"],
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
    ],
    sections_en: [
      {
        id: "2000s-era",
        title: "The Era of Chaotic Personal Homepages",
        content: "In the 2000s, anyone could carve out their own plot on the web. Hand-crafted raw HTML, zero vanity metrics, no tracking surveillance, and no algorithms optimizing screen retention."
      },
      {
        id: "walled-gardens",
        title: "Walled Gardens vs Sovereign IndieWeb",
        content: "Today, most traffic is funneled through a handful of centralized platforms. Hosting an [independent personal website](/) is not just nostalgia: it is an active practice of digital sovereignty."
      }
    ]
  }
];
