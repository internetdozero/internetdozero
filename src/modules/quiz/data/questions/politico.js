export const politicoQuiz = {
  id: 'que-tipo-de-politico-voce-seria',
  title: 'Que tipo de político você seria?',
  subtitle: 'Um teste de alta voltagem cômica para descobrir o seu arquétipo nos corredores do poder.',
  badge: 'Sátira & Brasília',
  icon: 'Landmark',
  disclaimer: 'Qualquer semelhança com sessões do plenário, emendas secretas ou discursos inflamados é mera coincidência caricata.',
  profiles: {
    'corrupto-elegante': {
      name: 'O Articulador de Colarinho Branco',
      subtitle: 'Elegância, Jantar Caro & Diálogo Institucional',
      description: 'Você nunca levanta a voz e jamais assina documentos comprometedores na primeira via. Opera com mensagens temporárias, sabe quem são os donos de todos os cartórios e chama qualquer lobby de "harmonia republicana".',
      traits: ['Voz aveludada', 'Terno sob medida', 'Jantares sigilosos', 'Nunca viu nada'],
      quote: 'Não se trata de interesse próprio, mas da estabilidade e governabilidade da nação.'
    },
    'populista-palanque': {
      name: 'O Falastrão de Palanque',
      subtitle: 'Abraço em Feira Livre & Promessas Divinas',
      description: 'Microfone na mão, camisa amassada e saliva no ar. Você promete ponte onde não tem rio, chora lembrando da infância difícil e posta vídeo indignado no almoço. O povo te ama porque você fala o que dá na telha.',
      traits: ['Garganta de ouro', 'Vídeos inflamados', 'Choro ensaiado', 'Promete o impossível'],
      quote: 'Eu vim de baixo, meu povo! Eles lá em cima têm medo da nossa voz!'
    },
    'parasita-baixo-clero': {
      name: 'O Fantasma do Baixo Clero',
      subtitle: 'Presente no Café, Invisível no Plenário',
      description: 'Ninguém sabe exatamente o que você defende nem qual foi o último projeto que apresentou, mas seu gabinete emprega metade dos primos da sua cidade natal. Você só vota com a maioria e garante o cafezinho.',
      traits: ['Invisibilidade tática', 'Vota com a manada', 'Bate o ponto na quarta', 'Parente nomeado'],
      quote: 'Em briga de cacique, o cupim sobrevive comendo a madeira do plenário.'
    },
    'idealista-ingenuo': {
      name: 'O Idealista Incorruptível',
      subtitle: 'Lê a Constituição & Chora no Gabinete',
      description: 'Você entrou na política achando que ia reformar a galáxia com argumentos técnicos e planilhas éticas. No primeiro dia descobre que seu projeto de lei foi trocado por um asfaltamento de beco.',
      traits: ['Puro coração', 'Iludido pela ética', 'Estuda os regimentos', 'Derrotado por 99 a 1'],
      quote: 'Mas companheiros... o artigo 5º da Carta Magna estabelece claramente o interesse público!'
    }
  },
  questions: [
    {
      id: 1,
      text: 'Como você prepara o seu primeiro dia de mandato?',
      options: [
        { text: 'Gravo uma live indignado na porta do prédio prometendo cortar todos os privilégios.', profile: 'populista-palanque' },
        { text: 'Marco um almoço discreto num restaurante de frutos do mar com as lideranças do orçamento.', profile: 'corrupto-elegante' },
        { text: 'Descubro onde fica o melhor café, quem controla o cafezinho e garanto uma cadeira no fundão.', profile: 'parasita-baixo-clero' },
        { text: 'Chego às 7h com três pastas de propostas legislativas revisadas por juristas alemães.', profile: 'idealista-ingenuo' }
      ]
    },
    {
      id: 2,
      text: 'Um repórter investigativo te para no corredor com uma pergunta capciosa. Sua resposta:',
      options: [
        { text: 'Apresento 15 certidões negativas e explico a lisura do processo durante duas horas.', profile: 'idealista-ingenuo' },
        { text: 'Olho pra câmera, aponto o dedo e digo que a imprensa comprada persegue o trabalhador.', profile: 'populista-palanque' },
        { text: 'Sorrio cordialmente, digo que respeito o papel da imprensa e entro no elevador privativo.', profile: 'corrupto-elegante' },
        { text: 'Coloco o celular no ouvido fingindo atender uma ligação de urgência e ando rápido.', profile: 'parasita-baixo-clero' }
      ]
    },
    {
      id: 3,
      text: 'Você tem uma verba orçamentária expressiva para destinar. O que faz?',
      options: [
        { text: 'Destino 100% para um hospital modelo sem desvio e fiscalizo os recibos pessoalmente.', profile: 'idealista-ingenuo' },
        { text: 'Mando fazer uma praça gigante com meu nome quase disfarçado numa placa de bronze.', profile: 'populista-palanque' },
        { text: 'Articulo um consórcio de municípios parceiros com fornecedores muito bem recomendados.', profile: 'corrupto-elegante' },
        { text: 'Mando asfaltar a rua da fazenda do meu cunhado e digo que é rota de escoamento rural.', profile: 'parasita-baixo-clero' }
      ]
    },
    {
      id: 4,
      text: 'Qual é a sua moeda de troca favorita em uma negociação de votação?',
      options: [
        { text: 'Cargos estratégicos em estatais e emendas de relator sem carimbo nominal.', profile: 'corrupto-elegante' },
        { text: 'Voto no que me mandarem, contanto que ninguém tire o meu gabinete e meu carro oficial.', profile: 'parasita-baixo-clero' },
        { text: 'Um palanque garantido no próximo ano e apoio explícito nos carros de som locais.', profile: 'populista-palanque' },
        { text: 'Eu não negocio princípios! O bem comum não tem preço!', profile: 'idealista-ingenuo' }
      ]
    },
    {
      id: 5,
      text: 'Chegou o período eleitoral. Qual é a sua estratégia principal de campanha?',
      options: [
        { text: 'Comer pastel na feira com pinga de cana, abraçar velhinhas e beijar criancinha.', profile: 'populista-palanque' },
        { text: 'Garantir o apoio dos 12 prefeitos da região e operar as bases com tranquilidade.', profile: 'corrupto-elegante' },
        { text: 'Pegar carona na coligação do candidato forte e torcer pelo quociente eleitoral.', profile: 'parasita-baixo-clero' },
        { text: 'Distribuir panfletos de 10 páginas com meu plano de governo detalhado em tópicos.', profile: 'idealista-ingenuo' }
      ]
    },
    {
      id: 6,
      text: 'Quando o mandato terminar, qual legado você espera deixar?',
      options: [
        { text: 'A certeza de que lutei pelo povo e a oposição morre de inveja do meu carisma.', profile: 'populista-palanque' },
        { text: 'Um patrimônio imobiliário blindado e o respeito das pessoas certas nos bastidores.', profile: 'corrupto-elegante' },
        { text: 'Aposentadoria especial parlamentar e uma pensão vitalícia sem dores de cabeça.', profile: 'parasita-baixo-clero' },
        { text: 'A consciência limpa de quem não se vendeu, mesmo voltando a pé pra casa de ônibus.', profile: 'idealista-ingenuo' }
      ]
    }
  ]
};
