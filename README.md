# Internet do Zero

> Um site pessoal para publicar textos e construir ferramentas úteis — do meu jeito.

[![React](https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-deployed-F38020?style=flat-square&logo=cloudflare)](https://pages.cloudflare.com/)
[![Local-first](https://img.shields.io/badge/processing-local-10B981?style=flat-square)](https://internetdozero.com.br/tools)

## O projeto

O Internet do Zero é uma SPA autoral com blog bilíngue, console interativo e uma coleção de ferramentas que rodam localmente no navegador. A versão atual é a `v1.3.0`.

### Ferramentas

Todas ficam disponíveis em [`/tools`](https://internetdozero.com.br/tools), sem cadastro e sem enviar arquivos para um servidor:

- Compressor de imagens — WebP, JPEG e PNG.
- Gerador de senhas — usando a API criptográfica do navegador.
- Masterizador e cortador de áudio — exportação local em WAV.
- Removedor de metadados — limpa informações embutidas de imagens.
- Extrator de áudio de vídeo — processamento local com FFmpeg.wasm.
- Contador de texto — palavras, caracteres, linhas e leitura.
- Gerador de QR Code — PNG, SVG, cores, cantos e logo central.
- Comparador de texto — diferenças linha a linha entre textos ou arquivos.
- Formatador de JSON — valida, formata e compacta JSON.

Rotas principais usam slugs em português; aliases em inglês também estão disponíveis, como `/tools/json-formatter`.

## Blog e publicação

O blog oferece artigos, crônicas e notas com categorias, busca, sumário, comentários, curtidas e versões em português e inglês. O conteúdo publicado pode vir do Cloudflare D1 por meio das Pages Functions, com dados locais como fallback para desenvolvimento.

### Autopilot editorial

Um Worker separado (`workers/internetdozero-cron`) pesquisa pautas e publica artigos no D1 em dois horários diários (08:00 e 20:00, horário de Brasília). O fluxo:

- usa Gemini com Google Search Grounding para buscar pautas atuais;
- informa a data de referência ao redator e diferencia fatos atuais de contexto histórico;
- valida os links externos citados antes de salvar o artigo, interrompendo a publicação se uma fonte estiver inacessível;
- distribui candidatos entre tecnologia, segurança, produtividade, dinheiro, cultura, casa, saúde e lazer;
- evita repetir o mesmo pilar nas últimas 24 horas e deduplica temas dos últimos 30 dias;
- gera o artigo, relaciona ferramentas úteis do site e busca imagens no Openverse;
- aceita somente imagens com licença CC0, CC BY, CC BY-SA ou domínio público, gravando autor, licença, fonte e crédito;
- publica automaticamente quando `AUTO_PUBLISH=1`; rascunhos podem ser publicados pelo painel administrativo.

O Worker usa o binding D1 `DB`, as variáveis `SITE_URL`, `AUTHOR` e `AUTO_PUBLISH`, e os secrets `GEMINI_API_KEY` e `CRON_SECRET`. A execução manual ocorre em `/trigger?secret=...` e deve ser feita somente com o segredo armazenado no ambiente seguro; nunca coloque esse valor no código ou em commits. Quando configurado, o `AI_GATEWAY_URL` encaminha as chamadas ao Gemini pelo AI Gateway, mantendo a chave apenas no header `x-goog-api-key`; sem ele, o endpoint direto é usado como fallback de compatibilidade.

O sitemap fica em [`/sitemap.xml`](https://internetdozero.com.br/sitemap.xml) e inclui a home, o blog, os artigos publicados e as 10 ferramentas. O painel `/admin` é bloqueado pelo `robots.txt` e protegido por sessão HttpOnly, hash de senha e segredo configurável.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Interface | React 19 + React DOM |
| Build | Vite 6 |
| Estilos | Tailwind CSS 4 |
| Ícones | Lucide React |
| Processamento | APIs nativas, Web Audio, Canvas e FFmpeg.wasm |
| Hospedagem | Cloudflare Pages + Pages Functions |
| Dados editoriais | Cloudflare D1 (SQLite) |

## Estrutura

```text
src/
├── components/          # Casca global: header, hub, rodapé e console
├── data/                 # Registro de módulos e dados base
├── hooks/                # Roteamento, idioma, tema e estado compartilhado
├── i18n/                 # Traduções PT/EN
└── modules/
    ├── blog/             # Artigos, busca, comentários e publicação
    └── tools/            # 10 ferramentas locais e componentes relacionados
functions/                # API, autenticação, posts, sitemap e robots.txt
public/                   # Manifesto PWA, service worker, headers e fallback SPA
build.sh                 # Gate de arquitetura + build de produção
```

Cada domínio fica isolado em `src/modules/<domínio>`. O `App.jsx` funciona como casca e carrega as áreas maiores sob demanda.

## Desenvolvimento

Pré-requisitos: Node.js 18+ e npm 9+.

```bash
git clone https://github.com/internetdozero/internetdozero.git
cd internetdozero
npm install
npm run dev
```

Validação local:

```bash
./build.sh        # arquitetura + build de produção
npm test -- --run  # testes Vitest
```

## Cloudflare Pages + D1

1. Crie o banco e configure o binding `DB` no projeto Pages.
2. Use `wrangler.toml.example` como referência para o `wrangler.toml` local.
3. Configure em **Production** os secrets `ADMIN_PASSWORD_HASH` e `ADMIN_SESSION_SECRET`.
4. Faça o deploy com o build `npm run build` e saída `dist`.

Para desenvolvimento local, o fallback de senha em texto puro só é habilitado explicitamente em `.dev.vars` com `ALLOW_PLAINTEXT_ADMIN_PASSWORD=true`. Esse arquivo não deve ser commitado.

O Worker editorial tem configuração própria em `workers/internetdozero-cron/wrangler.toml`. Para publicar uma nova versão:

```bash
cd workers/internetdozero-cron
npx wrangler deploy
```

Antes do primeiro deploy, configure `GEMINI_API_KEY` e `CRON_SECRET` como secrets do Worker. O cron não deve ser exposto sem autenticação.

Mais detalhes de cada versão estão em [`changelog.md`](changelog.md).

## Licença

- **Código-fonte (ferramentas, motor e componentes):** Licenciado sob a [Licença MIT](LICENSE).
- **Conteúdo editorial (artigos do blog, crônicas e marca):** Todos os direitos reservados ao autor.

Veja o arquivo [`LICENSE`](LICENSE) para os termos completos.
