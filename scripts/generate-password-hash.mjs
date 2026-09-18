import { randomBytes, pbkdf2Sync } from 'node:crypto';
import { readFileSync } from 'node:fs';

const password = process.argv[2] || readFileSync(0, 'utf8').trim();
if (!password) {
  console.error('Uso: printf "%s" "sua senha" | node scripts/generate-password-hash.mjs');
  process.exit(1);
}

const iterations = 10000;
const salt = randomBytes(16);
const hash = pbkdf2Sync(password, salt, iterations, 32, 'sha256');
const encode = (value) => value.toString('base64url');
console.log(`pbkdf2$${iterations}$${encode(salt)}$${encode(hash)}`);
