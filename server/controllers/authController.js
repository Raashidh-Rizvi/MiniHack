const memory = require('../models/memoryStore');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');
const users = require('../services/users');
const sessions = require('../services/sessions');
const { hashPassword, verifyPassword } = require('../utils/passwords');
const { fail, handle, body } = require('../utils/http');
const emailValue = (value) => {
  if (typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) throw fail(400, 'A valid email is required.');
  return value.trim().toLowerCase();
};
const loginUser = handle(async (req, res) => {
  const data = body(req); const email = emailValue(data.email);
  const user = await users.byEmail(email);
  if (!user || !(await verifyPassword(data.password, user.password))) throw fail(401, 'Invalid email or password.');
  if (!user.password.startsWith('scrypt:')) await users.savePassword(user, await hashPassword(data.password));
  res.json({ success: true, data: users.safeUser(user), token: sessions.issue(user) });
});
const registerUser = handle(async (req, res) => {
  const data = body(req); const email = emailValue(data.email);
  if (data.role !== undefined && !['CITIZEN', 'RESIDENT'].includes(data.role)) throw fail(403, 'Officer and administrator accounts require controlled provisioning.');
  if (typeof data.fullName !== 'string' || data.fullName.trim().length < 3 || data.fullName.length > 100) throw fail(400, 'Name must be 3-100 characters.');
  if (typeof data.password !== 'string' || data.password.length < 6 || data.password.length > 128) throw fail(400, 'Password must be 6-128 characters.');
  if (data.communityArea !== undefined && (typeof data.communityArea !== 'string' || data.communityArea.length > 120)) throw fail(400, 'Invalid community area.');
  if (await users.byEmail(email)) throw fail(409, 'An account with this email already exists.');
  const fields = { email, fullName: data.fullName.trim(), password: await hashPassword(data.password), role: 'CITIZEN', communityArea: data.communityArea?.trim() || 'Matale Town' };
  const user = getIsConnected() ? await User.create(fields) : memory.createUser(fields);
  res.status(201).json({ success: true, data: users.safeUser(user), token: sessions.issue(user) });
});
const getDemoUsers = handle(async (req, res) => {
  // Public reads never provision accounts or enumerate real database users.
  res.json({ success: true, data: getIsConnected() ? [] : memory.getDemoUsers().map(users.safeUser) });
});
const me = handle(async (req, res) => res.json({ success: true, data: req.user }));
const logout = handle(async (req, res) => { sessions.revoke(req.token); res.json({ success: true }); });
module.exports = { loginUser, registerUser, getDemoUsers, me, logout };