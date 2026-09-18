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

Um Cloudflare Worker autônomo (`workers/internetdozero-cron`) gerencia a pesquisa, redação e publicação editorial diretamente no banco D1:

- **Descoberta & Pautas:** Monitora fontes abertas e garante diversidade temática com deduplicação editorial.
- **Redação com IA:** Síntese de conteúdo factual e didático, com validação e integridade de fontes citadas.
- **Acervo Visual Aberto:** Busca e anexa fotografias de alta resolução sob licenças abertas (Creative Commons / Domínio Público) com atribuição completa de créditos.
- **Publicação:** Suporta publicação direta ou envio para a fila de rascunhos gerenciável via painel `/admin`.

O sitemap fica em [`/sitemap.xml`](https://internetdozero.com.br/sitemap.xml) e inclui a home, o blog, os artigos publicados e as ferramentas. O painel `/admin` é bloqueado pelo `robots.txt` e protegido por sessão segura, hash de senha e controle de CSRF.

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

Antes do primeiro deploy, configure as variáveis de ambiente e segredos necessários no Cloudflare Worker. O endpoint não deve ser exposto sem autenticação.

Mais detalhes de cada versão estão em [`changelog.md`](changelog.md).

## Licença

- **Código-fonte (ferramentas, motor e componentes):** Licenciado sob a [Licença MIT](LICENSE).
- **Conteúdo editorial (artigos do blog, crônicas e marca):** Todos os direitos reservados ao autor.

Veja o arquivo [`LICENSE`](LICENSE) para os termos completos.
