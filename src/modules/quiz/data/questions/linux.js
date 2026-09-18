export const linuxQuiz = {
  id: 'qual-distro-linux-e-a-sua-cara',
  title: 'Qual distro Linux é a sua cara?',
  subtitle: 'Descubra qual sabor do pinguim reflete a sua paciência com bugs, terminais e o mundo real.',
  badge: 'Tecnologia & Dev',
  icon: 'Terminal',
  disclaimer: 'Feito com carinho para quem já passou horas no terminal tentando configurar o som ou o Wi-Fi.',
  profiles: {
    'arch': {
      name: 'Arch Linux',
      subtitle: 'O Purista do "I use Arch btw"',
      description: 'Você não quer facilidade; você quer controle absoluto sobre cada bit. Se a interface quebrar na sexta-feira às 23h, você abre um sorriso e vai ler a Arch Wiki com prazer masoquista.',
      traits: ['Minimalista', 'Orgulhoso', 'Compila tudo', 'Lê a Wiki'],
      quote: 'Se não foi você quem configurou o xorg.conf na unha, o sistema não é seu.'
    },
    'debian': {
      name: 'Debian Stable',
      subtitle: 'A Rocha Inabalável do Universo',
      description: 'Você preza a paz de espírito acima de tudo. Seus pacotes podem ser de 2021, mas o sistema vai continuar rodando firme e forte mesmo se um meteoro atingir o datacenter.',
      traits: ['Estabilidade pura', 'Zero estresse', 'Sem modismos', 'Conservador'],
      quote: 'Software novo traz bug novo. Prefiro o que já foi testado por monges tibetanos.'
    },
    'ubuntu': {
      name: 'Ubuntu',
      subtitle: 'O Pragmático Sem Tempo a Perder',
      description: 'Você tem trabalho pra entregar e boletos pra pagar. Quer plugar o pen drive, apertar "Avançar" e ter Wi-Fi, som e navegador funcionando em 5 minutos. Pragmatismo puro.',
      traits: ['Prático', 'Focado em entregar', 'Zero frescura', 'Amigo do mouse'],
      quote: 'Eu não quero saber como o kernel funciona, só quero abrir a IDE e codar.'
    },
    'nixos': {
      name: 'NixOS',
      subtitle: 'O Filósofo da Pureza Declarativa',
      description: 'Seu sistema inteiro está descrito em um arquivo de texto imutável. Se o computador explodir, você compra outro, roda um comando e reconstitui o cosmos em perfeita harmonia matemática.',
      traits: ['Cérebro galáctico', 'Reprodutível', 'Imutável', 'Futurista'],
      quote: 'Estado mutável é ilusão da matéria. Tudo deve ser uma função pura.'
    }
  },
  questions: [
    {
      id: 1,
      text: 'O computador travou feio e não sobe mais a tela gráfica. Sua primeira atitude:',
      options: [
        { text: 'Aperto Ctrl+Alt+F3, abro o tty e começo a debugar o journalctl com brilho nos olhos.', profile: 'arch' },
        { text: 'Travou? Impossível. Meu sistema roda a mesma versão estável há quatro anos sem reiniciar.', profile: 'debian' },
        { text: 'Reinicio segurando Shift, seleciono o kernel anterior no Grub e sigo a vida.', profile: 'ubuntu' },
        { text: 'Faço rollback para a geração anterior no bootloader em dois segundos cravados.', profile: 'nixos' }
      ]
    },
    {
      id: 2,
      text: 'Qual é a sua relação com instalar programas e ferramentas novas?',
      options: [
        { text: 'Se não estiver no repositório oficial com certificação de estabilidade decenal, nem olho.', profile: 'debian' },
        { text: 'Instalo via AUR ou compilo direto do repositório git do desenvolvedor às 2 da manhã.', profile: 'arch' },
        { text: 'Declaro a dependência no flake de configuração e o sistema resolve deterministicamente.', profile: 'nixos' },
        { text: 'Procuro no instalador gráfico ou meto um Snap/Flatpak que já vem com tudo mastigado.', profile: 'ubuntu' }
      ]
    },
    {
      id: 3,
      text: 'Como é a personalização visual (rice) do seu ambiente de trabalho?',
      options: [
        { text: 'Um tiling window manager em C com transparência calculada por script lua feito à mão.', profile: 'arch' },
        { text: 'O tema padrão do sistema. Trocar papel de parede já consome ciclos de CPU desnecessários.', profile: 'debian' },
        { text: 'Configuração declarativa que replica o ambiente com fontes e cores em qualquer máquina.', profile: 'nixos' },
        { text: 'Tema escuro ativado nas opções do sistema e uma foto bonita de paisagem no fundo.', profile: 'ubuntu' }
      ]
    },
    {
      id: 4,
      text: 'Qual frase melhor define a sua filosofia de vida?',
      options: [
        { text: 'Menos é mais, desde que eu tenha que configurar todo o resto sozinho.', profile: 'arch' },
        { text: 'Em time que está ganhando não se mexe, nem se atualiza a versão do libc.', profile: 'debian' },
        { text: 'Feito é melhor que perfeito. Me dê as ferramentas que eu faço acontecer.', profile: 'ubuntu' },
        { text: 'O universo é um grafo acíclico dirigido de dependências que precisa fechar.', profile: 'nixos' }
      ]
    },
    {
      id: 5,
      text: 'O que você faz no fim de semana quando sobra um tempo livre?',
      options: [
        { text: 'Otimizo os tempos de compilação e troco de gerenciador de janelas pela 8ª vez.', profile: 'arch' },
        { text: 'Desligo o computador. Máquina estável não precisa de carinho aos sábados.', profile: 'debian' },
        { text: 'Jogo alguma coisa no Steam ou assisto uma série, o sistema tá pronto pra isso.', profile: 'ubuntu' },
        { text: 'Refatoro minha árvore de módulos para eliminar redundâncias teóricas de empacotamento.', profile: 'nixos' }
      ]
    },
    {
      id: 6,
      text: 'Se você pudesse mandar um recado para a humanidade sobre sistemas operacionais:',
      options: [
        { text: 'Eu uso Arch, aliás (I use Arch btw).', profile: 'arch' },
        { text: 'Parem de perseguir novidades quebradas; a verdadeira paz é o LTS.', profile: 'debian' },
        { text: 'Use o que te deixa produtivo e vá tomar um café com pessoas reais.', profile: 'ubuntu' },
        { text: 'Em 10 anos todo software do mundo será imutável e declarativo.', profile: 'nixos' }
      ]
    }
  ]
};
