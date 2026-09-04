const Issue = require('../models/Issue');
const memoryStore = require('../models/memoryStore');
const { getIsConnected } = require('../config/db');
const { calculatePriority } = require('../utils/priorityCalculator');

// Category → Officer routing map (mirrors memoryStore for DB path)
const CATEGORY_OFFICER_MAP = {
  ROAD: { id: 2, name: 'Eng. Bandara' },
  DRAINAGE: { id: 2, name: 'Eng. Bandara' },
  WATER: { id: 2, name: 'Eng. Bandara' },
  WASTE: { id: 2, name: 'Eng. Bandara' },
  STREETLIGHT: { id: 2, name: 'Eng. Bandara' },
  TRAFFIC: { id: 2, name: 'Eng. Bandara' },
  ENVIRONMENT: { id: 2, name: 'Eng. Bandara' },
  OTHER: { id: 2, name: 'Eng. Bandara' },
};

// @desc    Create a new issue report (Member 1 - CREATE)
// @route   POST /api/issues
// @access  Public (Citizen)
const createIssue = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      location,
      severity = 'MEDIUM',
      peopleAffected = 10,
      reportedBy = 1,
      reportedByName = 'Kasun Perera',
    } = req.body;

    const catKey = (category || 'OTHER').toUpperCase();
    const officerInfo = CATEGORY_OFFICER_MAP[catKey] || CATEGORY_OFFICER_MAP['OTHER'];
    const { priorityScore, priorityLevel } = calculatePriority(severity, peopleAffected);

    if (getIsConnected()) {
      const issue = await Issue.create({
        title,
        description,
        category: catKey,
        location,
        severity: severity.toUpperCase(),
        peopleAffected: Number(peopleAffected),
        priorityScore,
        priorityLevel,
        status: 'REPORTED',
        supportCount: 0,
        reportedBy: Number(reportedBy),
        reportedByName,
        assignedOfficer: officerInfo.id,
        assignedOfficerName: officerInfo.name,
      });

      return res.status(201).json({
        success: true,
        message: 'Civic issue reported successfully!',
        data: issue,
      });
    } else {
      const newIssue = memoryStore.createIssue({
        title,
        description,
        category,
        location,
        severity,
        peopleAffected,
        reportedBy,
        reportedByName,
      });

      return res.status(201).json({
        success: true,
        message: 'Civic issue reported successfully! (Resilient Storage)',
        data: newIssue,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get reports filed by resident (Member 1 - READ My Reports)
// @route   GET /api/issues/my-reports
// @access  Public (Citizen)
const getMyReports = async (req, res, next) => {
  try {
    const userId = Number(req.query.userId) || 1;

    if (getIsConnected()) {
      const issues = await Issue.find({ reportedBy: userId }).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: issues.length,
        data: issues,
      });
    } else {
      const issues = memoryStore.getMyReports(userId);
      return res.status(200).json({
        success: true,
        count: issues.length,
        data: issues,
      });
    }
  } catch (error) {
    next(error);
  }
};
// Helper to extract requesting user context from headers or query
const getRequestingUser = (req) => {
  let userId = req.headers['x-user-id'] || req.query.userId || req.body.userId;
  let role = req.headers['x-user-role'];

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const match = token.match(/gramafix_jwt_(\d+)/);
    if (match && !userId) {
      userId = match[1];
    }
  }

  return {
    id: userId ? Number(userId) : null,
    role: (role || 'CITIZEN').toUpperCase(),
  };
};

