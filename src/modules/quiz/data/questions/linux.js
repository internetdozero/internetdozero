export const linuxQuiz = {
  id: 'qual-distro-linux-e-a-sua-cara',
  title: 'Qual distro Linux é a sua cara?',
  subtitle: 'Um teste comportamental do cotidiano para descobrir qual sistema operacional vive na sua alma.',
  badge: 'Tecnologia & Comportamento',
  icon: 'Terminal',
  disclaimer: 'Aviso: Nenhuma linha de terminal precisará ser digitada durante este teste.',
  profiles: {
    'arch': {
      name: 'Arch Linux',
      subtitle: 'O Masoquista do Controle Total',
      description: 'Você não quer facilidade; você quer fazer do seu jeito, mesmo que isso custe 8 horas do seu sábado com uma chave de fenda na mão. Tem orgulho de entender como cada engrenagem funciona e adora uma gambiarra artesanal avançada.',
      traits: ['Faz tudo na mão', 'Odeia atalhos', 'Mochileiro sem roteiro', 'Curte um perrengue'],
      quote: 'Se não fui eu que montei parafuso por parafuso, então não tá bem feito.'
    },
    'debian': {
      name: 'Debian Stable',
      subtitle: 'A Rocha Inabalável da Paz de Espírito',
      description: 'Você preza a estabilidade acima de qualquer modinha passageira. Veste as mesmas roupas confortáveis há anos, pede o mesmo prato no restaurante e odeia quando mudam o botão de lugar. Se tá funcionando, não se mexe.',
      traits: ['Conservador da paz', 'Zero estresse', 'Inimigo da novidade', 'Fiel ao clássico'],
      quote: 'Em time que tá ganhando não se mexe há pelo menos cinco anos.'
    },
    'ubuntu': {
      name: 'Ubuntu',
      subtitle: 'O Pragmático da Conveniência',
      description: 'Você tem vida, boletos pra pagar e zero tempo a perder consertando torneira. Quer apertar um botão, ver o negócio funcionando e ir viver sua vida. Paga pela facilidade sem peso na consciência: tempo é ouro.',
      traits: ['Prático', 'Amigo do atalho', 'Sem frescura', 'Quer ver funcionando'],
      quote: 'Eu não quero saber como a máquina funciona por dentro, só quero que ela faça o serviço.'
    },
    'nixos': {
      name: 'NixOS',
      subtitle: 'O Metódico do Cérebro Galáctico',
      description: 'Sua vida é organizada em pastas, gavetas com etiquetas e planilhas com cores padronizadas. Se algo der errado, você tem um plano de contingência documentado em três vias para restaurar a harmonia do universo.',
      traits: ['Metódico absoluto', 'Gavetas etiquetadas', 'Plano de contingência', 'Previsível'],
      quote: 'O caos é apenas a falta de um método rigoroso bem documentado.'
    }
  },
  questions: [
    {
      id: 1,
      text: 'Você comprou um móvel novo que veio desmontado numa caixa. O que você faz?',
      options: [
        { text: 'Chamo um montador ou pago a taxa de montagem pra não esquentar a cabeça no fim de semana.', profile: 'ubuntu' },
        { text: 'Sigo o manual religiosamente passo a passo, guardando cada parafuso extra num saquinho.', profile: 'debian' },
        { text: 'Jogo o manual pro lado, pego minha caixa de ferramentas e monto do meu jeito na raça.', profile: 'arch' },
        { text: 'Organizo todas as peças no chão em ordem alfabética e por tamanho antes de começar.', profile: 'nixos' }
      ]
    },
    {
      id: 2,
      text: 'Como é o seu guarda-roupa no dia a dia?',
      options: [
        { text: 'Tenho as mesmas 4 camisetas e 2 calças há anos. Enquanto não rasgar, tá valendo.', profile: 'debian' },
        { text: 'Básico e prático: o que tiver limpo na gaveta eu visto sem perder tempo pensando.', profile: 'ubuntu' },
        { text: 'Peças com bolsos funcionais e estilo próprio que só eu entendo a utilidade.', profile: 'arch' },
        { text: 'Roupas exatamente iguais, todas dobradas no mesmo padrão milimétrico na gaveta.', profile: 'nixos' }
      ]
    },
    {
      id: 3,
      text: 'Deu um barulho esquisito no motor do carro ou no chuveiro. Sua reação:',
      options: [
        { text: 'Ainda tá funcionando? Então deixa quieto. Barulho velho não mata ninguém.', profile: 'debian' },
        { text: 'Levo direto no mecânico de confiança e falo: "só me entrega funcionando até as 18h".', profile: 'ubuntu' },
        { text: 'Abro o capô no sábado de manhã e passo 6 horas desmontando até descobrir a origem.', profile: 'arch' },
        { text: 'Consulto o histórico de manutenção na minha planilha e troco a peça preventiva no prazo.', profile: 'nixos' }
      ]
    },
    {
      id: 4,
      text: 'Qual é o seu estilo na hora de cozinhar ou comer?',
      options: [
        { text: 'Abro o aplicativo de entrega, peço o que chegar mais rápido e almoço em paz.', profile: 'ubuntu' },
        { text: 'Arroz, feijão, bife e ovo. Prato simples, gostoso e que nunca falha há décadas.', profile: 'debian' },
        { text: 'Faço minha própria receita do zero, moendo temperos na mão e testando combinações.', profile: 'arch' },
        { text: 'Cozinho com balança de precisão, sigo os gramas da receita e lavo a louça na mesma ordem.', profile: 'nixos' }
      ]
    },
    {
      id: 5,
      text: 'Como você planeja uma viagem de férias?',
      options: [
        { text: 'Vou pro mesmo lugar tranquilo de sempre, onde eu já conheço os caminhos e as pessoas.', profile: 'debian' },
        { text: 'Compro o pacote com hotel e passagem, chego lá e decido os passeios na hora.', profile: 'ubuntu' },
        { text: 'Mochila nas costas e sem roteiro fixo; se der perrengue no caminho, faz parte da graça.', profile: 'arch' },
        { text: 'Itinerário com horários previstos em PDF, rotas de fuga e endereços salvos offline.', profile: 'nixos' }
      ]
    },
    {
      id: 6,
      text: 'Quando sai uma atualização visual grande no seu aplicativo favorito:',
      options: [
        { text: 'Odeio com todas as minhas forças. Pra que mudar o que já tava funcionando perfeitamente?', profile: 'debian' },
        { text: 'Se tiver mais rápido tá ótimo; se não, me acostumo com o novo layout em dois dias.', profile: 'ubuntu' },
        { text: 'Ativo a versão de testes na hora só pra ver as novidades, mesmo que venha com bug.', profile: 'arch' },
        { text: 'Leio toda a lista de mudanças antes de aceitar e só atualizo se for estritamente seguro.', profile: 'nixos' }
      ]
    }
  ]
};
