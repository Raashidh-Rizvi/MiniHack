const Issue = require('../models/Issue');
const memory = require('../models/memoryStore');
const { getIsConnected } = require('../config/db');
const store = require('../services/issueStore');
const policy = require('../services/issuePolicy');
const { calculatePriority } = require('../utils/priorityCalculator');
const { handle, fail, body } = require('../utils/http');

function fields(data, create = false) {
  const result = {};
  const errors = [];
  for (const [key, min, max] of [['title', 5, 100], ['description', 10, 1000], ['location', 3, 120]]) {
    if (create || data[key] !== undefined) {
      if (typeof data[key] !== 'string' || data[key].trim().length < min || data[key].trim().length > max) {
        errors.push({ field: key, message: `${key} must be ${min}-${max} characters.` });
      } else {
        result[key] = data[key].trim();
      }
    }
  }
  if (errors.length) throw fail(400, errors[0].message, errors);
  if (create) result.category = policy.enumValue(data.category, policy.categories, 'category');
  if (create || data.severity !== undefined) result.severity = policy.enumValue(data.severity ?? 'MEDIUM', policy.severities, 'severity');
  if (create || data.peopleAffected !== undefined) {
    const value = data.peopleAffected ?? 10;
    if (!['number', 'string'].includes(typeof value) || !Number.isSafeInteger(Number(value)) || Number(value) < 1) throw fail(400, 'People affected must be a positive integer.');
    result.peopleAffected = Number(value);
  }
  if (data.latitude !== undefined && data.latitude !== null && data.latitude !== '') {
    const lat = Number(data.latitude);
    if (!isNaN(lat) && lat >= -90 && lat <= 90) result.latitude = lat;
  }
  if (data.longitude !== undefined && data.longitude !== null && data.longitude !== '') {
    const lng = Number(data.longitude);
    if (!isNaN(lng) && lng >= -180 && lng <= 180) result.longitude = lng;
  }
  return result;
}

function own(req, issue) {
  if (issue.reportedBy !== Number(req.user.id)) throw fail(403, 'You can manage only your own reports.');
}

const createIssue = handle(async (req, res) => {
  const data = fields(body(req), true);
  const createdAt = new Date();
  Object.assign(data, { reportedBy: Number(req.user.id), reportedByName: req.user.fullName });
  const issue = getIsConnected()
    ? (await Issue.create({
        ...data,
        ...calculatePriority(data.severity, data.peopleAffected, null, createdAt),
        createdAt,
        status: 'REPORTED',
        assignedOfficer: 2,
        assignedOfficerName: 'Eng. Bandara',
      })).toJSON()
    : memory.createIssue(data);
  res.status(201).json({ success: true, data: policy.publicIssue(issue, req.user?.id) });
});

const getMyReports = handle(async (req, res) => {
  const data = (await store.all())
    .filter((i) => i.reportedBy === Number(req.user.id))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((i) => policy.publicIssue(i, req.user?.id));
  res.json({ success: true, count: data.length, data });
});

const getCitizenStats = handle(async (req, res) => {
  const issues = (await store.all()).filter((i) => i.reportedBy === Number(req.user.id));
  res.json({
    success: true,
    data: {
      total: issues.length,
      open: issues.filter((i) => ['REPORTED', 'UNDER_REVIEW'].includes(i.status)).length,
      inProgress: issues.filter((i) => i.status === 'IN_PROGRESS').length,
      resolved: issues.filter((i) => i.status === 'RESOLVED').length,
    },
  });
});

const supportIssue = handle(async (req, res) => {
  const issue = await store.get(req.params.id);
  const userId = Number(req.user.id);
  const supportedBy = Array.isArray(issue.supportedBy) ? [...issue.supportedBy] : [];
  if (!supportedBy.includes(userId)) {
    supportedBy.push(userId);
    const updated = await store.save(issue, { supportedBy, supportCount: (issue.supportCount || 0) + 1 });
    return res.json({ success: true, supportCount: updated.supportCount, userSupported: true });
  }
  res.json({ success: true, supportCount: issue.supportCount || 0, userSupported: true });
});

