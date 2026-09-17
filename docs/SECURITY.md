# Segurança de publicação

## Configuração do administrador

Gere um hash para produção:

```bash
node scripts/generate-password-hash.mjs "uma senha forte"
```

Configure o resultado como `ADMIN_PASSWORD_HASH` e mantenha
`ALLOW_PLAINTEXT_ADMIN_PASSWORD=false`. `ADMIN_PASSWORD` simples só deve ser
usado no desenvolvimento local, com a flag explicitamente habilitada.

## Cloudflare WAF

Crie regras de rate limiting para `POST /api/auth/login` e para as mutações
de `/api/admin/*`. Um ponto de partida é limitar tentativas por IP e aumentar
o bloqueio progressivamente; ajuste os valores depois de observar o tráfego.

## Banco e migrações

Aplicar as migrações em ordem é obrigatório:

```bash
npx wrangler d1 migrations apply internetdozero --local
npx wrangler d1 migrations apply internetdozero --remote
```

A migração de comentários é expansiva e preserva a coluna JSON antiga. Só a
remoção dessa coluna deve acontecer após verificar a migração em produção.
