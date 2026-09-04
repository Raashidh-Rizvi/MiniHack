// Explicit additive provisioning. Does not load the project's environment file.
const mongoose = require('mongoose');
const { hashPassword } = require('../utils/passwords');
const User = require('../models/User');
async function main() {
  const { MONGO_URI, PROVISION_EMAIL, PROVISION_PASSWORD, PROVISION_NAME, PROVISION_ROLE = 'ADMIN' } = process.env;
  if (!MONGO_URI || !PROVISION_EMAIL || !PROVISION_PASSWORD || !PROVISION_NAME || !['ADMIN', 'OFFICER'].includes(PROVISION_ROLE)) throw new Error('Set MONGO_URI, PROVISION_EMAIL, PROVISION_PASSWORD, PROVISION_NAME and optional PROVISION_ROLE (ADMIN/OFFICER).');
  if (PROVISION_PASSWORD.length < 8) throw new Error('Use a password of at least 8 characters.');
  await mongoose.connect(MONGO_URI);
  const email = PROVISION_EMAIL.trim().toLowerCase();
  if (await User.findOne({ email })) throw new Error('Account already exists; no changes made.');
  await User.create({ email, fullName: PROVISION_NAME, password: await hashPassword(PROVISION_PASSWORD), role: PROVISION_ROLE });
  console.log('Privileged account created.');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => mongoose.disconnect());
