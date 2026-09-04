const Issue = require('../models/Issue');
const memory = require('../models/memoryStore');
const { getIsConnected } = require('../config/db');
const { fail } = require('../utils/http');
const plain = (doc) => doc?.toJSON ? doc.toJSON() : doc;
function selector(id) {
  if (/^[1-9]\d*$/.test(String(id)) && Number.isSafeInteger(Number(id))) return { numericId: Number(id) };
  if (/^[a-f\d]{24}$/i.test(String(id))) return { _id: id };
  throw fail(400, 'Invalid issue ID.');
}
async function get(id) {
  const query = selector(id);
  const issue = getIsConnected() ? plain(await Issue.findOne(query)) : memory.getIssueById(id);
  if (!issue) throw fail(404, 'Issue not found.');
  return issue;
}
async function all() { return getIsConnected() ? (await Issue.find()).map(plain) : memory.getAllIssues(); }
function expected(issue, version) {
  if (version !== undefined && (typeof version !== 'string' || !Number.isFinite(Date.parse(version)))) throw fail(400, 'Invalid expectedUpdatedAt.');
  if (version !== undefined && new Date(issue.updatedAt).getTime() !== Date.parse(version)) throw fail(409, 'This report changed. Refresh before saving.');
}
function condition(issue) {
  return { ...selector(issue.id), updatedAt: issue.updatedAt ? new Date(issue.updatedAt) : { $exists: false }, status: issue.status, assignedOfficer: issue.assignedOfficer ?? null };
}
async function save(issue, changes, version, event) {
  expected(issue, version);
  // Monotonic timestamps permit conflict detection even for same-millisecond writes.
  const updatedAt = new Date(Math.max(Date.now(), new Date(issue.updatedAt || 0).getTime() + 1));
  if (getIsConnected()) {
    const update = { $set: { ...changes, updatedAt } };
    if (event) update.$push = { adminHistory: event };
    const saved = await Issue.findOneAndUpdate(condition(issue), update, { new: true, runValidators: true, timestamps: false });
    if (!saved) throw fail(409, 'This report changed. Refresh before saving.');
    return plain(saved);
  }
  const current = memory.getIssueById(issue.id);
  if (!current || current.updatedAt !== issue.updatedAt || current.status !== issue.status || current.assignedOfficer !== issue.assignedOfficer) throw fail(409, 'This report changed. Refresh before saving.');
  const saved = memory.updateIssue(issue.id, changes);
  saved.updatedAt = updatedAt.toISOString();
  if (event) saved.adminHistory = [...(current.adminHistory || []), event];
  return saved;
}
async function remove(issue, version) {
  expected(issue, version);
  if (getIsConnected()) {
    if (!(await Issue.findOneAndDelete(condition(issue)))) throw fail(409, 'This report changed. Refresh before deleting.');
  } else {
    const current = memory.getIssueById(issue.id);
    if (!current || current.updatedAt !== issue.updatedAt) throw fail(409, 'This report changed. Refresh before deleting.');
    memory.deleteIssue(issue.id);
  }
}
module.exports = { get, all, save, remove, expected };
