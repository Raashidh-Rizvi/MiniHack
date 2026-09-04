const validCategories = ['ROAD', 'STREETLIGHT', 'WASTE', 'WATER', 'DRAINAGE', 'TRAFFIC', 'ENVIRONMENT', 'ACCIDENT', 'OTHER'];
const validSeverities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const validRoles = ['CITIZEN', 'OFFICER', 'ADMIN', 'RESIDENT'];

// Helper to validate email format
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
};

const validateIssueCreate = (req, res, next) => {
  const { title, description, category, location, severity, peopleAffected } = req.body || {};
  const errors = [];

  // Title validation
  if (!title || typeof title !== 'string' || !title.trim()) {
    errors.push({ field: 'title', message: 'Title is required.' });
  } else if (title.trim().length < 5) {
    errors.push({ field: 'title', message: 'Title must be at least 5 characters long.' });
  } else if (title.trim().length > 100) {
    errors.push({ field: 'title', message: 'Title cannot exceed 100 characters.' });
  }

  // Description validation
  if (!description || typeof description !== 'string' || !description.trim()) {
    errors.push({ field: 'description', message: 'Description is required.' });
  } else if (description.trim().length < 10) {
    errors.push({ field: 'description', message: 'Description must be at least 10 characters long.' });
  } else if (description.trim().length > 1000) {
    errors.push({ field: 'description', message: 'Description cannot exceed 1000 characters.' });
  }

  // Category validation
  if (!category || typeof category !== 'string' || !validCategories.includes(category.toUpperCase())) {
    errors.push({
      field: 'category',
      message: `Category is required and must be one of: ${validCategories.join(', ')}`,
    });
  }

  // Location validation
  if (!location || typeof location !== 'string' || !location.trim()) {
    errors.push({ field: 'location', message: 'Location / Landmark is required.' });
  } else if (location.trim().length < 3) {
    errors.push({ field: 'location', message: 'Please specify a valid neighborhood location or landmark (at least 3 characters).' });
  } else if (location.trim().length > 120) {
    errors.push({ field: 'location', message: 'Location cannot exceed 120 characters.' });
  }

  // Severity validation
  if (severity && !validSeverities.includes(String(severity).toUpperCase())) {
    errors.push({
      field: 'severity',
      message: `Severity must be one of: ${validSeverities.join(', ')}`,
    });
  }

  // People affected validation
  if (peopleAffected !== undefined && (isNaN(Number(peopleAffected)) || Number(peopleAffected) < 1)) {
    errors.push({ field: 'peopleAffected', message: 'Estimated people affected must be a positive number of at least 1.' });
  } else if (peopleAffected !== undefined && Number(peopleAffected) > 50000) {
    errors.push({ field: 'peopleAffected', message: 'Estimated people affected cannot exceed 50,000.' });
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
  const { title, description, location, severity, peopleAffected } = req.body || {};
  const errors = [];

  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) {
      errors.push({ field: 'title', message: 'Title cannot be empty.' });
    } else if (title.trim().length < 5) {
      errors.push({ field: 'title', message: 'Title must be at least 5 characters long.' });
    } else if (title.trim().length > 100) {
      errors.push({ field: 'title', message: 'Title cannot exceed 100 characters.' });
    }
  }

  if (description !== undefined) {
    if (typeof description !== 'string' || !description.trim()) {
      errors.push({ field: 'description', message: 'Description cannot be empty.' });
    } else if (description.trim().length < 10) {
      errors.push({ field: 'description', message: 'Description must be at least 10 characters long.' });
    } else if (description.trim().length > 1000) {
      errors.push({ field: 'description', message: 'Description cannot exceed 1000 characters.' });
    }
  }

  if (location !== undefined) {
    if (typeof location !== 'string' || !location.trim()) {
      errors.push({ field: 'location', message: 'Location cannot be empty.' });
    } else if (location.trim().length < 3) {
      errors.push({ field: 'location', message: 'Location must be at least 3 characters long.' });
    } else if (location.trim().length > 120) {
      errors.push({ field: 'location', message: 'Location cannot exceed 120 characters.' });
    }
  }

  if (severity !== undefined && !validSeverities.includes(String(severity).toUpperCase())) {
    errors.push({
      field: 'severity',
      message: `Severity must be one of: ${validSeverities.join(', ')}`,
    });
  }

  if (peopleAffected !== undefined && (isNaN(Number(peopleAffected)) || Number(peopleAffected) < 1)) {
    errors.push({ field: 'peopleAffected', message: 'People affected must be at least 1.' });
  } else if (peopleAffected !== undefined && Number(peopleAffected) > 50000) {
    errors.push({ field: 'peopleAffected', message: 'Estimated people affected cannot exceed 50,000.' });
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

const validateAuthLogin = (req, res, next) => {
  const { email, password } = req.body || {};
  const errors = [];

  if (!email || !String(email).trim()) {
    errors.push({ field: 'email', message: 'Email address is required.' });
  } else if (!isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address (e.g. name@domain.com).' });
  }

  if (!password || !String(password).trim()) {
    errors.push({ field: 'password', message: 'Password is required.' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors[0].message,
      errors,
    });
  }

  next();
};

const validateAuthRegister = (req, res, next) => {
  const { fullName, email, password, communityArea, role } = req.body || {};
  const errors = [];

  // Full name validation
  if (!fullName || !String(fullName).trim()) {
    errors.push({ field: 'fullName', message: 'Full name is required.' });
  } else if (String(fullName).trim().length < 3) {
    errors.push({ field: 'fullName', message: 'Full name must be at least 3 characters long.' });
  } else if (String(fullName).trim().length > 60) {
    errors.push({ field: 'fullName', message: 'Full name cannot exceed 60 characters.' });
  }

  // Email validation
  if (!email || !String(email).trim()) {
    errors.push({ field: 'email', message: 'Email address is required.' });
  } else if (!isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address (e.g. name@domain.com).' });
  }

  // Password validation
  if (!password || !String(password).trim()) {
    errors.push({ field: 'password', message: 'Password is required.' });
  } else if (String(password).length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters long.' });
  }

  // Community area validation
  if (communityArea !== undefined && String(communityArea).trim() && String(communityArea).trim().length < 3) {
    errors.push({ field: 'communityArea', message: 'Community area must be at least 3 characters long.' });
  }

  // Role validation
  if (role !== undefined && !validRoles.includes(String(role).toUpperCase())) {
    errors.push({ field: 'role', message: `Role must be one of: ${validRoles.join(', ')}` });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors[0].message,
      errors,
    });
  }

  next();
};

module.exports = {
  validateIssueCreate,
  validateIssueUpdate,
  validateAuthLogin,
  validateAuthRegister,
  validCategories,
  validSeverities,
};
