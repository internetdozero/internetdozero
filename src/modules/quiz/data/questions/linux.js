export const linuxQuiz = {
  id: 'qual-distro-linux-e-a-sua-cara',
  title: 'Qual distro Linux é a sua cara?',
  subtitle: 'Um teste comportamental do cotidiano para descobrir qual filosofia de sistema vive na sua alma.',
  badge: 'Tecnologia & Hábitos',
  icon: 'Terminal',
  tieBreakerSubtitle: 'O Híbrido Inesperado (Empate Técnico)',
  tieBreakerQuote: (p1, p2) => `50% ${p1.name}, 50% ${p2.name}: dual-boot na mente e paz de espírito no coração.`,
  profiles: {
    'arch': {
      name: 'Arch Linux',
      subtitle: 'O Automatizador Implacável',
      description: 'Você odeia intermediários, burocracia e ter que fazer a mesma coisa duas vezes na mão. Se uma tarefa é repetitiva, você gasta meia hora criando uma automação ou atalho esperto pra nunca mais ter que clicar naquilo na vida. Seu ambiente é enxuto, direto ao ponto e não tem um byte de gordura inútil.',
      why: 'Você busca eliminar atrito e odeia esforço repetitivo: prefere automatizar logo o fluxo pra não ter que fazer na mão nunca mais.',
      traits: ['Automação pura', 'Odeia bloatware', 'Corta todo atrito', 'Direto ao ponto'],
      quote: 'Se eu tiver que dar mais de dois cliques pra fazer isso de novo, eu crio um script agora.'
    },
    'debian': {
      name: 'Debian Stable',
      subtitle: 'A Rocha Inabalável da Paz Zen',
      description: 'Você descobriu o segredo da longevidade: não mexer no que está funcionando. Seus métodos, ferramentas e rotinas foram testados pelo tempo. Você dorme com a tranquilidade absoluta de quem sabe que o seu ambiente nunca vai quebrar do nada na sexta-feira.',
      why: 'Você prioriza estabilidade máxima e paz de espírito: sua regra de ouro é nunca mexer no que já está funcionando.',
      traits: ['Paz de espírito', 'Zero sustos', 'Não mexe no que tá bom', 'À prova de apocalipse'],
      quote: 'Novidade demais é sinônimo de bug novo. Fico com o clássico que nunca me deixou na mão.'
    },
    'ubuntu': {
      name: 'Ubuntu',
      subtitle: 'O Pragmático do Padrão de Fábrica',
      description: 'Você tem mais o que fazer na vida do que ficar filosofando sobre como a ferramenta funciona por baixo do capô. Quer plugar, ver rodando de primeira e focar no que realmente interessa. Se a maioria das pessoas usa e qualquer dúvida tem resposta pronta no Google, você tá no céu.',
      why: 'Você foca na entrega e na compatibilidade: quer soluções padronizadas que funcionem de primeira sem reinventar a roda.',
      traits: ['Pragmático', 'Padrão de fábrica', 'Sem tempo a perder', 'Foco na entrega'],
      quote: 'Eu não quero reinventar a roda, só quero que ela gire pra eu chegar onde preciso.'
    },
    'fedora': {
      name: 'Fedora',
      subtitle: 'O Vanguarda Polido da Indústria',
      description: 'Você gosta de tecnologia moderna, limpa e bem acabada. Não quer gambiarra improvisada, mas também tem pavor de ficar preso no passado. Quer o que há de mais recente, com padrão de qualidade e aprovado pelas boas práticas corporativas.',
      why: 'Você gosta de tecnologias modernas e recursos recentes, com acabamento refinado e padrão de engenharia corporativa.',
      traits: ['Moderno e polido', 'Padrões da indústria', 'Sempre atualizado', 'Elegante'],
      quote: 'Dá pra ter tecnologia de ponta com estabilidade e elegância, sem precisar apelar pra gambiarra.'
    },
    'linux-mint': {
      name: 'Linux Mint',
      subtitle: 'O Café com Leite do Conforto',
      description: 'Você gosta de acolhimento, usabilidade clássica e odeia quando inventam moda com menus esquisitos. Quer o bom e velho menuIniciar no cantinho, ícones claros e a sensação gostosa de que a tecnologia tá ali pra te servir sem cobrar taxa de aprendizado.',
      why: 'Você preza pela tranquilidade e usabilidade sem atritos: o computador tem que te servir com conforto e simplicidade.',
      traits: ['Conforto clássico', 'Amigável', 'Zero frescura', 'Sem estresse'],
      quote: 'Computador bom é aquele que a minha vó e eu usamos sem precisar ler manual.'
    },
    'gentoo': {
      name: 'Gentoo',
      subtitle: 'O Alquimista dos Detalhes Extremos',
      description: 'Você não aceita nada genérico feito pra massa. Quer entender cada milissegundo de execução, cada ingrediente da receita e ajustar a voltagem de cada parâmetro na unha. Seus amigos acham que você é louco, mas seu orgulho de construir tudo da raiz é imbatível.',
      why: 'Você quer entender cada engrenagem da raiz até o topo e otimizar cada detalhe no seu ritmo, sem aceitar pacotes genéricos.',
      traits: ['Perfeccionismo radical', 'Otimização ao extremo', 'Entende tudo da raiz', 'Paciência infinita'],
      quote: 'Se vem pré-compilado pros outros, não foi otimizado pro meu silício.'
    },
    'nixos': {
      name: 'NixOS',
      subtitle: 'O Cérebro Galáctico da Imutabilidade',
      description: 'Sua vida é organizada em arquivos declarativos. Se o mundo explodir, você roda uma função pura e reconstrói o cosmos no mesmo estado imutável. Tem pavor de desordem e ama saber que nada no seu universo pode sair do trilho sem aviso.',
      why: 'Você ama determinismo e controle declarativo: se um estado não pode ser reproduzido com perfeição matemática, você não confia.',
      traits: ['Imutável', 'Reprodutível', 'Mente matemática', 'Zero acasos'],
      quote: 'O acaso não existe. Tudo no universo deveria ser uma função pura determinística.'
    },
    'kali': {
      name: 'Kali Linux',
      subtitle: 'O Mr. Robot de Condomínio',
      description: 'Você adora um mistério, um capuz preto no quarto escuro e a sensação de estar sempre dois passos à frente de todo mundo. Desconfia de Wi-Fi público, checa permissões de aplicativo como quem desarma bomba e tem prazer em encontrar brechas que ninguém viu.',
      why: 'Você tem olhar investigativo e audita tudo ao redor: adora encontrar brechas, brecar vulnerabilidades e se antecipar.',
      traits: ['Capuz preto', 'Desconfiado', 'Caçador de brechas', 'Vibe hacker'],
      quote: 'Não existe sistema 100% seguro, só gente que ainda não foi auditada por mim.'
    }
  },
  tieBreakers: {
    'arch+debian': {
      name: 'DebiArch',
      subtitle: 'O Paradoxo Quântico da Informática',
      description: 'Você é um milagre da contradição humana: você automatiza tudo com scripts de ponta pra não dar um clique a mais, mas reza fervorosamente pra nunca mais precisar mexer naquilo pelos próximos cinco anos! Um pé na vanguarda veloz e outro na paz de espírito absoluta.',
      traits: ['Automatiza na vanguarda', 'Reza pela estabilidade', 'Mente de Arch', 'Coração de Debian'],
      quote: 'Eu crio o script mais moderno do mundo justamente pra poder ficar 3 anos sem encostar nele.'
    },
    'arch+gentoo': {
      name: 'O Engenheiro Supremo da Otimização',
      subtitle: 'Corta Todo Atrito & Otimiza Cada Átomo',
      description: 'Nenhum software no seu computador roda sem que você tenha eliminado até o último ciclo de clock inútil. Você junta o amor de automatizar tudo do Arch com o perfeccionismo cirúrgico do Gentoo.',
      traits: ['Zero bloat', 'Otimização atômica', 'Automação extrema', 'Poder puro'],
      quote: 'Se o sistema demorar mais de 0.2 segundos pra abrir, eu refaço o script do zero.'
    },
    'ubuntu+linux-mint': {
      name: 'O Mestre da Sabedoria Prática',
      subtitle: 'Paz, Produtividade & Café Quentinho',
      description: 'Você atingiu o nirvana digital: não tem tempo pra picuinha de nerd, quer as coisas funcionando num clique e gasta sua energia produzindo de verdade na vida real enquanto os outros brigam por gerenciador de janelas.',
      traits: ['Produtividade pura', 'Zero ego', 'Vida prática', 'Café tranquilo'],
      quote: 'A melhor ferramenta é aquela que você esquece que existe enquanto tá usando.'
    },
    'arch+kali': {
      name: 'O Mago da Segurança Ágil',
      subtitle: 'Terminal Preto, Automação & Olho Clínico',
      description: 'Você junta a agilidade de quem automatiza tudo num piscar de olhos com a desconfiança investigativa de quem sabe exatamente onde estão as falhas do sistema alheio. Rápido, letal e silencioso.',
      traits: ['Olho clínico', 'Atalho veloz', 'Radar de segurança', 'Foco cirúrgico'],
      quote: 'Eu automatizei a auditoria pra achar a brecha antes do café esfriar.'
    }
  },
  questions: [
    {
      id: 1,
      text: 'Você percebe que faz a mesma tarefa repetitiva no computador ou celular todo santo dia. O que você faz?',
      options: [
        { text: 'Gasto um tempo criando um script, atalho ou fluxo automatizado pra resolver com uma tecla só.', profiles: ['arch', 'nixos'] },
        { text: 'Continuo fazendo do jeito normal que sempre fiz. Já virou hábito automático e não me atrapalha.', profiles: ['debian', 'linux-mint'] },
        { text: 'Procuro na loja de apps ou no Google uma extensão/app pronto que resolva isso num clique.', profiles: ['ubuntu', 'linux-mint'] },
        { text: 'Analiso a fundo por que o sistema me obriga a fazer isso e tento reprogramar a raiz do fluxo.', profiles: ['gentoo', 'kali'] }
      ]
    },
    {
      id: 2,
      text: 'Seu aparelho ou computador novo acabou de sair da caixa. Qual é a sua primeira providência?',
      options: [
        { text: 'Faço uma limpa geral: desinstalo todas as tranqueiras e apps de fábrica antes de começar.', profiles: ['arch', 'gentoo'] },
        { text: 'Faço login nas minhas contas, instalo o básico do dia a dia e começo a usar sem frescura.', profiles: ['ubuntu', 'linux-mint'] },
        { text: 'Passo um pente fino nas permissões, desativo localização e bloqueio telemetrias invasivas.', profiles: ['kali', 'nixos'] },
        { text: 'Restauro o mesmo backup estável de sempre pra deixar tudo exatamente como era no antigo.', profiles: ['debian', 'fedora'] }
      ]
    },
    {
      id: 3,
      text: 'Você precisa resolver um perrengue urgente no trabalho. Qual é a sua postura?',
      options: [
        { text: 'Vou pela linha mais reta e rápida possível: sem intermediário, sem reunião e sem firula.', profiles: ['arch', 'ubuntu'] },
        { text: 'Uso a solução clássica homologada que sempre funcionou. Pode demorar mais, mas a certeza é total.', profiles: ['debian', 'fedora'] },
        { text: 'Desmonto o problema peça por peça até entender o motivo exato de ter dado errado antes de corrigir.', profiles: ['gentoo', 'nixos'] },
        { text: 'Procuro logo a falha de segurança ou o erro de configuração que causou o estrago.', profiles: ['kali', 'arch'] }
      ]
    },
    {
      id: 4,
      text: 'Qual é o seu nível de paciência com coisas lentas ou cheias de cliques desnecessários?',
      options: [
        { text: 'Zero. Me dá agonia física ver gente dando 8 cliques pra fazer uma coisa que um atalho resolve.', profiles: ['arch', 'gentoo'] },
        { text: 'Totalmente zen. Se o negócio é confiável e não cai, demorar alguns segundos a mais não me estressa.', profiles: ['debian', 'linux-mint'] },
        { text: 'Se a interface for amigável e intuitiva, não me importo de dar uns cliques a mais pelo conforto.', profiles: ['linux-mint', 'ubuntu'] },
        { text: 'Se o processo estiver devidamente padronizado e documentado dentro das normas, sigo o fluxo.', profiles: ['fedora', 'nixos'] }
      ]
    },
    {
      id: 5,
      text: 'Sexta-feira, 17h45. Aparece um aviso de atualização grande de sistema. Você:',
      options: [
        { text: 'Nem olho. Atualizar em dia útil é pedir pra arrumar sarna pra se coçar; minha paz não tem preço.', profiles: ['debian', 'linux-mint'] },
        { text: 'Atualizo na hora, confiro os logs e se tiver qualquer detalhe eu ajusto meu fluxo em dois minutos.', profiles: ['arch', 'gentoo'] },
        { text: 'Clico em "lembrar semana que vem" e vou sextar com os amigos sem pensar em computador.', profiles: ['ubuntu', 'linux-mint'] },
        { text: 'Leio o relatório de segurança e as notas da versão antes de autorizar qualquer mudança.', profiles: ['kali', 'fedora'] }
      ]
    },
    {
      id: 6,
      text: 'O que é "eficiência" pra você na vida real?',
      options: [
        { text: 'Cortar todo atrito inútil: ter tudo automatizado, veloz, sem intermediários e sem gordura.', profiles: ['arch', 'nixos'] },
        { text: 'Previsibilidade: ter a tranquilidade de saber que o que foi montado hoje vai durar anos.', profiles: ['debian', 'fedora'] },
        { text: 'Facilidade: gastar o mínimo de neurônio com ferramentas pra poder focar no que dá resultado.', profiles: ['ubuntu', 'linux-mint'] },
        { text: 'Controle total: saber exatamente cada detalhe do que tá rodando sem caixas pretas.', profiles: ['gentoo', 'kali'] }
      ]
    }
  ]
};
