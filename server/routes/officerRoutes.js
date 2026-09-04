const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const {
  getMyQueue,
  getOfficerStats,
  officerUpdateStatus,
  getOfficerList,
} = require('../controllers/officerController');

// GET  /api/officer/stats   — Officer dashboard stats (officer only)
router.get('/stats', protect, requireRole('OFFICER'), getOfficerStats);

// GET  /api/officer/queue   — Issues assigned to this officer (officer only)
router.get('/queue', protect, requireRole('OFFICER'), getMyQueue);

// GET  /api/officer/list    — All officers (admin only, for reassignment UI)
router.get('/list', protect, requireRole('ADMIN'), getOfficerList);

// PUT  /api/officer/issues/:id/status — Officer updates issue status (officer only)
router.put('/issues/:id/status', protect, requireRole('OFFICER'), officerUpdateStatus);

module.exports = router;
