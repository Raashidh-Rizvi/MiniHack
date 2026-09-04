const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const {
  getMyQueue,
  getOfficerStats,
  officerUpdateStatus,
  getOfficerList,
} = require('../controllers/officerController');

<<<<<<< HEAD
const { extractUser, requireRole } = require('../middleware/auth');

// Protect all officer endpoints from citizen access
router.use(extractUser, requireRole('OFFICER', 'ADMIN'));

// GET  /api/officer/stats?officerId=X     — Officer dashboard stats
router.get('/stats', getOfficerStats);
=======
// GET  /api/officer/stats   — Officer dashboard stats (officer only)
router.get('/stats', protect, requireRole('OFFICER'), getOfficerStats);
>>>>>>> e0cfa8fcfb45a14c20d01b64153856027af586d0

// GET  /api/officer/queue   — Issues assigned to this officer (officer only)
router.get('/queue', protect, requireRole('OFFICER'), getMyQueue);

// GET  /api/officer/list    — All officers (admin only, for reassignment UI)
router.get('/list', protect, requireRole('ADMIN'), getOfficerList);

// PUT  /api/officer/issues/:id/status — Officer updates issue status (officer only)
router.put('/issues/:id/status', protect, requireRole('OFFICER'), officerUpdateStatus);

module.exports = router;
