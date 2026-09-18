export const frutaQuiz = {
  id: 'qual-fruta-voce-seria',
  title: 'Qual fruta você seria?',
  subtitle: 'Um raio-x botânico do seu temperamento: casca dura, polpa doce ou acidez que salva o dia.',
  badge: 'Personalidade & Natureza',
  icon: 'Apple',
  disclaimer: 'Zero calorias, 100% autoconhecimento vitamínico e reflexões da feira livre.',
  profiles: {
    'abacaxi': {
      name: 'Abacaxi',
      subtitle: 'A Majestade de Casca Espinhosa',
      description: 'Você não se abre pra qualquer um. Tem uma coroa de respeito e uma carcaça que assusta os despreparados. Mas quem investe tempo descobrindo sua essência encontra um coração doce e vibrante.',
      traits: ['Casca grossa', 'Coroa natural', 'Doce por dentro', 'Seletivo'],
      quote: 'Não sou difícil de lidar, sou apenas uma fruta que exige respeito ao ser descascada.'
    },
    'melancia': {
      name: 'Melancia',
      subtitle: 'O Coração Gigante da Festa',
      description: 'Você é pura generosidade e energia refrescante. Quando você chega, tem espaço pra todo mundo se alimentar do seu bom humor. Ocupa espaço, faz barulho bom e alegra os dias quentes.',
      traits: ['Acolhedor', 'Espaçoso', 'Refrescante', 'Inimigo da tristeza'],
      quote: 'Onde come um, comem dez — contanto que a gente divida as fatias rindo.'
    },
    'limao-tahiti': {
      name: 'Limão Tahiti',
      subtitle: 'A Acidez Essencial da Vida',
      description: 'Você tem a língua afiada e uma perspicácia cirúrgica. Puro, você pode assustar pelo excesso de sinceridade, mas sem a sua presença qualquer grupo ou projeto fica sem tempero e sem graça.',
      traits: ['Sincero', 'Ácido', 'Essencial', 'Anti-clichê'],
      quote: 'Se a vida me der limões, eu espremo na ferida de quem inventou conversa fiada.'
    },
    'banana-prata': {
      name: 'Banana Prata',
      subtitle: 'O Alicerce da Paz & Eficiência',
      description: 'Você é o amigo que todo mundo precisa ter por perto. Não faz drama, é fácil de conviver, vem embalado naturalmente e segura a onda de qualquer perrengue com serenidade inabalável.',
      traits: ['Prático', 'Confiável', 'Zero drama', 'Sustenta o time'],
      quote: 'Pra que complicar o que a natureza já fez pronto pra descascar e comer?'
    }
  },
  questions: [
    {
      id: 1,
      text: 'Como você reage quando uma pessoa desconhecida é íntima demais logo de cara?',
      options: [
        { text: 'Levanto minha coroa, fico na defensiva e mantenho espinhos visíveis até avaliar o terreno.', profile: 'abacaxi' },
        { text: 'Já abro um sorriso de orelha a orelha e puxo assunto como se fôssemos primos de infância.', profile: 'melancia' },
        { text: 'Mando uma resposta tão seca e ácida que a pessoa recalcula a rota imediatamente.', profile: 'limao-tahiti' },
        { text: 'Sou educado, acolhedor e sigo a conversa sem esquentar a cabeça com frescura.', profile: 'banana-prata' }
      ]
    },
    {
      id: 2,
      text: 'Qual é o seu papel natural quando o grupo precisa resolver uma crise?',
      options: [
        { text: 'Dou a segurança básica e prática para o time não desmoronar de fome e cansaço.', profile: 'banana-prata' },
        { text: 'Mando a real sem rodeios, apontando o erro óbvio que todo mundo finge não ver.', profile: 'limao-tahiti' },
        { text: 'Assumo a liderança com postura imponente e ninguém ousa questionar.', profile: 'abacaxi' },
        { text: 'Trago todo mundo pra perto, amenizo o clima pesado com carinho e bom humor.', profile: 'melancia' }
      ]
    },
    {
      id: 3,
      text: 'Qual é a sua vibe ideal para uma sexta-feira à noite?',
      options: [
        { text: 'Uma roda grande com os amigos rindo alto, beliscando e contando piada até tarde.', profile: 'melancia' },
        { text: 'Em casa, tranquilo, descansando com um lanche simples e paz no coração.', profile: 'banana-prata' },
        { text: 'Um drink bem ácido e marcante num lugar onde eu possa julgar as pessoas em silêncio.', profile: 'limao-tahiti' },
        { text: 'Um jantar reservado, sofisticado, apenas com pessoas selecionadas a dedo.', profile: 'abacaxi' }
      ]
    },
    {
      id: 4,
      text: 'Se você fosse definir sua sinceridade em uma frase:',
      options: [
        { text: 'Dura por fora, mas cheia de carinho por quem merece.', profile: 'abacaxi' },
        { text: 'Agradável e leve: se a verdade for doer, a gente adorna com um abraço.', profile: 'melancia' },
        { text: 'Ácida, direta e sem anestesia. A verdade dói só nos primeiros três segundos.', profile: 'limao-tahiti' },
        { text: 'Simples e direta: não invento mistério nem fofoca.', profile: 'banana-prata' }
      ]
    },
    {
      id: 5,
      text: 'O que mais te irrita nas pessoas ao seu redor?',
      options: [
        { text: 'Pessoas sem personalidade, mornas e sem tempero algum.', profile: 'limao-tahiti' },
        { text: 'Falta de respeito com meu espaço pessoal e meus limites.', profile: 'abacaxi' },
        { text: 'Gente dramática que complica tarefas básicas do dia a dia.', profile: 'banana-prata' },
        { text: 'Pessoas amargas, individualistas e que não sabem compartilhar momentos.', profile: 'melancia' }
      ]
    },
    {
      id: 6,
      text: 'Se você pudesse escolher seu elogio favorito:',
      options: [
        { text: 'Você tem uma presença única e inconfundível.', profile: 'abacaxi' },
        { text: 'Você é a alma da festa e melhora o dia de qualquer um.', profile: 'melancia' },
        { text: 'Você é a pessoa mais lúcida e inteligente que eu conheço.', profile: 'limao-tahiti' },
        { text: 'Você é meu porto seguro, nunca me deixa na mão.', profile: 'banana-prata' }
      ]
    }
  ]
};
