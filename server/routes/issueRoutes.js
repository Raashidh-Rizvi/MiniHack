const express = require('express');
const router = express.Router();
const {
  createIssue,
  getMyReports,
  updateIssue,
  cancelIssue,
  getAllIssues,
  getIssueById,
  getCitizenStats,
} = require('../controllers/issueController');
const { validateIssueCreate, validateIssueUpdate } = require('../middleware/validator');

// Citizen CRUD routes (Member 1)
router.route('/').get(getAllIssues).post(validateIssueCreate, createIssue);

router.route('/my-reports').get(getMyReports);
router.route('/my-stats').get(getCitizenStats);

router.route('/:id').get(getIssueById).put(validateIssueUpdate, updateIssue).delete(cancelIssue);

module.exports = router;
