const { randomBytes, scrypt, timingSafeEqual } = require('node:crypto');
const { promisify } = require('node:util');
const derive = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = await derive(password, salt, 64);
  return `scrypt:${salt}:${hash.toString('hex')}`;
}
async function verifyPassword(password, saved) {
  if (typeof password !== 'string' || !password || typeof saved !== 'string' || !saved) return false;
  if (!saved.startsWith('scrypt:')) {
    const a = Buffer.from(password); const b = Buffer.from(saved);
    return a.length === b.length && timingSafeEqual(a, b);
  }
  const [, salt, hash] = saved.split(':');
  if (!salt || !/^[a-f0-9]{128}$/.test(hash || '')) return false;
  return timingSafeEqual(await derive(password, salt, 64), Buffer.from(hash, 'hex'));
}
module.exports = { hashPassword, verifyPassword };
