const crypto = require('crypto');
const memory = require('../models/memoryStore');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');
const users = require('../services/users');
const sessions = require('../services/sessions');
const { hashPassword, verifyPassword } = require('../utils/passwords');
const { fail, handle, body } = require('../utils/http');
const { sendOtpEmail } = require('../services/emailService');
const auditLog = require('../services/auditLog');

/** Extract the real client IP, respecting proxy headers. */
function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.ip || req.connection?.remoteAddress || 'unknown';
}

const emailValue = (value) => {
  if (typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) throw fail(400, 'A valid email is required.');
  return value.trim().toLowerCase();
};

const normalizePhone = (value) => {
  if (typeof value !== 'string') throw fail(400, 'A valid mobile phone number is required.');
  const cleaned = value.replace(/[^\d+]/g, '');
  const digits = cleaned.replace(/\D/g, '');
  let normalized;
  if (digits.startsWith('94') && digits.length === 11) {
    normalized = `+${digits}`;
  } else if (digits.startsWith('0') && digits.length === 10) {
    normalized = `+94${digits.slice(1)}`;
  } else if (digits.length === 9 && digits.startsWith('7')) {
    normalized = `+94${digits}`;
  } else if (digits.length >= 9 && digits.length <= 15) {
    normalized = cleaned.startsWith('+') ? `+${digits}` : `+${digits}`;
  } else {
    throw fail(400, 'Please enter a valid mobile phone number (e.g. 077 123 4567 or +94 77 123 4567).');
  }
  return normalized;
};

// In-memory OTP and verification token stores
const otpStore = new Map();
const verifiedTokens = new Map();

const sendOtp = handle(async (req, res) => {
  const data = body(req);
  let targetEmail = null;
  let targetPhone = null;

  if (data.email) {
    targetEmail = emailValue(data.email);
  } else if (data.phone) {
    targetPhone = normalizePhone(data.phone);
  } else {
    throw fail(400, 'A valid email address is required for verification.');
  }

  // If email verification, check if an account already exists
  if (targetEmail) {
    const existing = await users.byEmail(targetEmail);
    if (existing) {
      throw fail(409, 'An account with this email address already exists. Please sign in.');
    }
  }

  const key = targetEmail ? `email:${targetEmail}` : `phone:${targetPhone}`;
  const existingRecord = otpStore.get(key);
  if (existingRecord && Date.now() - existingRecord.lastSentAt < 15000) {
    const wait = Math.ceil((15000 - (Date.now() - existingRecord.lastSentAt)) / 1000);
    throw fail(429, `Please wait ${wait} seconds before requesting a new OTP.`);
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000;

  otpStore.set(key, {
    otp,
    expiresAt,
    attempts: 0,
    lastSentAt: Date.now(),
    email: targetEmail,
    phone: targetPhone,
  });

  if (targetEmail) {
    await sendOtpEmail(targetEmail, otp);
  } else if (targetPhone) {
    console.log(`[SMS GATEWAY SIMULATOR] Dispatched OTP ${otp} to mobile number ${targetPhone}`);
  }

  res.json({
    success: true,
    message: targetEmail
      ? `Verification code sent to ${targetEmail}`
      : `Verification code sent to ${targetPhone}`,
    email: targetEmail,
    phone: targetPhone,
    otp, // Returned for dev/demo and automated testing convenience
    expiresInSeconds: 600,
  });
});

const verifyOtp = handle(async (req, res) => {
  const data = body(req);
  let targetEmail = null;
  let targetPhone = null;

  if (data.email) {
    targetEmail = emailValue(data.email);
  } else if (data.phone) {
    targetPhone = normalizePhone(data.phone);
  } else {
    throw fail(400, 'A valid email address is required for verification.');
  }

  const code = typeof data.otp === 'string' ? data.otp.trim() : String(data.otp || '').trim();
  if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
    throw fail(400, 'Please enter a valid 6-digit verification code.');
  }

  const key = targetEmail ? `email:${targetEmail}` : `phone:${targetPhone}`;
  const record = otpStore.get(key);
  if (!record) {
    throw fail(400, 'No verification code requested or the code has expired. Please request a new code.');
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(key);
    throw fail(400, 'Verification code has expired. Please request a new code.');
  }

  record.attempts = (record.attempts || 0) + 1;
  if (record.attempts > 5) {
    otpStore.delete(key);
    throw fail(400, 'Too many incorrect attempts. Please request a new verification code.');
  }

  if (record.otp !== code) {
    throw fail(400, 'Invalid verification code. Please check your email and try again.');
  }

  otpStore.delete(key);
  const verificationToken = crypto.randomBytes(24).toString('hex');
  verifiedTokens.set(verificationToken, {
    email: targetEmail,
    phone: targetPhone,
    expiresAt: Date.now() + 15 * 60 * 1000,
  });

  res.json({
    success: true,
    message: targetEmail ? 'Email address verified successfully.' : 'Mobile number verified successfully.',
    email: targetEmail,
    phone: targetPhone,
    verificationToken,
  });
});

