export const ditadorQuiz = {
  id: 'que-ditador-voce-seria',
  title: 'Que ditador você seria?',
  subtitle: 'Um teste histórico-humorístico para medir o seu nível de autoritarismo no cotidiano.',
  badge: 'Sátira Histórica',
  icon: 'Crown',
  disclaimer: 'Aviso: Este quiz é puramente humorístico e satírico. Não encorajamos invasões territoriais nem queima de monumentos.',
  profiles: {
    'julio-cesar': {
      name: 'Júlio César',
      subtitle: 'O Estrategista Carismático',
      description: 'Você lidera com brilho nos olhos e uma ambição desmedida. Cruza o Rubicão sem pestanejar e acha que as regras se aplicam aos outros. Só tome cuidado com convites amigáveis em idos de março.',
      traits: ['Audacioso', 'Sedutor', 'Cruza limites', 'Despreza avisos'],
      quote: 'A sorte está lançada... mas se der ruim, a culpa é do Senado.'
    },
    'napoleao': {
      name: 'Napoleão Bonaparte',
      subtitle: 'O Micro-gestor da Glória',
      description: 'Você reorganiza a planilha inteira às 3 da manhã só porque o alinhamento estava torto. Nada escapa ao seu radar burocrático e militar. Seu único ponto fraco é o frio e reuniões longas demais.',
      traits: ['Metódico', 'Workaholic', 'Perfeccionista', 'Odeia o inverno'],
      quote: 'Não há nada que não possa ser conquistado antes do almoço.'
    },
    'nero': {
      name: 'Nero',
      subtitle: 'O Artista Incompreendido',
      description: 'Se as coisas não saem exatamente como você idealizou na sua mente artística, você prefere incendiar o projeto todo e tocar harpa vendo as cinzas. Dramático, teatral e sem paciência.',
      traits: ['Dramático', 'Teatral', 'Zero paciência', 'Poeta do caos'],
      quote: 'Que grande artista o mundo perde quando o deploy quebra!'
    },
    'genghis-khan': {
      name: 'Genghis Khan',
      subtitle: 'A Força Bruta Pragmática',
      description: 'Burocracia? Reunião de alinhamento? Você chega atropelando, conquista a demanda em 15 minutos e segue cavalgando em direção ao próximo horizonte. Simples, veloz e implacável.',
      traits: ['Direto ao ponto', 'Sem rodeios', 'Velocidade total', 'Lança primeiro'],
      quote: 'Menos conversa fiada, mais conquista territorial.'
    }
  },
  questions: [
    {
      id: 1,
      text: 'O que você faz quando alguém no grupo discorda da sua ideia brilhante?',
      options: [
        { text: 'Apresento argumentos tão teatrais e dramáticos que a pessoa desiste por exaustão.', profile: 'nero' },
        { text: 'Finjo que aceitei a crítica, mas cruzo a linha e implemento do meu jeito mesmo.', profile: 'julio-cesar' },
        { text: 'Escrevo um regulamento de 40 páginas provando que a minha lógica é irrefutável.', profile: 'napoleao' },
        { text: 'Atropelo o argumento em dois segundos e sigo como se a pessoa não tivesse falado nada.', profile: 'genghis-khan' }
      ]
    },
    {
      id: 2,
      text: 'Qual é o seu estilo ao delegar uma tarefa para a equipe?',
      options: [
        { text: 'Passo o comando em duas palavras e se não fizerem rápido eu mesmo passo por cima.', profile: 'genghis-khan' },
        { text: 'Defino métricas, sub-etapas e horários com rigor militar de segundo a segundo.', profile: 'napoleao' },
        { text: 'Inspiro com um discurso grandioso e espero que me sirvam com lealdade irrestrita.', profile: 'julio-cesar' },
        { text: 'Espero perfeição divina; se vier com erro, faço um escândalo digno de ópera.', profile: 'nero' }
      ]
    },
    {
      id: 3,
      text: 'Como você comemora quando finalmente vence um desafio complicado?',
      options: [
        { text: 'Organizo um banquete extravagante regado a arte e aplausos dos meus súditos.', profile: 'nero' },
        { text: 'Desfilo triunfante, concedo favores públicos e já miro a próxima grande vitória.', profile: 'julio-cesar' },
        { text: 'Documento o aprendizado, reformo os processos internos e planejo a expansão.', profile: 'napoleao' },
        { text: 'Pego o espólio, passo o trator e já parto para a próxima batalha sem descanso.', profile: 'genghis-khan' }
      ]
    },
    {
      id: 4,
      text: 'Um amigo de confiança traz um feedback desconfortável sobre você. Sua reação:',
      options: [
        { text: 'Desconfio imediatamente de uma conspiração no grupo e fico de olho nele.', profile: 'julio-cesar' },
        { text: 'Acho uma ingratidão descomunal e penso em cortar relações na hora com lágrimas nos olhos.', profile: 'nero' },
        { text: 'Ignoro sumariamente. Fracos debatem sentimentos, fortes marcham adiante.', profile: 'genghis-khan' },
        { text: 'Fico obcecado provando com dados que a análise dele continha erros metodológicos.', profile: 'napoleao' }
      ]
    },
    {
      id: 5,
      text: 'Qual é a sua relação com regras e burocracias?',
      options: [
        { text: 'Eu crio as regras. O código sou eu.', profile: 'napoleao' },
        { text: 'Regras são sugestões poéticas para quem não tem talento natural.', profile: 'nero' },
        { text: 'Regras existem para manter os outros na linha enquanto eu cruzo a fronteira.', profile: 'julio-cesar' },
        { text: 'Regra boa é linha reta: quem ficar na frente é atropelado.', profile: 'genghis-khan' }
      ]
    },
    {
      id: 6,
      text: 'Se você pudesse escolher um monumento em sua homenagem:',
      options: [
        { text: 'Um coliseu de mármore dourado com o meu busto tocando harpa.', profile: 'nero' },
        { text: 'Um arco do triunfo imponente com o meu nome cravado para a eternidade.', profile: 'napoleao' },
        { text: 'Uma estátua gigante a cavalo no meio de uma planície infinita.', profile: 'genghis-khan' },
        { text: 'O mês do calendário batizado com o meu nome para que ninguém nunca me esqueça.', profile: 'julio-cesar' }
      ]
    }
  ]
};
