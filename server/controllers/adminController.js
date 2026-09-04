const Issue = require('../models/Issue');
const memoryStore = require('../models/memoryStore');
const { getIsConnected } = require('../config/db');
const { calculatePriority } = require('../utils/priorityCalculator');

// @desc    Get admin dashboard statistics (Member 3 - READ Stats)
// @route   GET /api/admin/stats
// @access  Admin
const getAdminStats = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const total = await Issue.countDocuments();
      const open = await Issue.countDocuments({ status: { $in: ['REPORTED', 'UNDER_REVIEW'] } });
      const inProgress = await Issue.countDocuments({ status: 'IN_PROGRESS' });
      const critical = await Issue.countDocuments({ priorityLevel: 'CRITICAL' });
      const resolved = await Issue.countDocuments({ status: 'RESOLVED' });

      return res.status(200).json({
        success: true,
        data: {
          totalIssues: total,
          openIssues: open,
          inProgressIssues: inProgress,
          criticalIssues: critical,
          resolvedIssues: resolved,
        },
      });
    } else {
      const stats = memoryStore.getAdminStats();
      return res.status(200).json({ success: true, data: stats });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get priority-ranked queue for admin (Member 3 - READ Priority Queue)
// @route   GET /api/admin/queue
// @access  Admin
const getPriorityQueue = async (req, res, next) => {
  try {
    const { status, priorityLevel, category, search } = req.query;

    if (getIsConnected()) {
      const query = {};
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
      const issues = memoryStore.getPriorityQueue({ status, priorityLevel, category, search });
      return res.status(200).json({ success: true, count: issues.length, data: issues });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update issue status (Member 3 - UPDATE Status)
// @route   PUT /api/admin/issues/:id/status
// @access  Admin
const updateIssueStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newStatus, adminNotes, adjustedSeverity } = req.body;

    const validStatuses = ['REPORTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'DUPLICATE', 'REJECTED'];
    if (!newStatus || !validStatuses.includes(newStatus.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    if (getIsConnected()) {
      const issue = await Issue.findOne({
        $or: [
          { numericId: isNaN(id) ? null : Number(id) },
          { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        ],
      });

      if (!issue) {
        return res.status(404).json({ success: false, message: `Issue not found with id ${id}` });
      }

      issue.status = newStatus.toUpperCase();
      if (adminNotes !== undefined) issue.adminNotes = adminNotes;

      // Admin can adjust severity, triggering priority recalculation
      if (adjustedSeverity) {
        issue.severity = adjustedSeverity.toUpperCase();
        const { priorityScore, priorityLevel } = calculatePriority(
          issue.severity,
          issue.peopleAffected,
          null,
          issue.createdAt
        );
        issue.priorityScore = priorityScore;
        issue.priorityLevel = priorityLevel;
      }

      await issue.save();

      return res.status(200).json({
        success: true,
        message: `Issue status updated to ${newStatus.toUpperCase()} successfully`,
        data: issue,
      });
    } else {
      const updated = memoryStore.updateIssueStatus(id, { newStatus, adminNotes, adjustedSeverity });
      if (!updated) {
        return res.status(404).json({ success: false, message: `Issue not found with id ${id}` });
      }

      return res.status(200).json({
        success: true,
        message: `Issue status updated to ${newStatus.toUpperCase()} successfully`,
        data: updated,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Admin moderation - delete/remove issue (Member 3 - DELETE Moderation)
// @route   DELETE /api/admin/issues/:id
// @access  Admin
const moderateDeleteIssue = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const issue = await Issue.findOneAndDelete({
        $or: [
          { numericId: isNaN(id) ? null : Number(id) },
          { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        ],
      });

      if (!issue) {
        return res.status(404).json({ success: false, message: `Issue not found with id ${id}` });
      }

      return res.status(200).json({
        success: true,
        message: 'Issue removed from platform by administrator',
      });
    } else {
      const deleted = memoryStore.deleteIssue(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: `Issue not found with id ${id}` });
      }

      return res.status(200).json({
        success: true,
        message: 'Issue removed from platform by administrator',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Recalculate priority score for a specific issue
// @route   PATCH /api/admin/issues/:id/priority
// @access  Admin
const recalculatePriority = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const issue = await Issue.findOne({
        $or: [
          { numericId: isNaN(id) ? null : Number(id) },
          { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        ],
      });

      if (!issue) {
        return res.status(404).json({ success: false, message: `Issue not found with id ${id}` });
      }

      const { priorityScore, priorityLevel } = calculatePriority(
        issue.severity,
        issue.peopleAffected,
        null,
        issue.createdAt
      );
      issue.priorityScore = priorityScore;
      issue.priorityLevel = priorityLevel;
      await issue.save();

      return res.status(200).json({
        success: true,
        message: 'Priority score recalculated',
        data: { priorityScore, priorityLevel },
      });
    } else {
      const issue = memoryStore.getIssueById(id);
      if (!issue) {
        return res.status(404).json({ success: false, message: `Issue not found with id ${id}` });
      }

      const { priorityScore, priorityLevel } = calculatePriority(
        issue.severity,
        issue.peopleAffected,
        null,
        issue.createdAt
      );
      memoryStore.updateIssue(id, { priorityScore, priorityLevel });

      return res.status(200).json({
        success: true,
        message: 'Priority score recalculated',
        data: { priorityScore, priorityLevel },
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reassign an issue to a different officer (Admin)
// @route   PUT /api/admin/issues/:id/assign
// @access  Admin
const reassignOfficer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { officerId, officerName } = req.body;

    if (!officerId || !officerName) {
      return res.status(400).json({ success: false, message: 'officerId and officerName are required.' });
    }

    if (getIsConnected()) {
      const issue = await Issue.findOne({
        $or: [
          { numericId: isNaN(id) ? null : Number(id) },
          { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        ],
      });

      if (!issue) {
        return res.status(404).json({ success: false, message: `Issue not found with id ${id}` });
      }

      issue.assignedOfficer = Number(officerId);
      issue.assignedOfficerName = officerName;
      await issue.save();

      return res.status(200).json({
        success: true,
        message: `Issue reassigned to ${officerName} successfully`,
        data: issue,
      });
    } else {
      const updated = memoryStore.reassignOfficer(id, officerId, officerName);
      if (!updated) {
        return res.status(404).json({ success: false, message: `Issue not found with id ${id}` });
      }
      return res.status(200).json({
        success: true,
        message: `Issue reassigned to ${officerName} successfully`,
        data: updated,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getPriorityQueue,
  updateIssueStatus,
  moderateDeleteIssue,
  recalculatePriority,
  reassignOfficer,
};