const loginUser = handle(async (req, res) => {
  const data = body(req);
  const ip = clientIp(req);
  const userAgent = req.headers['user-agent'] || 'unknown';
  let email;
  try { email = emailValue(data.email); } catch (e) { throw e; }

  const user = await users.byEmail(email);

  // Record failed attempt — user not found
  if (!user) {
    auditLog.addEntry({
      timestamp: new Date().toISOString(),
      ip,
      userAgent,
      email,
      userId: null,
      fullName: null,
      role: null,
      success: false,
      failReason: 'user_not_found',
    });
    throw fail(401, 'Invalid email or password.');
  }

  const passwordOk = await verifyPassword(data.password, user.password);

  // Record failed attempt — wrong password
  if (!passwordOk) {
    auditLog.addEntry({
      timestamp: new Date().toISOString(),
      ip,
      userAgent,
      email,
      userId: user.numericId || user.id || null,
      fullName: user.fullName || null,
      role: user.role || null,
      success: false,
      failReason: 'bad_password',
    });
    throw fail(401, 'Invalid email or password.');
  }

  // Upgrade legacy password hash if needed
  if (!user.password.startsWith('scrypt:')) await users.savePassword(user, await hashPassword(data.password));

  // Record successful login
  auditLog.addEntry({
    timestamp: new Date().toISOString(),
    ip,
    userAgent,
    email,
    userId: user.numericId || user.id || null,
    fullName: user.fullName || null,
    role: user.role || null,
    success: true,
    failReason: null,
  });

  res.json({ success: true, data: users.safeUser(user), token: sessions.issue(user) });
});

const registerUser = handle(async (req, res) => {
  const data = body(req); const email = emailValue(data.email);
  if (data.role !== undefined && !['CITIZEN', 'RESIDENT'].includes(data.role)) throw fail(403, 'Officer and administrator accounts require controlled provisioning.');
  if (typeof data.fullName !== 'string' || data.fullName.trim().length < 3 || data.fullName.length > 100) throw fail(400, 'Name must be 3-100 characters.');
  if (typeof data.password !== 'string' || data.password.length < 6 || data.password.length > 128) throw fail(400, 'Password must be 6-128 characters.');
  if (data.communityArea !== undefined && (typeof data.communityArea !== 'string' || data.communityArea.length > 120)) throw fail(400, 'Invalid community area.');
  if (await users.byEmail(email)) throw fail(409, 'An account with this email already exists.');

  let isEmailVerified = false;
  if (data.verificationToken) {
    const tokenRecord = verifiedTokens.get(data.verificationToken);
    if (tokenRecord && (tokenRecord.email === email || (tokenRecord.phone && data.phone && tokenRecord.phone === data.phone)) && Date.now() <= tokenRecord.expiresAt) {
      isEmailVerified = true;
      verifiedTokens.delete(data.verificationToken);
    }
  } else if (data.otp) {
    const otpRecord = otpStore.get(`email:${email}`) || (data.phone && otpStore.get(`phone:${data.phone}`));
    if (otpRecord && otpRecord.otp === String(data.otp).trim() && Date.now() <= otpRecord.expiresAt) {
      isEmailVerified = true;
      otpStore.delete(`email:${email}`);
    }
  }

  if (!isEmailVerified && process.env.NODE_ENV !== 'test') {
    throw fail(400, 'Email address must be verified via OTP before registration.');
  }

  let phone = null;
  if (data.phone && String(data.phone).trim()) {
    phone = String(data.phone).trim();
  }

  const fields = {
    email,
    fullName: data.fullName.trim(),
    phone,
    phoneVerified: false,
    emailVerified: Boolean(isEmailVerified || process.env.NODE_ENV === 'test'),
    password: await hashPassword(data.password),
    role: 'CITIZEN',
    communityArea: data.communityArea?.trim() || 'Matale Town',
  };
  const user = await users.createUser(fields);
  res.status(201).json({ success: true, data: users.safeUser(user), token: sessions.issue(user) });
});

const getDemoUsers = handle(async (req, res) => {
  // Public reads never provision accounts or enumerate real database users.
  res.json({ success: true, data: getIsConnected() ? [] : memory.getDemoUsers().map(users.safeUser) });
});

const me = handle(async (req, res) => res.json({ success: true, data: req.user }));
const logout = handle(async (req, res) => { sessions.revoke(req.token); res.json({ success: true }); });

module.exports = { loginUser, registerUser, sendOtp, verifyOtp, getDemoUsers, me, logout };