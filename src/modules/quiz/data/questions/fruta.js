export const frutaQuiz = {
  id: 'qual-fruta-voce-seria',
  title: 'Qual fruta você seria?',
  subtitle: 'Um raio-x do seu comportamento em festas, crises e amizades traduzido em essência botânica.',
  badge: 'Comportamento & Humor',
  icon: 'Apple',
  disclaimer: 'Aviso: Zero calorias e 100% de precisão sobre a sua vibe nas reuniões de família.',
  profiles: {
    'abacaxi': {
      name: 'Abacaxi',
      subtitle: 'O Difícil de Acessar, Maravilhoso de Conviver',
      description: 'Você tem cara fechada e postura reservada. Quem não te conhece acha que você é metido ou inacessível, mas é só sua casca de proteção contra gente folgada. Quem tem paciência de conquistar sua confiança descobre a pessoa mais doce, leal e vibrante do mundo.',
      traits: ['Cara de bravo', 'Coração de ouro', 'Super seletivo', 'Odeia intimidade forçada'],
      quote: 'Não sou antipático, sou apenas uma fruta que exige respeito antes de ser descascada.'
    },
    'maracuja': {
      name: 'Maracujá',
      subtitle: 'O Zen / Inimigo do Estresse',
      description: 'O mundo pode estar desabando em chamas e você continua calmo, bebendo uma água gelada e pensando "no final tudo se ajeita". Nada te tira do sério, você tem uma energia tranquilizadora e é o amigo que todo mundo procura pra não surtar em dias de caos.',
      traits: ['Pressão 12 por 8', 'Zen absoluto', 'Não esquenta a cabeça', 'Calmaria ambulante'],
      quote: 'Pra que se desesperar agora se a gente pode resolver isso com calma amanhã depois do café?'
    },
    'limao': {
      name: 'Limão Tahiti',
      subtitle: 'O Sarcasmo Cirúrgico Essencial',
      description: 'Você tem a língua afiada, odeia clichê e não tem paciência pra gente sonsa. Puro, seu excesso de sinceridade pode arder um pouco nos ouvidos alheios, mas sem a sua presença qualquer conversa ou projeto fica morno, chocho e sem graça.',
      traits: ['Sincero até demais', 'Humor ácido', 'Anti-mimimi', 'Dá o toque de mestre'],
      quote: 'Eu não sou grosso, eu só tenho preguiça biológica de fingir que acho graça em conversa mole.'
    },
    'melancia': {
      name: 'Melancia',
      subtitle: 'O Coração Gigante da Galera',
      description: 'Você é expansivo, acolhedor e não sabe falar baixo nem se quisesse. Ri alto, abraça todo mundo e adora juntar a turma pra comer e fazer bagunça. Onde você chega o ambiente se alegra, porque sua energia é naturalmente refrescante e contagiante.',
      traits: ['Inimigo da tristeza', 'Riso frouxo', 'Espaçoso no bom sentido', 'Acolhedor'],
      quote: 'Quanto mais gente melhor! Chega pra cá que onde come um, comem dez rindo alto!'
    },
    'banana': {
      name: 'Banana Prata',
      subtitle: 'O Alicerce da Paz & Eficiência',
      description: 'Você é a pessoa mais prática e tranquila que existe. Não cria drama por bobagem, não inventa problema onde não tem e segura qualquer perrengue sem fazer tempestade em copo d\'água. É o porto seguro que todo mundo quer por perto no dia a dia.',
      traits: ['Zero drama', 'Super confiável', 'Prático', 'Amigo pra toda hora'],
      quote: 'Pra que complicar o que é simples? Vamos resolver logo isso pra gente ficar em paz.'
    }
  },
  questions: [
    {
      id: 1,
      text: 'Uma pessoa que você mal conhece chega no rolê te abraçando e agindo com intimidade forçada. Sua reação:',
      options: [
        { text: 'Mantenho a cara fechada, dou um passo pra trás e fico analisando a audácia do indivíduo.', profile: 'abacaxi' },
        { text: 'Sorrio, não esquento a cabeça e penso: "deixa a pessoa ser feliz, não tá me machucando".', profile: 'maracuja' },
        { text: 'Mando uma resposta tão seca e sutilmente ácida que a pessoa recua três metros na hora.', profile: 'limao' },
        { text: 'Abraço de volta, puxo assunto e em 5 minutos já estamos combinando de tomar uma juntos.', profile: 'melancia' },
        { text: 'Sou educado por educação básica, dou uma risadinha amigável e saio de perto discretamente.', profile: 'banana' }
      ]
    },
    {
      id: 2,
      text: 'O grupo de amigos ou do trabalho tá surtando no WhatsApp com um problemão. O que você faz?',
      options: [
        { text: 'Mando mensagem: "Galera, respira fundo. Ninguém vai morrer, vamos esperar a poeira baixar".', profile: 'maracuja' },
        { text: 'Aponto logo o culpado óbvio e o erro evidente que todo mundo tá com medinho de falar.', profile: 'limao' },
        { text: 'Mando uma piada ou áudio engraçado pra quebrar o clima pesado antes que alguém infarte.', profile: 'melancia' },
        { text: 'Vou direto na causa prática, resolvo a pendência em silêncio e aviso que tá pronto.', profile: 'banana' },
        { text: 'Fico quieto no meu canto só observando a bagunça até que peçam minha opinião de verdade.', profile: 'abacaxi' }
      ]
    },
    {
      id: 3,
      text: 'Qual é o seu programa ideal para uma sexta-feira à noite?',
      options: [
        { text: 'Em casa, de boa, com ar-condicionado e silêncio absoluto pra recarregar a bateria social.', profile: 'maracuja' },
        { text: 'Uma mesa grande de bar com a galera toda falando junto, petisco e risada até tarde.', profile: 'melancia' },
        { text: 'Um jantar reservado, num lugar bom, apenas com duas ou três pessoas selecionadas a dedo.', profile: 'abacaxi' },
        { text: 'Uma comidinha simples e gostosa, uma série tranquila e paz de espírito na cama.', profile: 'banana' },
        { text: 'Qualquer rolê com pouca gente onde eu possa tomar algo bom e falar mal de terceiros em paz.', profile: 'limao' }
      ]
    },
    {
      id: 4,
      text: 'Como você lida com pessoas dramáticas que adoram fazer tempestade em copo d\'água?',
      options: [
        { text: 'Tenho alergia imediata. Solto uma frase ácida pra pessoa cair na real e me afasto.', profile: 'limao' },
        { text: 'Corto o drama na hora com uma solução tão óbvia e simples que o drama perde a razão de existir.', profile: 'banana' },
        { text: 'Olho com ar de tédio e penso: "se você soubesse o quanto a vida é curta, não gastava tempo com isso".', profile: 'maracuja' },
        { text: 'Levanto minha barreira invisível e simplesmente finjo que não ouvi nada pra não me contaminar.', profile: 'abacaxi' },
        { text: 'Tento acalmar, dou um abraço e tento fazer a pessoa dar uma risada pra esquecer a paranoia.', profile: 'melancia' }
      ]
    },
    {
      id: 5,
      text: 'O que mais tira a sua paciência no convívio social?',
      options: [
        { text: 'Gente falsa, que finge que gosta de todo mundo e fica em cima do muro pra agradar.', profile: 'limao' },
        { text: 'Gente invasiva, que não respeita meu espaço, meu tempo e minhas coisas.', profile: 'abacaxi' },
        { text: 'Gente que complica tarefa fácil e não deixa ninguém trabalhar nem descansar em paz.', profile: 'banana' },
        { text: 'Pessoas amargas, de mau humor crônico, que estragam a alegria de qualquer rolê.', profile: 'melancia' },
        { text: 'Pessoas neuróticas e afobadas que querem tudo pra ontem e não sabem respirar fundo.', profile: 'maracuja' }
      ]
    },
    {
      id: 6,
      text: 'Se os seus melhores amigos fossem te resumir em uma frase honesta:',
      options: [
        { text: '"Parece bravo no começo, mas depois que você conhece é a melhor pessoa da vida."', profile: 'abacaxi' },
        { text: '"A pessoa mais tranquila do mundo; parece que toma chá de camomila na mamadeira."', profile: 'maracuja' },
        { text: '"Sem papas na língua: fala na cara o que todo mundo pensa e não tem coragem de dizer."', profile: 'limao' },
        { text: '"A alma da festa: onde ele tá não tem tempo ruim nem ninguém sozinho no canto."', profile: 'melancia' },
        { text: '"O mais confiável de todos: você pode ligar às 3h da manhã que ele te ajuda sem drama."', profile: 'banana' }
      ]
    }
  ]
};
