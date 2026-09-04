const Issue = require('../models/Issue');
const memory = require('../models/memoryStore');
const { getIsConnected } = require('../config/db');
const store = require('../services/issueStore');
const policy = require('../services/issuePolicy');
const { calculatePriority } = require('../utils/priorityCalculator');
const { handle, fail, body } = require('../utils/http');
function fields(data, create = false) {
  const result = {};
  for (const [key, min, max] of [['title', 5, 100], ['description', 10, 1000], ['location', 3, 120]]) {
    if (create || data[key] !== undefined) {
      if (typeof data[key] !== 'string' || data[key].trim().length < min || data[key].trim().length > max) throw fail(400, key + ' must be ' + min + '-' + max + ' characters.');
      result[key] = data[key].trim();
    }
  }
  if (create) result.category = policy.enumValue(data.category, policy.categories, 'category');
  if (create || data.severity !== undefined) result.severity = policy.enumValue(data.severity ?? 'MEDIUM', policy.severities, 'severity');
  if (create || data.peopleAffected !== undefined) {
    const value = data.peopleAffected ?? 10;
    if (!['number', 'string'].includes(typeof value) || !Number.isSafeInteger(Number(value)) || Number(value) < 1) throw fail(400, 'People affected must be a positive integer.');
    result.peopleAffected = Number(value);
  }
  return result;
}
function own(req, issue) { if (issue.reportedBy !== Number(req.user.id)) throw fail(403, 'You can manage only your own reports.'); }
const createIssue = handle(async (req, res) => {
  const data = fields(body(req), true); const createdAt = new Date();
  Object.assign(data, { reportedBy: Number(req.user.id), reportedByName: req.user.fullName });
  const issue = getIsConnected() ? (await Issue.create({ ...data, ...calculatePriority(data.severity, data.peopleAffected, null, createdAt), createdAt,
    status: 'REPORTED', assignedOfficer: 2, assignedOfficerName: 'Eng. Bandara' })).toJSON() : memory.createIssue(data);
  res.status(201).json({ success: true, data: policy.publicIssue(issue) });
});
const getMyReports = handle(async (req, res) => {
  const data = (await store.all()).filter(i => i.reportedBy === Number(req.user.id)).sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).map(policy.publicIssue);
  res.json({ success: true, count: data.length, data });
});
const updateIssue = handle(async (req, res) => {
  const data = body(req); const issue = await store.get(req.params.id); own(req, issue); policy.active(issue);
  const changes = fields(data);
  if (!Object.keys(changes).length) throw fail(400, 'Provide editable report details.');
  Object.assign(changes, calculatePriority(changes.severity || issue.severity, changes.peopleAffected || issue.peopleAffected, null, issue.createdAt));
  res.json({ success: true, data: policy.publicIssue(await store.save(issue, changes, data.expectedUpdatedAt)) });
});
const cancelIssue = handle(async (req, res) => {
  const issue = await store.get(req.params.id); own(req, issue); policy.active(issue); await store.remove(issue, req.body?.expectedUpdatedAt);
  res.json({ success: true, message: 'Report cancelled.' });
});
const getAllIssues = handle(async (req, res) => {
  const data = policy.filterIssues(await store.all(), policy.filters(req.query)).map(policy.publicIssue);
  if (req.query.sortBy === 'recent') data.sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt));
  if (req.query.sortBy === 'support') data.sort((a,b) => b.supportCount-a.supportCount);
  res.json({ success: true, count: data.length, data });
});
const getIssueById = handle(async (req, res) => res.json({ success: true, data: policy.publicIssue(await store.get(req.params.id)) }));
module.exports = { createIssue, getMyReports, updateIssue, cancelIssue, getAllIssues, getIssueById };