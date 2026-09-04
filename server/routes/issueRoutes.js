const express = require('express');
const router = express.Router();
const {
  createIssue,
  getMyReports,
  updateIssue,
  cancelIssue,
  getAllIssues,
  getIssueById,
} = require('../controllers/issueController');
const { requireAuth, requireRole } = require('../middleware/auth');
const citizen = [requireAuth, requireRole('CITIZEN')];

// Citizen CRUD routes (Member 1)
router.route('/').get(getAllIssues).post(...citizen, createIssue);

router.route('/my-reports').get(...citizen, getMyReports);

router.route('/:id').get(getIssueById).put(...citizen, updateIssue).delete(...citizen, cancelIssue);

module.exports = router;
