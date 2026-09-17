# Segurança de publicação

## Configuração do administrador

Gere um hash para produção sem expor a senha na linha de comando:

```bash
printf '%s' 'uma senha forte' | node scripts/generate-password-hash.mjs
```

Configure o resultado como `ADMIN_PASSWORD_HASH` e mantenha
`ALLOW_PLAINTEXT_ADMIN_PASSWORD=false`. `ADMIN_PASSWORD` simples só deve ser
usado no desenvolvimento local, com a flag explicitamente habilitada.

## Cloudflare WAF

Crie regras de rate limiting para `POST /api/auth/login` e `POST /api/comments`,
limitando por IP e aumentando o bloqueio progressivamente. O código mantém um
limite defensivo por isolate; a regra Cloudflare é a proteção distribuída de
produção.

## Banco e migrações

Aplicar as migrações em ordem é obrigatório:

```bash
npx wrangler d1 migrations apply internetdozero --local
npx wrangler d1 migrations apply internetdozero --remote
```

A migração de comentários é expansiva e preserva a coluna JSON antiga. Só a
remoção dessa coluna deve acontecer após verificar a migração em produção.

A migração `0003` adiciona revogação server-side de sessões no logout.