// @desc    Update citizen's own report (Member 1 - UPDATE)
// @route   PUT /api/issues/:id
// @access  Public (Citizen)
const updateIssue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { description, location, peopleAffected, severity, title } = req.body;
    const requestingUser = getRequestingUser(req);

    if (getIsConnected()) {
      let issue = await Issue.findOne({
        $or: [{ numericId: isNaN(id) ? null : Number(id) }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
      });

      if (!issue) {
        return res.status(404).json({
          success: false,
          message: `Issue not found with id ${id}`,
        });
      }

      // Ownership enforcement: Citizens cannot edit another citizen's report
      if (requestingUser.role !== 'ADMIN') {
        if (requestingUser.id && Number(issue.reportedBy) !== Number(requestingUser.id)) {
          return res.status(403).json({
            success: false,
            message: "Forbidden: You cannot edit another citizen's report.",
          });
        }
      }

      // Status eligibility check: Citizens may only edit REPORTED or UNDER_REVIEW reports
      if (issue.status !== 'REPORTED' && issue.status !== 'UNDER_REVIEW') {
        return res.status(400).json({
          success: false,
          message: `Only reports with status 'REPORTED' or 'UNDER_REVIEW' can be edited. Current status is ${issue.status}.`,
        });
      }

      if (title) issue.title = title;
      if (description) issue.description = description;
      if (location) issue.location = location;
      if (severity) issue.severity = severity.toUpperCase();
      if (peopleAffected) issue.peopleAffected = Number(peopleAffected);

      // Recalculate priority
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
        message: 'Issue report updated successfully',
        data: issue,
      });
    } else {
      const issue = memoryStore.getIssueById(id);
      if (!issue) {
        return res.status(404).json({
          success: false,
          message: `Issue not found with id ${id}`,
        });
      }

      // Ownership enforcement
      if (requestingUser.role !== 'ADMIN') {
        if (requestingUser.id && Number(issue.reportedBy) !== Number(requestingUser.id)) {
          return res.status(403).json({
            success: false,
            message: "Forbidden: You cannot edit another citizen's report.",
          });
        }
      }

      // Status eligibility check
      if (issue.status !== 'REPORTED' && issue.status !== 'UNDER_REVIEW') {
        return res.status(400).json({
          success: false,
          message: `Only reports with status 'REPORTED' or 'UNDER_REVIEW' can be edited. Current status is ${issue.status}.`,
        });
      }

      const updated = memoryStore.updateIssue(id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Issue report updated successfully',
        data: updated,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel/Delete citizen's own report (Member 1 - DELETE)
// @route   DELETE /api/issues/:id
// @access  Public (Citizen)
const cancelIssue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const requestingUser = getRequestingUser(req);

    if (getIsConnected()) {
      const issue = await Issue.findOne({
        $or: [{ numericId: isNaN(id) ? null : Number(id) }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
      });

      if (!issue) {
        return res.status(404).json({
          success: false,
          message: `Issue not found with id ${id}`,
        });
      }

      // Ownership enforcement: Citizens cannot cancel another citizen's report
      if (requestingUser.role !== 'ADMIN') {
        if (requestingUser.id && Number(issue.reportedBy) !== Number(requestingUser.id)) {
          return res.status(403).json({
            success: false,
            message: "Forbidden: You cannot cancel another citizen's report.",
          });
        }
      }

      // Status eligibility check: Citizens may only cancel REPORTED or UNDER_REVIEW reports
      if (issue.status !== 'REPORTED' && issue.status !== 'UNDER_REVIEW') {
        return res.status(400).json({
          success: false,
          message: `Only reports with status 'REPORTED' or 'UNDER_REVIEW' can be cancelled. Current status is ${issue.status}.`,
        });
      }

      await Issue.deleteOne({ _id: issue._id });

      return res.status(200).json({
        success: true,
        message: 'Issue report has been cancelled successfully',
      });
    } else {
      const issue = memoryStore.getIssueById(id);
      if (!issue) {
        return res.status(404).json({
          success: false,
          message: `Issue not found with id ${id}`,
        });
      }

      // Ownership enforcement
      if (requestingUser.role !== 'ADMIN') {
        if (requestingUser.id && Number(issue.reportedBy) !== Number(requestingUser.id)) {
          return res.status(403).json({
            success: false,
            message: "Forbidden: You cannot cancel another citizen's report.",
          });
        }
      }

      // Status eligibility check
      if (issue.status !== 'REPORTED' && issue.status !== 'UNDER_REVIEW') {
        return res.status(400).json({
          success: false,
          message: `Only reports with status 'REPORTED' or 'UNDER_REVIEW' can be cancelled. Current status is ${issue.status}.`,
        });
      }

      memoryStore.deleteIssue(id);

      return res.status(200).json({
        success: true,
        message: 'Issue report has been cancelled successfully',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all public issues (supports feed view)
// @route   GET /api/issues
// @access  Public
const getAllIssues = async (req, res, next) => {
  try {
    const { category, severity, status, search } = req.query;

    if (getIsConnected()) {
      const query = {};
      if (category && category !== 'ALL') query.category = category.toUpperCase();
      if (severity && severity !== 'ALL') query.severity = severity.toUpperCase();
      if (status && status !== 'ALL') query.status = status.toUpperCase();
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
        ];
      }

      const issues = await Issue.find(query).sort({ priorityScore: -1, createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: issues.length,
        data: issues,
      });
    } else {
      let issues = memoryStore.getAllIssues();
      if (category && category !== 'ALL') {
        issues = issues.filter((i) => i.category === category.toUpperCase());
      }
      if (severity && severity !== 'ALL') {
        issues = issues.filter((i) => i.severity === severity.toUpperCase());
      }
      if (status && status !== 'ALL') {
        issues = issues.filter((i) => i.status === status.toUpperCase());
      }
      if (search) {
        const term = search.toLowerCase();
        issues = issues.filter(
          (i) =>
            i.title.toLowerCase().includes(term) ||
            i.description.toLowerCase().includes(term) ||
            i.location.toLowerCase().includes(term)
        );
      }
      return res.status(200).json({
        success: true,
        count: issues.length,
        data: issues,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single issue details
// @route   GET /api/issues/:id
// @access  Public
const getIssueById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const issue = await Issue.findOne({
        $or: [{ numericId: isNaN(id) ? null : Number(id) }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
      });

      if (!issue) {
        return res.status(404).json({
          success: false,
          message: `Issue not found with id ${id}`,
        });
      }

      return res.status(200).json({
        success: true,
        data: issue,
      });
    } else {
      const issue = memoryStore.getIssueById(id);
      if (!issue) {
        return res.status(404).json({
          success: false,
          message: `Issue not found with id ${id}`,
        });
      }

      return res.status(200).json({
        success: true,
        data: issue,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get citizen's own report statistics (Member 1 - Dashboard stats)
// @route   GET /api/issues/my-stats
// @access  Public (Citizen)
const getCitizenStats = async (req, res, next) => {
  try {
    const userId = Number(req.query.userId) || 1;

    if (getIsConnected()) {
      const [total, open, inProgress, resolved] = await Promise.all([
        Issue.countDocuments({ reportedBy: userId }),
        Issue.countDocuments({ reportedBy: userId, status: 'REPORTED' }),
        Issue.countDocuments({ reportedBy: userId, status: { $in: ['UNDER_REVIEW', 'IN_PROGRESS'] } }),
        Issue.countDocuments({ reportedBy: userId, status: 'RESOLVED' }),
      ]);

      return res.status(200).json({
        success: true,
        data: { total, open, inProgress, resolved },
      });
    } else {
      const issues = memoryStore.getMyReports(userId);
      return res.status(200).json({
        success: true,
        data: {
          total: issues.length,
          open: issues.filter((i) => i.status === 'REPORTED').length,
          inProgress: issues.filter((i) => i.status === 'UNDER_REVIEW' || i.status === 'IN_PROGRESS').length,
          resolved: issues.filter((i) => i.status === 'RESOLVED').length,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createIssue,
  getMyReports,
  updateIssue,
  cancelIssue,
  getAllIssues,
  getIssueById,
  getCitizenStats,
};
