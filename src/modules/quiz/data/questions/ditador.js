export const ditadorQuiz = {
  id: 'que-ditador-voce-seria',
  title: 'Que ditador ou líder autoritário você seria?',
  subtitle: 'De monarcas antigos a ditadores atuais: descubra qual figura histórica tem o seu temperamento.',
  badge: 'Sátira Histórica & Atual',
  icon: 'Crown',
  disclaimer: 'Aviso: Este teste é 100% zoeira e entretenimento. Não apoiamos nenhum regime autoritário nem demissões em massa.',
  profiles: {
    'dom-pedro-ii': {
      name: 'Dom Pedro II',
      subtitle: 'O Monarca que Só Queria Paz e Café',
      description: 'Você é o líder relutante por excelência. Não quer pompa, puxa-saco nem confusão com ninguém. Se assumiu a bronca, foi porque se deixasse na mão dos outros a coisa desandava. Quando uma crise acaba, você só sente aquele alívio gostoso, fecha as abas e vai comer ou ler em paz.',
      traits: ['Só queria paz', 'Alívio pós-crise', 'Pragmatismo sereno', 'Zero frescura'],
      quote: 'Se vocês fizerem a parte de vocês direitinho, eu posso finalmente ir tomar meu café em silêncio.'
    },
    'luis-xiv': {
      name: 'Luís XIV (O Rei Sol)',
      subtitle: 'O Monarca da Vaidade e do Drama',
      description: 'L\'État, c\'est moi! Você adora ser o centro das atenções, acha que seu bom gosto salva qualquer ambiente e espera reconhecimento imediato. Se você ajudou em 5% do trabalho, seu nome tem que estar na capa com fonte dourada.',
      traits: ['Autoestima infinita', 'Exige aplausos', 'Dramático', 'L\'État c\'est moi'],
      quote: 'O projeto sou eu. Sem o meu toque de classe, isso aqui seria apenas uma planilha sem alma.'
    },
    'napoleao': {
      name: 'Napoleão Bonaparte',
      subtitle: 'O Neurótico do Controle e das Planilhas',
      description: 'Você reorganiza tudo na madrugada porque o padrão não estava do seu agrado. Manda textão com tópicos e checklists e não descansa enquanto não provar matematicamente que o seu método é o único viável no planeta.',
      traits: ['Workaholic', 'Neurótico por ordem', 'Manda textão', 'Odeia enrolação'],
      quote: 'Não existe problema que um bom checklist e 4 xícaras de café não resolvam antes do meio-dia.'
    },
    'putin': {
      name: 'Vladimir Putin',
      subtitle: 'O Líder Frio do Olhar Enigmático',
      description: 'Zero sorrisos, zero textão e zero paciência pra chilique. Você não bate boca na internet: você apenas visualiza a mensagem, não responde nada e deixa a outra pessoa em pânico recalculando a rota sozinha.',
      traits: ['Frieza de gelo', 'Visualiza e não responde', 'Zero mimimi', 'Olhar intimidador'],
      quote: 'Quem fala muito entrega pouco. Eu apenas observo em silêncio e resolvo.'
    },
    'kim-jong-un': {
      name: 'Kim Jong Un',
      subtitle: 'O Ditador Pop dos Foguetes',
      description: 'Se as coisas não saem do seu jeitinho no prazo, você já quer explodir o grupo do zap, banir os membros e começar tudo do zero. Espalhafatoso, impaciente e pronto pra tocar o terror se contrariado.',
      traits: ['Ameaça banir', 'Pavio curtíssimo', 'Espalhafatoso', '8 ou 80'],
      quote: 'Ou a gente faz do meu jeito agora, ou eu cancelo tudo e não se fala mais nisso.'
    }
  },
  questions: [
    {
      id: 1,
      text: 'O que você faz quando alguém no grupo discorda da sua ideia brilhante?',
      options: [
        { text: 'Dou um suspiro fundo, fico quieto pra não arrumar confusão e penso: "se der ruim, avisei".', profile: 'dom-pedro-ii' },
        { text: 'Faço drama, digo que ninguém reconhece meu brilho e finjo que vou sair do grupo.', profile: 'luis-xiv' },
        { text: 'Mando um textão com prints, gráficos e tópicos pra provar por A + B que eu tô certo.', profile: 'napoleao' },
        { text: 'Apenas visualizo a mensagem, não respondo nada e deixo o silêncio pesar no ar.', profile: 'putin' },
        { text: 'Mando áudio gritando e já ameaço cancelar o projeto todo na hora.', profile: 'kim-jong-un' }
      ]
    },
    {
      id: 2,
      text: 'Qual é o seu jeito de pedir pra alguém fazer uma tarefa?',
      options: [
        { text: 'Peço com calma e torço muito pra pessoa não me chamar com 50 dúvidas óbvias.', profile: 'dom-pedro-ii' },
        { text: 'Mando mensagem de duas palavras secas e espero que façam com precisão militar.', profile: 'putin' },
        { text: 'Mando um checklist com cada etapa numerada e prazos cravados no minuto.', profile: 'napoleao' },
        { text: 'Digo que é uma honra trabalhar comigo e espero lealdade e dedicação total.', profile: 'luis-xiv' },
        { text: 'Falo que tem que ficar pronto até as 15h, senão vai rodar todo mundo.', profile: 'kim-jong-un' }
      ]
    },
    {
      id: 3,
      text: 'Como você comemora quando finalmente resolve um desafio complicado?',
      options: [
        { text: 'Solto um suspiro de alívio, fecho 40 abas abertas e vou comer um lanche em silêncio.', profile: 'dom-pedro-ii' },
        { text: 'Posto foto nos stories fingindo costume, mas por dentro tô me achando o maioral.', profile: 'luis-xiv' },
        { text: 'Fico noiado achando que esqueci de conferir algum detalhe minúsculo antes de relaxar.', profile: 'napoleao' },
        { text: 'Nem comemoro. Mando um "tá pronto" seco e já passo pro próximo problema.', profile: 'putin' },
        { text: 'Solto fogos, mando sticker no grupo e exijo que todos comemorem a minha genialidade.', profile: 'kim-jong-un' }
      ]
    },
    {
      id: 4,
      text: 'Alguém te manda uma crítica ou feedback que você achou desnecessário:',
      options: [
        { text: 'Mando um "beleza, valeu", concordo só pra acabar logo o assunto e sigo a vida.', profile: 'dom-pedro-ii' },
        { text: 'Fico ofendido no fundo da alma, guardo mágoa e passo a ignorar a pessoa.', profile: 'luis-xiv' },
        { text: 'Debato item por item até a pessoa admitir que o argumento dela era fraco.', profile: 'napoleao' },
        { text: 'Olho fixo pra mensagem, dou uma risadinha interna e não gasto uma gota de saliva.', profile: 'putin' },
        { text: 'Bloqueio a pessoa na hora em todas as redes sociais pra ela aprender.', profile: 'kim-jong-un' }
      ]
    },
    {
      id: 5,
      text: 'Qual é a sua relação com regras e processos no dia a dia?',
      options: [
        { text: 'Sigo o básico pra ninguém encher o meu saco e não ter dor de cabeça.', profile: 'dom-pedro-ii' },
        { text: 'Eu crio as regras, o sistema sou eu e quem não gostar que se mude.', profile: 'luis-xiv' },
        { text: 'Regras são sagradas e todo mundo deveria seguir os manuais à risca.', profile: 'napoleao' },
        { text: 'As regras existem pros outros; eu decido quando elas se aplicam.', profile: 'putin' },
        { text: 'Se a regra me irritar hoje, amanhã eu invento um decreto novo e cancelo a anterior.', profile: 'kim-jong-un' }
      ]
    },
    {
      id: 6,
      text: 'Se fossem fazer uma homenagem pra você:',
      options: [
        { text: 'Um cantinho com ar-condicionado, poltrona boa, café e zero pessoas me chamando.', profile: 'dom-pedro-ii' },
        { text: 'Um palácio dourado com espelhos em todas as paredes e retratos meus.', profile: 'luis-xiv' },
        { text: 'Uma avenida principal movimentada e perfeitamente sinalizada com meu nome.', profile: 'napoleao' },
        { text: 'Não quero estátua nem festa, só quero que respeitem meu território.', profile: 'putin' },
        { text: 'Um desfile militar épico com fogos de artifício e feriado nacional obrigatório.', profile: 'kim-jong-un' }
      ]
    }
  ]
};
