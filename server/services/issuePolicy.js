const { fail } = require('../utils/http');
const statuses = ['REPORTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'DUPLICATE', 'REJECTED'];
const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const categories = ['ROAD', 'STREETLIGHT', 'WASTE', 'WATER', 'DRAINAGE', 'TRAFFIC', 'ENVIRONMENT', 'ACCIDENT', 'OTHER'];
const terminal = (status) => ['RESOLVED', 'DUPLICATE', 'REJECTED'].includes(status);
const adminTransitions = { REPORTED: ['UNDER_REVIEW', 'DUPLICATE', 'REJECTED'], UNDER_REVIEW: ['IN_PROGRESS', 'REPORTED', 'DUPLICATE', 'REJECTED'], IN_PROGRESS: ['RESOLVED', 'UNDER_REVIEW'] };
const officerTransitions = { REPORTED: ['UNDER_REVIEW'], UNDER_REVIEW: ['IN_PROGRESS'], IN_PROGRESS: ['RESOLVED'] };
function enumValue(value, values, field) {
  if (typeof value !== 'string' || !values.includes(value.toUpperCase())) throw fail(400, `Invalid ${field}.`);
  return value.toUpperCase();
}
function note(value, field) {
  if (typeof value !== 'string' || value.length > 500) throw fail(400, `${field} must be text of at most 500 characters.`);
  return value.trim();
}
function active(issue) { if (terminal(issue.status)) throw fail(409, 'This report is closed.'); }
function checkTransition(issue, next, officer = false) {
  if (next === issue.status) return;
  if (!(officer ? officerTransitions : adminTransitions)[issue.status]?.includes(next)) throw fail(409, 'This status transition is not allowed. Refresh the report.');
}
function filters(query) {
  const result = {};
  for (const [field, values] of [['status', statuses], ['priorityLevel', severities], ['severity', severities], ['category', categories]]) {
    if (query[field] !== undefined && query[field] !== 'ALL') result[field] = enumValue(query[field], values, field);
  }
  if (query.search !== undefined) {
    if (typeof query.search !== 'string' || query.search.length > 100) throw fail(400, 'Search must be text of at most 100 characters.');
    result.search = query.search.trim();
  }
  return result;
}
function filterIssues(issues, filter) {
  return issues.filter((i) => Object.entries(filter).every(([key, value]) => key === 'search'
    ? [i.title, i.description, i.location].some((text) => text.toLowerCase().includes(value.toLowerCase()))
    : i[key] === value)).sort((a, b) => b.priorityScore - a.priorityScore || new Date(a.createdAt) - new Date(b.createdAt) || String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));
}
function publicIssue(issue, userId) { const { adminNotes, adminHistory, supportedBy, ...safe } = issue; if (userId) safe.userSupported = Array.isArray(supportedBy) && supportedBy.includes(Number(userId)); return safe; }
function officerIssue(issue, userId) { return publicIssue(issue, userId); }
module.exports = { statuses, severities, categories, terminal, enumValue, note, active, checkTransition, filters, filterIssues, publicIssue, officerIssue };
