const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
router.use(requireAuth);
const {
  getMyQueue,
  getOfficerStats,
  officerUpdateStatus,
  getOfficerList,
} = require('../controllers/officerController');

// GET  /api/officer/stats?officerId=X     — Officer dashboard stats
router.get('/stats', requireRole('OFFICER'), getOfficerStats);

// GET  /api/officer/queue?officerId=X     — Issues assigned to this officer
router.get('/queue', requireRole('OFFICER'), getMyQueue);

// GET  /api/officer/list                  — All officers (for admin reassignment)
router.get('/list', requireRole('ADMIN'), getOfficerList);

// PUT  /api/officer/issues/:id/status     — Officer updates issue status
router.put('/issues/:id/status', requireRole('OFFICER'), officerUpdateStatus);

module.exports = router;