const unsupportIssue = handle(async (req, res) => {
  const issue = await store.get(req.params.id);
  const userId = Number(req.user.id);
  const supportedBy = Array.isArray(issue.supportedBy) ? [...issue.supportedBy] : [];
  const index = supportedBy.indexOf(userId);
  if (index !== -1) {
    supportedBy.splice(index, 1);
    const updated = await store.save(issue, { supportedBy, supportCount: Math.max(0, (issue.supportCount || 1) - 1) });
    return res.json({ success: true, supportCount: updated.supportCount, userSupported: false });
  }
  res.json({ success: true, supportCount: issue.supportCount || 0, userSupported: false });
});

const updateIssue = handle(async (req, res) => {
  const data = body(req);
  const issue = await store.get(req.params.id);
  own(req, issue);
  policy.active(issue);
  const changes = fields(data);
  if (!Object.keys(changes).length) throw fail(400, 'Provide editable report details.');
  Object.assign(changes, calculatePriority(changes.severity || issue.severity, changes.peopleAffected || issue.peopleAffected, null, issue.createdAt));
  res.json({ success: true, data: policy.publicIssue(await store.save(issue, changes, data.expectedUpdatedAt), req.user?.id) });
});

const cancelIssue = handle(async (req, res) => {
  const issue = await store.get(req.params.id);
  own(req, issue);
  policy.active(issue);
  await store.remove(issue, req.body?.expectedUpdatedAt);
  res.json({ success: true, message: 'Report cancelled.' });
});

const getAllIssues = handle(async (req, res) => {
  const userId = req.user?.id;
  const data = policy.filterIssues(await store.all(), policy.filters(req.query)).map((i) => policy.publicIssue(i, userId));
  if (req.query.sortBy === 'recent') data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (req.query.sortBy === 'support') data.sort((a, b) => b.supportCount - a.supportCount);
  res.json({ success: true, count: data.length, data });
});

const getIssueById = handle(async (req, res) => {
  const userId = req.user?.id;
  res.json({ success: true, data: policy.publicIssue(await store.get(req.params.id), userId) });
});

const estimatePriority = handle(async (req, res) => {
  const data = body(req);
  const severity = policy.enumValue(data.severity ?? 'MEDIUM', policy.severities, 'severity');
  const count = Number(data.peopleAffected ?? 10);
  if (!['number', 'string'].includes(typeof (data.peopleAffected ?? 10)) || !Number.isSafeInteger(count) || count < 1) {
    throw fail(400, 'People affected must be a positive integer.');
  }
  const urgency = data.urgency ? policy.enumValue(data.urgency, policy.severities, 'urgency') : null;
  const result = calculatePriority(severity, count, urgency, data.createdAt ? new Date(data.createdAt) : null);

  const sevPoints = { LOW: 25, MEDIUM: 50, HIGH: 75, CRITICAL: 100 };
  const sevScore = sevPoints[severity] || 50;
  let popScore = 20;
  if (count > 300) popScore = 100;
  else if (count >= 151) popScore = 85;
  else if (count >= 51) popScore = 70;
  else if (count >= 11) popScore = 45;
  const urgScore = sevPoints[(urgency || severity).toUpperCase()] || sevScore;
  const ageScore = 15;

  res.json({
    success: true,
    data: {
      ...result,
      breakdown: {
        severityScore: Math.round(sevScore * 0.4),
        impactScore: Math.round(popScore * 0.3),
        urgencyScore: Math.round(urgScore * 0.2),
        ageScore: Math.round(ageScore * 0.1),
        raw: {
          severity: sevScore,
          peopleAffected: popScore,
          urgency: urgScore,
          age: ageScore,
        },
      },
    },
  });
});

module.exports = {
  createIssue,
  getMyReports,
  getCitizenStats,
  supportIssue,
  unsupportIssue,
  updateIssue,
  cancelIssue,
  getAllIssues,
  getIssueById,
  estimatePriority,
};