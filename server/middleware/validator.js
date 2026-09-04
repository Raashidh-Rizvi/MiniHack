const validCategories = ['ROAD', 'STREETLIGHT', 'WASTE', 'WATER', 'DRAINAGE', 'TRAFFIC', 'ENVIRONMENT', 'OTHER'];
const validSeverities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

const validateIssueCreate = (req, res, next) => {
  const { title, description, category, location, severity, peopleAffected } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length < 5) {
    errors.push({ field: 'title', message: 'Title must be at least 5 characters long.' });
  } else if (title.trim().length > 100) {
    errors.push({ field: 'title', message: 'Title cannot exceed 100 characters.' });
  }

  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    errors.push({ field: 'description', message: 'Description must be at least 10 characters long.' });
  } else if (description.trim().length > 1000) {
    errors.push({ field: 'description', message: 'Description cannot exceed 1000 characters.' });
  }

  if (!category || !validCategories.includes(category.toUpperCase())) {
    errors.push({
      field: 'category',
      message: `Category must be one of: ${validCategories.join(', ')}`,
    });
  }

  if (!location || typeof location !== 'string' || location.trim().length < 3) {
    errors.push({ field: 'location', message: 'Please provide a valid location or landmark.' });
  }

  if (severity && !validSeverities.includes(severity.toUpperCase())) {
    errors.push({
      field: 'severity',
      message: `Severity must be one of: ${validSeverities.join(', ')}`,
    });
  }

  if (peopleAffected !== undefined && (isNaN(Number(peopleAffected)) || Number(peopleAffected) < 1)) {
    errors.push({ field: 'peopleAffected', message: 'People affected must be a positive number of at least 1.' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed on issue report submission',
      errors,
    });
  }

  next();
};

const validateIssueUpdate = (req, res, next) => {
  const { title, description, location, peopleAffected } = req.body;
  const errors = [];

  if (title !== undefined && (typeof title !== 'string' || title.trim().length < 5)) {
    errors.push({ field: 'title', message: 'Title must be at least 5 characters long.' });
  }

  if (description !== undefined && (typeof description !== 'string' || description.trim().length < 10)) {
    errors.push({ field: 'description', message: 'Description must be at least 10 characters long.' });
  }

  if (location !== undefined && (typeof location !== 'string' || location.trim().length < 3)) {
    errors.push({ field: 'location', message: 'Please provide a valid location or landmark.' });
  }

  if (peopleAffected !== undefined && (isNaN(Number(peopleAffected)) || Number(peopleAffected) < 1)) {
    errors.push({ field: 'peopleAffected', message: 'People affected must be at least 1.' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed on issue update',
      errors,
    });
  }

  next();
};

module.exports = {
  validateIssueCreate,
  validateIssueUpdate,
};
