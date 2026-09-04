const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
router.use(requireAuth, requireRole('ADMIN'));
const {
  getAdminStats,
  getPriorityQueue,
  updateIssueStatus,
  moderateDeleteIssue,
  recalculatePriority,
  reassignOfficer,
  getHistory,
  createOfficer,
  getLoginAuditLog,
  getAllUsers,
} = require('../controllers/adminController');

// Admin Priority Engine Routes (Member 3)
// GET  /api/admin/stats        — Dashboard KPI metrics
router.get('/stats', getAdminStats);

// GET  /api/admin/queue        — Community Priority Queue (ranked by score descending)
router.get('/queue', getPriorityQueue);
router.get('/issues/:id/history', getHistory);

// PUT  /api/admin/issues/:id/status   — Status lifecycle transition + optional severity adjustment
router.put('/issues/:id/status', updateIssueStatus);

// PATCH /api/admin/issues/:id/priority — Recalculate priority score
router.patch('/issues/:id/priority', recalculatePriority);

// DELETE /api/admin/issues/:id  — Admin moderation deletion
router.delete('/issues/:id', moderateDeleteIssue);

// PUT /api/admin/issues/:id/assign — Reassign issue to a different officer
router.put('/issues/:id/assign', reassignOfficer);

// POST /api/admin/officers — Provision a new municipal officer (Admin only)
router.post('/officers', createOfficer);

// GET /api/admin/audit-log — Login audit log with IP, timestamp, user-agent
router.get('/audit-log', getLoginAuditLog);

// GET /api/admin/users — All registered users
router.get('/users', getAllUsers);

module.exports = router;
