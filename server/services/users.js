const User = require('../models/User');
const memory = require('../models/memoryStore');
const { getIsConnected } = require('../config/db');
function safeUser(user) {
  const value = user.toJSON ? user.toJSON() : user;
  return { id: value.numericId || value.id, numericId: value.numericId || value.id, fullName: value.fullName,
    email: value.email, role: value.role, communityArea: value.communityArea, phone: value.phone || null, phoneVerified: Boolean(value.phoneVerified), emailVerified: Boolean(value.emailVerified) };
}
async function byId(id) {
  if (!getIsConnected()) return memory.findUserById(id);
  if (/^[1-9]\d*$/.test(String(id))) return User.findOne({ numericId: Number(id) });
  if (/^[a-f\d]{24}$/i.test(String(id))) return User.findById(id);
  return null;
}
async function byEmail(email) { return getIsConnected() ? User.findOne({ email }) : memory.findUserByEmail(email); }
async function byPhone(phone) { return getIsConnected() ? User.findOne({ phone }) : memory.findUserByPhone(phone); }
async function savePassword(user, password) {
  user.password = password;
  if (getIsConnected()) await user.save();
}
async function officers() {
  const list = getIsConnected() ? await User.find({ role: 'OFFICER' }) : memory.getOfficers();
  return list.map(safeUser);
}
async function createUser(fields) {
  return getIsConnected() ? User.create(fields) : memory.createUser(fields);
}
module.exports = { safeUser, byId, byEmail, byPhone, savePassword, officers, createUser };
