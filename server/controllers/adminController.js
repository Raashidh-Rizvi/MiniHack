const { randomUUID } = require('node:crypto');
const store = require('../services/issueStore');
const policy = require('../services/issuePolicy');
const users = require('../services/users');
const { calculatePriority } = require('../utils/priorityCalculator');
const { hashPassword } = require('../utils/passwords');
const { fail, handle, body } = require('../utils/http');
const auditLog = require('../services/auditLog');
function stats(issues) {
  return { totalIssues: issues.length, openIssues: issues.filter(i => ['REPORTED', 'UNDER_REVIEW'].includes(i.status)).length,
    inProgressIssues: issues.filter(i => i.status === 'IN_PROGRESS').length, criticalIssues: issues.filter(i => i.priorityLevel === 'CRITICAL').length,
    resolvedIssues: issues.filter(i => i.status === 'RESOLVED').length };
}
function event(req, type, issue, changes, note) {
  const before = {}; const after = {};
  for (const [key, value] of Object.entries(changes)) if (issue[key] !== value) { before[key] = issue[key] ?? null; after[key] = value; }
  if (!Object.keys(after).length) return undefined;
  return { id: randomUUID(), type, timestamp: new Date().toISOString(), actorId: req.user.id, actorName: req.user.fullName, actorRole: req.user.role, before, after, note };
}
const getAdminStats = handle(async (req, res) => res.json({ success: true, data: stats(await store.all()) }));
const getPriorityQueue = handle(async (req, res) => {
  const data = policy.filterIssues(await store.all(), policy.filters(req.query)).map(({ adminHistory, ...issue }) => issue);
  res.json({ success: true, count: data.length, data });
});
const updateIssueStatus = handle(async (req, res) => {
  const data = body(req); const issue = await store.get(req.params.id); store.expected(issue, data.expectedUpdatedAt);
  const changes = {};
  if (data.newStatus !== undefined) { changes.status = policy.enumValue(data.newStatus, policy.statuses, 'status'); policy.checkTransition(issue, changes.status); }
  if (data.adminNotes !== undefined) changes.adminNotes = policy.note(data.adminNotes, 'Admin notes');
  if (data.adjustedSeverity !== undefined) {
    changes.severity = policy.enumValue(data.adjustedSeverity, policy.severities, 'severity');
    policy.active(issue);
    Object.assign(changes, calculatePriority(changes.severity, issue.peopleAffected, null, issue.createdAt));
  }
  if (!Object.keys(changes).length) throw fail(400, 'Provide a status, note, or severity change.');
  const backwards = (issue.status === 'UNDER_REVIEW' && changes.status === 'REPORTED') || (issue.status === 'IN_PROGRESS' && changes.status === 'UNDER_REVIEW');
  if ((backwards || ['DUPLICATE', 'REJECTED'].includes(changes.status) || (changes.severity && changes.severity !== issue.severity)) && !changes.adminNotes) throw fail(400, 'A reason is required for this change.');
  const history = event(req, 'UPDATE', issue, changes, changes.adminNotes);
  const saved = history ? await store.save(issue, changes, data.expectedUpdatedAt, history) : issue;
  res.json({ success: true, data: saved, message: 'Report updated.' });
});
const reassignOfficer = handle(async (req, res) => {
  const data = body(req); const issue = await store.get(req.params.id); policy.active(issue); store.expected(issue, data.expectedUpdatedAt);
  if (!['number', 'string'].includes(typeof data.officerId) || !/^[1-9]\d*$/.test(String(data.officerId)) || !Number.isSafeInteger(Number(data.officerId))) throw fail(400, 'A valid officer ID is required.');
  const officer = await users.byId(data.officerId);
  if (!officer || officer.role !== 'OFFICER') throw fail(400, 'Select an existing officer.');
  const changes = { assignedOfficer: Number(data.officerId), assignedOfficerName: officer.fullName };
  const history = event(req, 'ASSIGNMENT', issue, changes);
  res.json({ success: true, data: history ? await store.save(issue, changes, data.expectedUpdatedAt, history) : issue });
});
const recalculatePriority = handle(async (req, res) => {
  const data = req.body === undefined ? {} : body(req); const issue = await store.get(req.params.id); policy.active(issue); store.expected(issue, data.expectedUpdatedAt);
  const changes = calculatePriority(issue.severity, issue.peopleAffected, null, issue.createdAt);
  const history = event(req, 'PRIORITY', issue, changes);
  if (history) await store.save(issue, changes, data.expectedUpdatedAt, history);
  res.json({ success: true, data: changes });
});
const moderateDeleteIssue = handle(async (req, res) => {
  const issue = await store.get(req.params.id); await store.remove(issue, req.body?.expectedUpdatedAt);
  res.json({ success: true, message: 'Issue removed.' });
});
const getHistory = handle(async (req, res) => res.json({ success: true, data: (await store.get(req.params.id)).adminHistory || [] }));

const createOfficer = handle(async (req, res) => {
  const data = body(req);
  if (typeof data.fullName !== 'string' || data.fullName.trim().length < 3 || data.fullName.length > 100) {
    throw fail(400, 'Officer name must be 3-100 characters.');
  }
  if (typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    throw fail(400, 'A valid officer email address is required.');
  }
  const email = data.email.trim().toLowerCase();
  if (typeof data.password !== 'string' || data.password.length < 6 || data.password.length > 128) {
    throw fail(400, 'Password must be 6-128 characters.');
  }
  if (data.communityArea !== undefined && (typeof data.communityArea !== 'string' || data.communityArea.length > 120)) {
    throw fail(400, 'Invalid community area.');
  }
  if (await users.byEmail(email)) {
    throw fail(409, 'An account with this email already exists.');
  }

  const officerFields = {
    email,
    fullName: data.fullName.trim(),
    phone: data.phone ? String(data.phone).trim() : null,
    phoneVerified: Boolean(data.phone),
    password: await hashPassword(data.password),
    role: 'OFFICER',
    communityArea: data.communityArea?.trim() || 'Matale Municipal Council',
  };

  const officer = await users.createUser(officerFields);
  res.status(201).json({
    success: true,
    message: 'Municipal officer account provisioned successfully.',
    data: users.safeUser(officer),
  });
});

const getLoginAuditLog = handle(async (req, res) => {
  const { email, success, from, to, page, limit } = req.query;
  const result = auditLog.getEntries({ email, success, from, to, page, limit });
  res.json({ success: true, ...result });
});

const getAllUsers = handle(async (req, res) => {
  const User = require('../models/User');
  const memory = require('../models/memoryStore');
  const { getIsConnected } = require('../config/db');
  let list;
  if (getIsConnected()) {
    list = await User.find({}).sort({ createdAt: -1 }).lean();
    list = list.map(u => ({
      id: u.numericId || u._id,
      numericId: u.numericId,
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      communityArea: u.communityArea,
      phone: u.phone || null,
      phoneVerified: Boolean(u.phoneVerified),
      emailVerified: Boolean(u.emailVerified),
      createdAt: u.createdAt,
    }));
  } else {
    list = memory.getUsers ? memory.getUsers().map(users.safeUser) : [];
  }
  res.json({ success: true, count: list.length, data: list });
});

module.exports = {
  getAdminStats,
  getPriorityQueue,
  updateIssueStatus,
  reassignOfficer,
  recalculatePriority,
  moderateDeleteIssue,
  getHistory,
  stats,
  createOfficer,
  getLoginAuditLog,
  getAllUsers,
};