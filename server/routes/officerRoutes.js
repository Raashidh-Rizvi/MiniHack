const express = require('express');
const router = express.Router();
const { extractUser, requireRole } = require('../middleware/auth');
const {
  getMyQueue,
  getOfficerStats,
  officerUpdateStatus,
  getOfficerList,
} = require('../controllers/officerController');

// Protect all officer endpoints from unauthorized/citizen access
router.use(extractUser, requireRole('OFFICER', 'ADMIN'));

// GET  /api/officer/stats   — Officer dashboard stats
router.get('/stats', getOfficerStats);

// GET  /api/officer/queue   — Issues assigned to this officer
router.get('/queue', getMyQueue);

// GET  /api/officer/list    — All officers (for reassignment UI and directory)
router.get('/list', getOfficerList);

// PUT  /api/officer/issues/:id/status — Officer updates issue status
router.put('/issues/:id/status', officerUpdateStatus);

module.exports = router;
