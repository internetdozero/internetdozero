const encoder = new TextEncoder();
const ITERATIONS = 120000;

function encode(bytes) {
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decode(value) {
  const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function equal(left, right) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) result |= left[index] ^ right[index];
  return result === 0;
}

export async function verifyPassword(password, encoded) {
  const normalized = typeof encoded === 'string' ? encoded.trim() : '';
  if (!password || !normalized.startsWith('pbkdf2$')) return false;
  const [, iterations, saltText, hashText] = normalized.split('$');
  if (!Number.isInteger(Number(iterations)) || Number(iterations) < 100000 || !saltText || !hashText) return false;
  let salt;
  let expected;
  try { salt = decode(saltText); expected = decode(hashText); } catch (_) { return false; }
  if (salt.length < 16 || expected.length < 32) return false;
  try {
    const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: Number(iterations), hash: 'SHA-256' }, key, expected.length * 8);
    return equal(new Uint8Array(bits), expected);
  } catch (_) {
    return false;
  }
}

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' }, key, 256);
  return `pbkdf2$${ITERATIONS}$${encode(salt)}$${encode(new Uint8Array(bits))}`;
}
