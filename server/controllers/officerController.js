const Issue = require('../models/Issue');
const memoryStore = require('../models/memoryStore');
const { getIsConnected } = require('../config/db');
const { calculatePriority } = require('../utils/priorityCalculator');

// @desc    Get issues assigned to this officer
// @route   GET /api/officer/queue
// @access  Officer (JWT required)
const getMyQueue = async (req, res, next) => {
  try {
    // Phase 2: Read officer identity from the verified JWT token, NOT from the request query.
    // This prevents any officer from viewing another officer's queue by changing the URL.
    const officerId = Number(req.user.id);
    const { status, priorityLevel, category, search } = req.query;

    if (getIsConnected()) {
      const query = { assignedOfficer: officerId };
      if (status && status !== 'ALL') query.status = status.toUpperCase();
      if (priorityLevel && priorityLevel !== 'ALL') query.priorityLevel = priorityLevel.toUpperCase();
      if (category && category !== 'ALL') query.category = category.toUpperCase();
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }
      const issues = await Issue.find(query).sort({ priorityScore: -1, createdAt: 1 });
      return res.status(200).json({ success: true, count: issues.length, data: issues });
    } else {
      const issues = memoryStore.getAssignedIssues(officerId, { status, priorityLevel, category, search });
      return res.status(200).json({ success: true, count: issues.length, data: issues });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get officer dashboard stats
// @route   GET /api/officer/stats
// @access  Officer (JWT required)
const getOfficerStats = async (req, res, next) => {
  try {
    // Phase 2: Read officer identity from the verified JWT token, NOT from the request query.
    // This ensures stats always belong to the officer who is logged in.
    const officerId = Number(req.user.id);

    if (getIsConnected()) {
      const total = await Issue.countDocuments({ assignedOfficer: officerId });
      const open = await Issue.countDocuments({ assignedOfficer: officerId, status: { $in: ['REPORTED', 'UNDER_REVIEW'] } });
      const inProgress = await Issue.countDocuments({ assignedOfficer: officerId, status: 'IN_PROGRESS' });
      const resolved = await Issue.countDocuments({ assignedOfficer: officerId, status: 'RESOLVED' });
      const critical = await Issue.countDocuments({ assignedOfficer: officerId, priorityLevel: 'CRITICAL' });
      return res.status(200).json({
        success: true,
        data: { totalIssues: total, openIssues: open, inProgressIssues: inProgress, resolvedIssues: resolved, criticalIssues: critical },
      });
    } else {
      const stats = memoryStore.getOfficerStats(officerId);
      return res.status(200).json({ success: true, data: stats });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Officer updates status of an assigned issue
// @route   PUT /api/officer/issues/:id/status
// @access  Officer (JWT required)
const officerUpdateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newStatus, fieldNotes } = req.body;

    // Phase 2: Read officer identity from the verified JWT token.
    // The officerId from the request body is IGNORED — this prevents an officer
    // from sending a fake officerId to update another officer's issue.
    const officerId = Number(req.user.id);

    const validStatuses = ['UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED'];
    if (!newStatus || !validStatuses.includes(newStatus.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Officers can set status to: ${validStatuses.join(', ')}`,
      });
    }

    if (getIsConnected()) {
      const query = {
        $or: [
          { numericId: isNaN(id) ? null : Number(id) },
          { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        ],
        // Phase 2: Assignment check is now MANDATORY — always scope to the logged-in officer.
        // If this issue belongs to a different officer, findOne returns null → 403 below.
        assignedOfficer: officerId,
      };

      const issue = await Issue.findOne(query);
      if (!issue) {
        // Issue either does not exist OR belongs to a different officer — both return 403
        // to avoid leaking information about other officers' issues.
        return res.status(403).json({
          success: false,
          message: 'Access denied. This issue is not assigned to you or does not exist.',
        });
      }

      issue.status = newStatus.toUpperCase();
      if (fieldNotes !== undefined) issue.adminNotes = fieldNotes;

      await issue.save();
      return res.status(200).json({
        success: true,
        message: `Issue status updated to ${newStatus.toUpperCase()} by officer`,
        data: issue,
      });
    } else {
      // Memory-store path: verify assignment before updating
      const existing = memoryStore.getAssignedIssues(officerId, {}).find(
        (i) => String(i.id) === String(id) || String(i.numericId) === String(id)
      );
      if (!existing) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. This issue is not assigned to you or does not exist.',
        });
      }
      const updated = memoryStore.updateIssueStatus(id, { newStatus, adminNotes: fieldNotes });
      if (!updated) {
        return res.status(404).json({ success: false, message: `Issue not found with id ${id}` });
      }
      return res.status(200).json({
        success: true,
        message: `Issue status updated to ${newStatus.toUpperCase()} by officer`,
        data: updated,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all officers (for admin reassignment dropdown)
// @route   GET /api/officer/list
// @access  Admin
const getOfficerList = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const User = require('../models/User');
      const officers = await User.find({ role: 'OFFICER' }).select('-password');
      return res.status(200).json({ success: true, data: officers });
    } else {
      const officers = memoryStore.getOfficers().map(({ password, ...rest }) => rest);
      return res.status(200).json({ success: true, data: officers });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyQueue,
  getOfficerStats,
  officerUpdateStatus,
  getOfficerList,
};
