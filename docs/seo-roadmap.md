# Plano executável de SEO e indexação

Objetivo: tornar a home e os artigos públicos fáceis de descobrir, interpretar e compartilhar, sem transformar o site em uma máquina de SEO.

## Estado atual

- O domínio responde em HTTPS e os artigos têm URLs próprias.
- Título, descrição e canonical são atualizados no cliente por `useSeo`.
- `/robots.txt` e `/sitemap.xml` atualmente caem no shell da SPA, portanto não entregam os formatos esperados.
- O conteúdo dos artigos chega pela API depois do carregamento inicial. O Google renderiza JavaScript, mas HTML estático/pré-renderizado é mais rápido e alcança crawlers com menos limitações.
- Não há JSON-LD `BlogPosting` nem imagem associada aos metadados dos artigos.

## Ordem de execução

### PR 1 — Descoberta técnica

**Escopo:** criar `robots.txt` e `sitemap.xml` válidos, com URLs absolutas da home, blog e artigos publicados.

**Implementação:** Pages Functions para gerar o sitemap a partir do D1; `robots.txt` com `Sitemap: https://internetdozero.com.br/sitemap.xml` e bloqueio explícito de `/admin` e `/api/`.

**Aceite:**

- `curl -i /robots.txt` retorna `200` e `Content-Type: text/plain`.
- `curl -i /sitemap.xml` retorna `200` e XML válido.
- O sitemap contém somente URLs públicas e publicadas.
- `/admin` continua acessível para o administrador e não aparece no sitemap.
- Teste XML, build e teste de rota passam.

**Rollback:** remover as duas Functions e voltar ao deploy anterior.

### PR 2 — Metadados de artigo

**Escopo:** melhorar cada página de artigo com título único, descrição, canonical, Open Graph/Twitter e `BlogPosting` JSON-LD.

**Implementação:** centralizar os metadados derivados de título, subtítulo, autor, data, URL e capa; adicionar `alt` descritivo nas imagens; usar `datePublished` e `dateModified` reais.

**Aceite:**

- Cada artigo tem `<title>` e description próprios.
- Canonical aponta para a URL final sem duplicação.
- JSON-LD corresponde exatamente ao conteúdo visível.
- A imagem da capa é pública, absoluta e rastreável.
- Rich Results Test não acusa erro estrutural.

**Rollback:** remover o JSON-LD e manter os metadados básicos existentes.

### PR 3 — Conteúdo e arquitetura de links

**Escopo:** aumentar a chance de descoberta sem texto artificial.

**Implementação:** links internos entre home → blog → artigos; seção de artigos relacionados; títulos que descrevam o problema real; introduções objetivas; imagens com `alt`; página 404 com link de volta.

**Aceite:**

- Todo artigo é alcançável por um link HTML normal a partir do blog.
- Não existem links internos quebrados.
- Cada artigo responde claramente uma intenção de busca.
- O conteúdo continua escrito para pessoas, sem repetição forçada de palavras-chave.

**Rollback:** remover apenas os blocos de links relacionados.

### PR 4 — HTML indexável, se necessário

**Gatilho:** abrir depois que o Search Console mostrar que o Google não está vendo o conteúdo renderizado ou que a indexação está inconsistente.

**Escopo:** pré-renderização/SSR dos artigos públicos, mantendo o painel e a experiência atual em React.

**Implementação:** avaliar geração estática durante o build ou uma camada server-rendered no Pages; não adicionar renderização dinâmica específica para bots.

**Aceite:**

- `curl` da URL de um artigo encontra título, subtítulo e conteúdo no HTML inicial.
- Google URL Inspection mostra o conteúdo no HTML renderizado.
- Rotas inexistentes retornam 404 real ou `noindex` coerente.
- O tempo de carregamento não piora.

## Operação após os PRs

1. Verificar a propriedade `internetdozero.com.br` no Google Search Console.
2. Enviar `https://internetdozero.com.br/sitemap.xml`.
3. Inspecionar e solicitar indexação dos três artigos.
4. Acompanhar páginas indexadas, consultas, impressões, cliques e erros de cobertura.
5. A cada novo artigo, confirmar URL, título, imagem, links internos e presença no sitemap.

Sitemap e pedido de indexação ajudam o Google a descobrir URLs, mas não garantem indexação imediata ou ranking. A prioridade continua sendo conteúdo útil, original e fácil de entender.

## Referências

- [Google Search Essentials](https://developers.google.com/search/docs/essentials)
- [JavaScript SEO Basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Build and Submit a Sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Ask Google to recrawl URLs](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
