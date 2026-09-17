import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from '../functions/_lib/password.js';

describe('password verification', () => {
  it('accepts a generated hash and rejects empty hashes', async () => {
    const hash = await hashPassword('correct horse battery staple');
    await expect(verifyPassword('correct horse battery staple', hash)).resolves.toBe(true);
    await expect(verifyPassword('anything', 'pbkdf2$120000$$')).resolves.toBe(false);
    await expect(verifyPassword('anything', 'pbkdf2$120000$YWJj$')).resolves.toBe(false);
  });
});
