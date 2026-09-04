const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getPriorityQueue,
  updateIssueStatus,
  moderateDeleteIssue,
  recalculatePriority,
  reassignOfficer,
} = require('../controllers/adminController');

// Admin Priority Engine Routes (Member 3)
// GET  /api/admin/stats        — Dashboard KPI metrics
router.get('/stats', getAdminStats);

// GET  /api/admin/queue        — Community Priority Queue (ranked by score descending)
router.get('/queue', getPriorityQueue);

// PUT  /api/admin/issues/:id/status   — Status lifecycle transition + optional severity adjustment
router.put('/issues/:id/status', updateIssueStatus);

// PATCH /api/admin/issues/:id/priority — Recalculate priority score
router.patch('/issues/:id/priority', recalculatePriority);

// DELETE /api/admin/issues/:id  — Admin moderation deletion
router.delete('/issues/:id', moderateDeleteIssue);

// PUT /api/admin/issues/:id/assign — Reassign issue to a different officer
router.put('/issues/:id/assign', reassignOfficer);

module.exports = router;
