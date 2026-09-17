# Changelog

## [1.1.0] — 2026-09-17

### Adicionado

- Dez ferramentas locais em `/tools`, sem cadastro e sem upload de arquivos:
  - compressor de imagens;
  - gerador de senhas;
  - masterizador e cortador de áudio;
  - removedor de metadados de imagens;
  - extrator de áudio de vídeo;
  - contador de texto;
  - gerador de QR Code em PNG e SVG;
  - comparador de texto e código;
  - formatador, compactador e validador de JSON.
- Rotas em português e aliases em inglês para todas as ferramentas.
- Pré-visualizações, mensagens de erro, estados de processamento e cards com sugestões de uso.
- PWA das ferramentas com processamento local e suporte offline quando os arquivos já estão em cache.
- Sitemap XML com as rotas das 10 ferramentas, robots.txt e melhorias de indexação.

### Corrigido e melhorado

- Redução de engasgos no mobile e remoção de efeitos pesados durante a rolagem.
- Layout responsivo para nomes longos, cabeçalho e telas estreitas.
- Seleção de outro arquivo reabrindo corretamente o seletor.
- Downloads gerados diretamente pelo navegador.
- Motor do extrator de áudio hospedado localmente, com progresso e feedback durante o carregamento.
- QR Code iniciado com o endereço do site e cor preta como padrão.
- Comparação e edição com foco visual mais claro e processamento local explícito.

## [1.0.0] — 2026-09-16

### Primeira versão publicada

- Site pessoal Internet do Zero com identidade visual própria.
- Hub inicial com navegação para textos, console e espaços em construção.
- Blog modular com artigos, crônicas, notas, categorias, busca e leitura em português e inglês.
- URLs permanentes para os artigos, página 404 e sitemap inicial.
- Console interativo e painel administrativo protegido por sessão, hash de senha e segredo configurável.
- Publicação preparada para Cloudflare Pages, com banco D1 e variáveis de produção.
- Service worker inicial para transformar as ferramentas em uma experiência instalável e offline.
