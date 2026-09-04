const store = require('../services/issueStore');
const policy = require('../services/issuePolicy');
const users = require('../services/users');
const { stats } = require('./adminController');
const { handle, fail, body } = require('../utils/http');
const mine = async (req) => (await store.all()).filter(i => i.assignedOfficer === Number(req.user.id));
const getMyQueue = handle(async (req, res) => {
  const data = policy.filterIssues(await mine(req), policy.filters(req.query)).map(policy.officerIssue);
  res.json({ success: true, count: data.length, data });
});
const getOfficerStats = handle(async (req, res) => res.json({ success: true, data: stats(await mine(req)) }));
const getOfficerList = handle(async (req, res) => res.json({ success: true, data: await users.officers() }));
const officerUpdateStatus = handle(async (req, res) => {
  const data = body(req); const issue = await store.get(req.params.id);
  if (issue.assignedOfficer !== Number(req.user.id)) throw fail(403, 'This issue is not assigned to you.');
  policy.active(issue);
  const status = policy.enumValue(data.newStatus, policy.statuses, 'status'); policy.checkTransition(issue, status, true);
  const changes = { status };
  if (data.fieldNotes !== undefined) changes.fieldNotes = policy.note(data.fieldNotes, 'Field notes');
  res.json({ success: true, data: policy.officerIssue(await store.save(issue, changes, data.expectedUpdatedAt)) });
});
module.exports = { getMyQueue, getOfficerStats, getOfficerList, officerUpdateStatus };