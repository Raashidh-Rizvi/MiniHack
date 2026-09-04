const express = require('express');
const router = express.Router();
const {
  getMyQueue,
  getOfficerStats,
  officerUpdateStatus,
  getOfficerList,
} = require('../controllers/officerController');

const { extractUser, requireRole } = require('../middleware/auth');

// Protect all officer endpoints from citizen access
router.use(extractUser, requireRole('OFFICER', 'ADMIN'));

// GET  /api/officer/stats?officerId=X     — Officer dashboard stats
router.get('/stats', getOfficerStats);

// GET  /api/officer/queue?officerId=X     — Issues assigned to this officer
router.get('/queue', getMyQueue);

// GET  /api/officer/list                  — All officers (for admin reassignment)
router.get('/list', getOfficerList);

// PUT  /api/officer/issues/:id/status     — Officer updates issue status
router.put('/issues/:id/status', officerUpdateStatus);

module.exports = router;
