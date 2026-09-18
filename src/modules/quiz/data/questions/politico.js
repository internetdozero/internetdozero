export const politicoQuiz = {
  id: 'que-tipo-de-politico-voce-seria',
  title: 'Que tipo de político você seria?',
  subtitle: 'Um raio-x satírico da política brasileira para descobrir qual arquétipo do poder mora em você.',
  badge: 'Sátira Política',
  icon: 'Landmark',
  tieBreakerSubtitle: 'A Coalizão dos Opostos (Empate Técnico)',
  tieBreakerQuote: (p1, p2) => `50% ${p1.name}, 50% ${p2.name}: a verdadeira harmonia republicana onde todo mundo sai contemplado.`,
  profiles: {
    'servidor-cansado': {
      name: 'O Servidor Efetivo Cansado',
      subtitle: 'O Mestre da Paz & do Bolo na Copa',
      description: 'Você passou no concurso em 2008 e seu único objetivo de vida é cumprir o expediente, comer um pedaço de bolo com café às 15h30 e não se meter na guerra dos comissionados. Não quer saber quem ganhou a eleição nem quem vai discursar, contanto que o vale caia no dia 1º e ninguém encha seu saco.',
      why: 'Você busca estabilidade e paz interior acima de vaidades passageiras: foca no seu trabalho, odeia inventação de moda e preza pelo café sagrado.',
      traits: ['Só quer bater o ponto', 'Amigo do cafezinho', 'Foge de comissão', 'Paz acima de tudo'],
      quote: 'Seja lá o que vocês forem inventar de projeto, por favor não me peçam pra abrir processo novo.'
    },
    'centrao-elegante': {
      name: 'O Articulador do Centrão',
      subtitle: 'O Mestre da Governabilidade & Jantar Sigiloso',
      description: 'Voz mansa, terno sob medida e mensagens temporárias no WhatsApp. Você nunca levanta o tom de voz, chama qualquer lobby de "harmonia republicana" e sabe exatamente onde estão todos os recursos sem colocar a sua assinatura em uma única folha comprometedora.',
      why: 'Você entende que a política é a arte da negociação e do pragmatismo: resolve conflitos nos bastidores com conversa suave e foco no resultado.',
      traits: ['Mensagem temporária', 'Voz aveludada', 'Jantar sigiloso', 'Sempre na base aliada'],
      quote: 'Não se trata de interesse pessoal, nobres colegas... trata-se da estabilidade e governabilidade.'
    },
    'indignado-tiktok': {
      name: 'O Deputado de TikTok',
      subtitle: 'O Rei do Reels & da Indignação Seletiva',
      description: 'Você chega na reunião já apontando a câmera do celular, faz cara de choque e grita que o sistema tem medo da sua coragem. Vive de corte de podcast, indireta pra bancada rival e engajamento. A verdade pouco importa, o que vale é a visualização nos primeiros três segundos.',
      why: 'Você tem talento natural para mobilizar emoções e capturar atenção em massa: sabe que narrativa e corte de impacto valem mais que mil relatórios.',
      traits: ['Celular na vertical', 'Grita no microfone', 'Corte de podcast', 'Indignação lucrativa'],
      quote: 'Vocês viram isso aqui, meu povo? Eles não querem que você saiba a verdade! Compartilhem antes que derrubem!'
    },
    'coronel-interior': {
      name: 'O Coronel Tradicional',
      subtitle: 'O Pai dos Pobres & do Churrasco',
      description: 'Sabe o nome da avó de cada morador do município, distribui abraço com tapinha nas costas, come pastel com caldo de cana na feira e jura de pés juntos que é amigo do povo. Não entende nada de planilha nem de lei, mas ganha qualquer eleição no carisma e na base da amizade.',
      why: 'Você valoriza a presença física, o calor humano e a lealdade cara a cara: resolve qualquer atrito no aperto de mão e no carisma popular.',
      traits: ['Tapinha nas costas', 'Pastel na feira', 'Amigo de todo mundo', 'Promete até chuva'],
      quote: 'Aqui quem fala é o coração, minha gente! Podem contar com o amigo de vocês pra qualquer perrengue.'
    },
    'faria-limer': {
      name: 'O Tecnocrata do Excel',
      subtitle: 'O Faria Limer da Gestão Pública',
      description: 'Usa termos em inglês numa audiência sobre buraco na rua, veste colete térmico no calor de 32 graus e jura que um dashboard interativo vai resolver o problema da saúde. Acha que a repartição pública tem que virar uma startup unicórnio com metas de sprint quinzenais.',
      why: 'Você acredita piamente em métricas, indicadores de performance e processos otimizados: quer transformar o caos orgânico em um dashboard limpo.',
      traits: ['Colete puffer', 'Termos em inglês', 'Planilha com gráficos', 'Quer privatizar a calçada'],
      quote: 'Precisamos pivotar o mindset da gestão e aplicar um benchmark ágil no orçamento público.'
    }
  },
  questions: [
    {
      id: 1,
      text: 'Primeiro dia oficial do seu mandato. Qual é a sua prioridade absoluta?',
      options: [
        { text: 'Descobrir onde fica a melhor cafeteira do prédio e garantir que ninguém mude o horário do meu almoço.', profile: 'servidor-cansado' },
        { text: 'Marcar um almoço discreto num restaurante caro de frutos do mar com as lideranças da mesa.', profile: 'centrao-elegante' },
        { text: 'Gravar um vídeo indignado na porta do plenário com cara de bravo prometendo quebrar o sistema.', profile: 'indignado-tiktok' },
        { text: 'Mandar distribuir salgadinho e refrigerante pra quem veio da minha cidade me prestigiar na posse.', profile: 'coronel-interior' },
        { text: 'Apresentar uma apresentação de slides em inglês com 40 gráficos propondo cortar gastos operacionais.', profile: 'faria-limer' }
      ]
    },
    {
      id: 2,
      text: 'Um repórter investigativo te aborda no corredor com uma pergunta desconfortável. Você:',
      options: [
        { text: 'Falo "rapaz, eu sou só o servidor que carrega a pasta, pergunta ali pro comissionado" e saio andando.', profile: 'servidor-cansado' },
        { text: 'Sorrio com calma, digo que respeito a liberdade de imprensa e entro no elevador privativo blindado.', profile: 'centrao-elegante' },
        { text: 'Pego meu próprio celular, filmo o repórter e grito que a mídia tradicional está tentando me censurar.', profile: 'indignado-tiktok' },
        { text: 'Puxo o repórter pro abraço, chamo pelo apelido e convido pra tomar um café na minha cidade natal.', profile: 'coronel-interior' },
        { text: 'Peço pra ele checar os números no portal da transparência porque os dados são autoexplicativos.', profile: 'faria-limer' }
      ]
    },
    {
      id: 3,
      text: 'Você tem uma verba expressiva para destinar para a sua região. O que faz?',
      options: [
        { text: 'Destino pro básico que já tá no sistema pra não me darem trabalho extra de prestação de contas.', profile: 'servidor-cansado' },
        { text: 'Articulo um consórcio regional muito bem alinhado com empresas parceiras de total confiança.', profile: 'centrao-elegante' },
        { text: 'Mando colocar outdoors gigantes com a minha cara anunciando a maior verba da história do universo.', profile: 'indignado-tiktok' },
        { text: 'Mando asfaltar a estrada que passa na porta dos meus amigos e inauguro com churrasco comunitário.', profile: 'coronel-interior' },
        { text: 'Lanço um aplicativo mobile com blockchain e inteligência artificial pra modernizar os semáforos.', profile: 'faria-limer' }
      ]
    },
    {
      id: 4,
      text: 'Como você se comporta durante uma votação tensa e demorada no plenário?',
      options: [
        { text: 'Fico no cantinho lendo notícia no celular, torcendo pro quórum fechar logo pra eu ir pra casa.', profile: 'servidor-cansado' },
        { text: 'Circulo discretamente conversando no ouvido de quatro pessoas e fecho o acordo na última curva.', profile: 'centrao-elegante' },
        { text: 'Fico berrando no microfone, gesticulando pra câmera e mandando print pro grupo de transmissão.', profile: 'indignado-tiktok' },
        { text: 'Voto com a bancada do meu amigo presidente e aproveito pra marcar um churrasco no fim de semana.', profile: 'coronel-interior' },
        { text: 'Abro o notebook com uma planilha cheia de macros para calcular o impacto fiscal de cada emenda.', profile: 'faria-limer' }
      ]
    },
    {
      id: 5,
      text: 'Qual é o seu combustível emocional em ano de campanha eleitoral?',
      options: [
        { text: 'O desespero de saber que os comissionados vão mudar e eu vou ter que aturar chefe novo.', profile: 'servidor-cansado' },
        { text: 'O xadrez silencioso de garantir que, vença quem vencer, eu continuarei no centro do poder.', profile: 'centrao-elegante' },
        { text: 'A adrenalina de ganhar 100 mil seguidores na semana prometendo prender todo mundo.', profile: 'indignado-tiktok' },
        { text: 'O calor humano do povo na rua cantando meu jingle e balançando bandeira no caminhão.', profile: 'coronel-interior' },
        { text: 'Apresentar meu plano de governo elaborado por consultorias internacionais com metas de produtividade.', profile: 'faria-limer' }
      ]
    },
    {
      id: 6,
      text: 'Qual legado você quer deixar quando sua trajetória na vida pública terminar?',
      options: [
        { text: 'Uma folha de ponto perfeitamente preenchida e uma aposentadoria tranquila sem processo na justiça.', profile: 'servidor-cansado' },
        { text: 'Um patrimônio respeitável, as pessoas certas na minha lista de contatos e a ficha totalmente limpa.', profile: 'centrao-elegante' },
        { text: 'Milhões de inscritos no YouTube e a fama de ter sido o mais polêmico e destemido do país.', profile: 'indignado-tiktok' },
        { text: 'Um viaduto, uma praça e um estádio municipal com o meu sobrenome pra família lembrar com orgulho.', profile: 'coronel-interior' },
        { text: 'Ter trazido o modelo de governança corporativa de Wall Street para a câmara municipal.', profile: 'faria-limer' }
      ]
    }
  ]
};
