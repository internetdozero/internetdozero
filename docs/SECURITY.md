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
