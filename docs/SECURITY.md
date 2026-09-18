# Guia de Segurança e Implantação

Recomendações técnicas para implantação segura do ambiente e proteção das credenciais administrativas.

## Autenticação do Administrador

Gere o hash criptográfico seguro para a senha de produção através do script utilitário:

```bash
printf '%s' 'sua_senha_segura' | node scripts/generate-password-hash.mjs
```

- Configure a saída como secret de ambiente `ADMIN_PASSWORD_HASH` no Cloudflare Pages.
- Configure um segredo aleatório longo para `ADMIN_SESSION_SECRET`.
- Mantenha `ALLOW_PLAINTEXT_ADMIN_PASSWORD=false` em produção. Senhas em texto puro só são permitidas em desenvolvimento local explícito.

## Proteção de Borda e Rate Limiting

A aplicação implementa controle de taxa (*rate limiting*) interno na camada de isolate para endpoints sensíveis (`/api/auth/login` e `/api/comments`).

Em produção, recomenda-se complementar com proteção de borda (Cloudflare WAF / Reverse Proxy):
- Aplicar regras de limitação de requisições por IP no caminho de autenticação (`/api/auth/*`).
- Habilitar proteção contra bots e desafios gerenciados (Managed Challenge) se houver suspeita de ataques de força bruta.
- Manter cabeçalhos de segurança estritos ativos (`Content-Security-Policy`, `HSTS`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`), conforme configurado em `public/_headers`.

## Banco de Dados e Migrações

Aplique as migrações do Cloudflare D1 em ordem sequencial:

```bash
# Ambiente local
npx wrangler d1 migrations apply <DB_BINDING> --local

# Ambiente remoto (produção)
npx wrangler d1 migrations apply <DB_BINDING> --remote
```

- Sempre valide o backup do banco antes de aplicar migrações estruturais remotas.
- O sistema suporta revogação de sessões server-side no logout para mitigar sequestro de sessão.

## Worker editorial

O Worker de publicação automática exige os secrets `GEMINI_API_KEY` e `CRON_SECRET`. O endpoint `/trigger` só aceita requisições cujo parâmetro `secret` corresponda ao `CRON_SECRET`; não compartilhe essa URL completa em logs, issues, screenshots ou documentação pública. Prefira executar o trigger por um ambiente seguro, como o Vault, e faça a rotação do segredo se houver exposição.

`AUTO_PUBLISH=1` permite que artigos gerados sejam publicados diretamente. Para operar com revisão humana, use `AUTO_PUBLISH=0` e publique os rascunhos pelo painel administrativo após conferir texto, fontes, imagem, licença e crédito.
