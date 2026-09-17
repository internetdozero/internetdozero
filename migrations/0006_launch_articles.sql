INSERT OR IGNORE INTO categories (name) VALUES ('Web'), ('Segurança'), ('Organização');

INSERT OR IGNORE INTO posts (
  id, slug, type, title_pt, subtitle_pt, category, author, reading_time,
  tags_pt, sections_pt, created_at, published
) VALUES
(
  'launch-own-corner',
  'como-publicar-um-site-proprio-sem-complicar',
  'article',
  'Como publicar um site próprio sem complicar',
  'Um mapa honesto para sair da ideia, escolher uma hospedagem e colocar uma página no ar.',
  'Web',
  'Eduardo S.',
  '6 min',
  '["Web","Hospedagem","Independência"]',
  '[{"id":"comece-pequeno","title":"Comece pequeno","content":"Um site não precisa nascer como uma plataforma. Uma página com seu nome, uma apresentação curta e uma forma de contato já é um endereço seu na internet. O importante é que o conteúdo esteja em um lugar que você controla, com uma URL que possa continuar existindo mesmo se uma rede social mudar de regra.\n\nA [IndieWeb](https://indieweb.org/) reúne uma boa coleção de ideias sobre esse modelo: publicar primeiro no próprio site e usar outras redes como distribuição, quando fizer sentido."},{"id":"as-pecas","title":"As peças do quebra-cabeça","content":"Você precisa de três coisas:\n• **Domínio:** o endereço que as pessoas digitam, como `seunome.com.br`.\n• **Hospedagem:** o serviço que entrega seus arquivos para quem acessa o endereço.\n• **Site:** os arquivos HTML, CSS e JavaScript, ou o sistema que os gera.\n\nPara um site estático, serviços como [Cloudflare Pages](https://pages.cloudflare.com/), [GitHub Pages](https://pages.github.com/) e [Netlify](https://www.netlify.com/) fazem o trabalho pesado de distribuição. O domínio é comprado separadamente em um registrador; no Brasil, o [Registro.br](https://registro.br/) é o ponto de partida natural para endereços `.br`."},{"id":"publicacao","title":"O caminho mais curto","content":"1. Registre um domínio curto e fácil de falar.\n2. Coloque o código em um repositório Git.\n3. Conecte o repositório à hospedagem e defina o comando de build, como `npm run build`.\n4. Aponte o DNS do domínio para a hospedagem.\n5. Abra o endereço em uma janela anônima e teste celular, links, formulário e página inexistente.\n\nO HTTPS costuma ser fornecido automaticamente pela hospedagem. Ainda assim, confira se o cadeado aparece e se o domínio sem `www` redireciona para a versão escolhida."},{"id":"antes-de-divulgar","title":"Antes de divulgar","content":"Faça uma visita como se você nunca tivesse visto o projeto. A página explica o que é nos primeiros segundos? O menu funciona sem depender do mouse? O site continua legível no celular? Existe uma forma de voltar quando alguém abre um link quebrado?\n\nDepois, monitore o básico: erros no console, tempo de carregamento e disponibilidade. Não precisa instalar um painel de métricas invasivo para começar. Um site próprio vale justamente por ser simples o bastante para você entender e manter."}]',
  '2026-09-17T09:00:00.000Z',
  1
),
(
  'launch-account-security',
  'um-checklist-pratico-para-proteger-suas-contas',
  'article',
  'Um checklist prático para proteger suas contas',
  'O básico bem feito já bloqueia a maioria dos problemas comuns — e leva menos tempo do que parece.',
  'Segurança',
  'Eduardo S.',
  '7 min',
  '["Segurança","Privacidade","Contas"]',
  '[{"id":"comece-pelo-email","title":"Comece pelo e-mail","content":"Seu e-mail é a chave de recuperação de quase todo o resto. Se alguém controlar essa conta, pode redefinir senhas, acessar documentos e se passar por você. Por isso, trate a senha do e-mail como uma chave mestra: ela deve ser única, longa e nunca reutilizada.\n\nUse um gerenciador como [Bitwarden](https://bitwarden.com/) ou [KeePassXC](https://keepassxc.org/) para criar e guardar senhas diferentes. O [CISA](https://www.cisa.gov/secure-our-world/use-strong-passwords) recomenda senhas fortes e gerenciadores porque memorizar dezenas de combinações costuma empurrar as pessoas para a reutilização."},{"id":"duas-etapas","title":"Ligue a verificação em duas etapas","content":"A autenticação em dois fatores adiciona uma segunda prova além da senha. Prefira, nesta ordem, uma chave física de segurança, um aplicativo autenticador ou códigos de recuperação guardados offline. SMS é melhor do que senha sozinha, mas é mais vulnerável a golpes de troca de chip.\n\nAtive a proteção primeiro no e-mail, depois no gerenciador de senhas, no banco e nas redes sociais. Ao terminar, baixe os códigos de recuperação e guarde-os em um local seguro. Não deixe todos os seus métodos de recuperação presos ao mesmo celular."},{"id":"reduza-superficie","title":"Reduza a superfície de ataque","content":"Faça uma limpeza trimestral:\n• Apague contas que você não usa mais.\n• Revogue sessões abertas em computadores antigos.\n• Remova aplicativos conectados que você não reconhece.\n• Atualize sistema, navegador e extensões.\n• Desconfie de urgência, prêmio e pedido de código.\n\nA [EFF](https://ssd.eff.org/) mantém guias simples sobre privacidade e segurança para situações diferentes. Segurança não é paranoia: é diminuir oportunidades para que um erro pequeno vire um problema grande."},{"id":"quando-der-errado","title":"Se algo parecer errado","content":"Pare de responder e não clique em novos links. Acesse o serviço digitando o endereço no navegador, troque a senha por um dispositivo confiável, encerre sessões e revise métodos de recuperação. Se a conta de e-mail foi afetada, proteja-a antes de qualquer outra.\n\nAvise contatos somente depois de recuperar o controle. Mensagens honestas e rápidas ajudam a evitar que outras pessoas caiam no mesmo golpe."}]',
  '2026-09-17T09:10:00.000Z',
  1
),
(
  'launch-backup-routine',
  'backup-sem-drama-uma-rotina-que-cabe-na-vida-real',
  'article',
  'Backup sem drama: uma rotina que cabe na vida real',
  'Como proteger fotos, documentos e projetos sem transformar organização em um segundo emprego.',
  'Organização',
  'Eduardo S.',
  '6 min',
  '["Backup","Organização","Dados"]',
  '[{"id":"o-que-merece-copia","title":"O que merece uma cópia","content":"Comece pelo que seria doloroso ou impossível refazer: documentos, fotos, projetos, códigos, notas e chaves de recuperação. Liste as pastas, não todos os arquivos. Se você não sabe onde algo importante está, o primeiro backup é justamente colocar isso em um lugar previsível.\n\nNão confunda sincronização com backup. Se um arquivo é apagado ou criptografado, a sincronização pode repetir o problema em todos os dispositivos. Backup é uma cópia com histórico ou em um destino que não fica permanentemente espelhado."},{"id":"regra-321","title":"A regra 3-2-1","content":"Uma regra simples é manter **3 cópias** dos dados, em **2 tipos de mídia**, com **1 cópia fora do dispositivo principal**. Para fotos, isso pode ser o computador, um SSD externo e uma cópia em nuvem. Para um projeto, pode ser o repositório Git, um arquivo compactado mensal e um disco guardado em outro lugar.\n\nA [CISA](https://www.cisa.gov/stopransomware/ransomware-guide) recomenda backups offline e testados como parte da proteção contra ransomware. A cópia desconectada é importante porque um invasor não deve conseguir apagar todas as versões com a mesma credencial."},{"id":"rotina-minima","title":"Uma rotina mínima","content":"Uma vez por semana, copie arquivos novos e confirme a data da última cópia. Uma vez por mês, faça uma cópia completa ou um snapshot do que mudou. A cada três meses, tente restaurar alguns arquivos aleatórios.\n\nO teste é a parte que mais falta. Um disco que não abre, uma senha esquecida ou um backup incompleto só aparecem quando você tenta recuperar algo. Abra uma foto, um documento e um projeto; se os três voltarem intactos, você já tem uma evidência melhor do que uma notificação de sucesso."},{"id":"mantenha-possivel","title":"Mantenha possível","content":"Escolha uma rotina que você realmente consiga repetir. Use formatos comuns, nomeie pastas com datas e registre onde cada cópia fica. Criptografe discos externos se eles carregarem dados pessoais e mantenha a chave em outro local seguro.\n\nBackup bom não é o mais sofisticado. É o que existe antes do acidente e pode ser restaurado sem depender de memória, sorte ou promessa de uma única empresa."}]',
  '2026-09-17T09:20:00.000Z',
  1
);
