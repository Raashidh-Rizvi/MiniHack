const { randomBytes, createHash } = require('node:crypto');
const { getIsConnected } = require('../config/db');
const users = require('./users');
const registry = new Map();
const digest = (token) => createHash('sha256').update(token).digest('hex');
const mode = () => getIsConnected() ? 'mongo' : 'memory';
function issue(user, now = Date.now()) {
  for (const [key, session] of registry) if (session.expiresAt <= now) registry.delete(key);
  const token = randomBytes(32).toString('hex');
  registry.set(digest(token), { userId: users.safeUser(user).id, storage: mode(), createdAt: now, expiresAt: now + 8 * 60 * 60 * 1000 });
  return token;
}
async function resolve(token, now = Date.now()) {
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) return null;
  const key = digest(token); const session = registry.get(key);
  if (!session || session.expiresAt <= now || session.storage !== mode()) { registry.delete(key); return null; }
  const user = await users.byId(session.userId);
  return user ? users.safeUser(user) : null;
}
function revoke(token) { if (typeof token === 'string') registry.delete(digest(token)); }
module.exports = { issue, resolve, revoke };
