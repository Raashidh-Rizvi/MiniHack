/**
 * In-Memory fallback store with seeded Sri Lankan data
 * Used seamlessly if MongoDB daemon is not running locally.
 */

const { calculatePriority } = require('../utils/priorityCalculator');

// Category → Officer routing map (officerId)
// Officers handle categories based on their department
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

let users = [
  {
    id: 1,
    numericId: 1,
    fullName: 'Kasun Perera',
    email: 'kasun.citizen@gramafix.lk',
    role: 'CITIZEN',
    communityArea: 'Matale Town',
    password: 'password123',
  },
  {
    id: 2,
    numericId: 2,
    fullName: 'Eng. Bandara',
    email: 'officer.bandara@gramafix.lk',
    role: 'OFFICER',
    communityArea: 'Matale Municipal Council',
    password: 'officer123',
  },
  {
    id: 3,
    numericId: 3,
    fullName: 'Dr. Priyantha',
    email: 'admin.priyantha@gramafix.lk',
    role: 'ADMIN',
    communityArea: 'Central Administration',
    password: 'admin123',
  },
];
let nextUserId = 4;

const categories = [
  { id: 'ROAD', code: 'ROAD', name: 'Roads & Potholes', description: 'Damaged roads, potholes, paving issues', iconName: 'Compass' },
  { id: 'DRAINAGE', code: 'DRAINAGE', name: 'Drainage & Flooding', description: 'Blocked drains, stagnant water, overflow', iconName: 'Waves' },
  { id: 'WATER', code: 'WATER', name: 'Water Supply', description: 'Broken mains, pipeline leaks, low pressure', iconName: 'Droplet' },
  { id: 'WASTE', code: 'WASTE', name: 'Waste Management', description: 'Uncollected garbage, illegal dumping, bin overflow', iconName: 'Trash2' },
  { id: 'STREETLIGHT', code: 'STREETLIGHT', name: 'Street Lighting', description: 'Faulty lamps, dark pedestrian lanes', iconName: 'Lightbulb' },
  { id: 'TRAFFIC', code: 'TRAFFIC', name: 'Traffic & Safety', description: 'Blind turns, damaged signs, speeding hazards', iconName: 'AlertTriangle' },
  { id: 'ENVIRONMENT', code: 'ENVIRONMENT', name: 'Environmental Hazards', description: 'Fallen trees, soil erosion, pest hazards', iconName: 'Trees' },
  { id: 'OTHER', code: 'OTHER', name: 'Other Civic Issues', description: 'General neighborhood concerns', iconName: 'HelpCircle' },
];

let issues = [
  {
    id: 101,
    title: 'Blocked Culvert Causing Flash Flooding',
    description: 'Main drainage culvert near Matale Hindu College is packed with plastic debris and mud. Monsoon rainwater overflows across the road blocking school children.',
    category: 'DRAINAGE',
    location: 'Near Hindu College, Trincomalee Street, Matale',
    latitude: 7.4675,
    longitude: 80.6234,
    severity: 'HIGH',
    peopleAffected: 150,
    priorityScore: 82,
    priorityLevel: 'HIGH',
    status: 'REPORTED',
    supportCount: 28,
    reportedBy: 1,
    reportedByName: 'Kasun Perera',
    adminNotes: '',
    assignedOfficer: 2,
    assignedOfficerName: 'Eng. Bandara',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
  },
  {
    id: 102,
    title: 'Deep Hazardous Pothole Near Kandy Clock Tower',
    description: 'Massive pothole approx 2 feet wide on the main bus lane. Motorbikes frequently swerve into oncoming traffic to avoid it, causing near collisions.',
    category: 'ROAD',
    location: 'Peradeniya Road Junction, Kandy',
    latitude: 7.2906,
    longitude: 80.6337,
    severity: 'CRITICAL',
    peopleAffected: 350,
    priorityScore: 94,
    priorityLevel: 'CRITICAL',
    status: 'UNDER_REVIEW',
    supportCount: 42,
    reportedBy: 1,
    reportedByName: 'Kasun Perera',
    adminNotes: 'Assigned to Central Province RDA inspection unit.',
    assignedOfficer: 2,
    assignedOfficerName: 'Eng. Bandara',
    createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
  },
  {
    id: 103,
    title: 'Non-Functioning Streetlights along Galle Fort Ramparts',
    description: 'Five consecutive street lamp posts have been dark for over a week. Creates security issues for residents and evening walkers.',
    category: 'STREETLIGHT',
    location: 'Rampart Street, Galle Fort',
    latitude: 6.0270,
    longitude: 80.2170,
    severity: 'MEDIUM',
    peopleAffected: 65,
    priorityScore: 56,
    priorityLevel: 'MEDIUM',
    status: 'IN_PROGRESS',
    supportCount: 14,
    reportedBy: 2,
    reportedByName: 'Eng. Bandara',
    adminNotes: 'Technician dispatched for lamp replacement.',
    assignedOfficer: 2,
    assignedOfficerName: 'Eng. Bandara',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
  {
    id: 104,
    title: 'Garbage Dump Overflowing Near Market Entrance',
    description: 'Municipal waste bins overflowing with organic waste. Stray animals spreading garbage onto pedestrian path, severe stench.',
    category: 'WASTE',
    location: 'Central Market Road, Colombo 11',
    latitude: 6.9388,
    longitude: 79.8547,
    severity: 'HIGH',
    peopleAffected: 220,
    priorityScore: 84,
    priorityLevel: 'HIGH',
    status: 'RESOLVED',
    supportCount: 31,
    reportedBy: 1,
    reportedByName: 'Kasun Perera',
    adminNotes: 'Cleared by Municipal Waste Management crew on Sept 3.',
    assignedOfficer: 2,
    assignedOfficerName: 'Eng. Bandara',
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  }
];

let nextIssueId = 105;

module.exports = {
  getDemoUsers: () => users,
  findUserByEmail: (email) => users.find((u) => u.email.toLowerCase() === String(email).toLowerCase().trim()),
  findUserById: (id) => users.find((u) => u.id === Number(id) || u.id === id),
  createUser: (userData) => {
    const newId = nextUserId++;
    const newUser = {
      id: newId,
      numericId: newId,
      fullName: userData.fullName.trim(),
      email: userData.email.toLowerCase().trim(),
      role: userData.role || 'CITIZEN',
      communityArea: userData.communityArea || 'Matale Town',
      password: userData.password || 'password123',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    return newUser;
  },
  getCategories: () => categories,
  getAllIssues: () => issues,
  getIssueById: (id) => issues.find((i) => i.id === Number(id) || i.id === id),
  getMyReports: (userId = 1) => issues.filter((i) => i.reportedBy === Number(userId)),
  createIssue: (data) => {
    const createdAt = new Date().toISOString();
    const { priorityScore, priorityLevel } = calculatePriority(data.severity, data.peopleAffected, null, createdAt);
    const catKey = (data.category || 'OTHER').toUpperCase();
    const officerInfo = CATEGORY_OFFICER_MAP[catKey] || CATEGORY_OFFICER_MAP['OTHER'];
    const newIssue = {
      id: nextIssueId++,
      title: data.title.trim(),
      description: data.description.trim(),
      category: catKey,
      location: data.location.trim(),
      latitude: data.latitude !== undefined && data.latitude !== null ? Number(data.latitude) : null,
      longitude: data.longitude !== undefined && data.longitude !== null ? Number(data.longitude) : null,
      severity: data.severity.toUpperCase(),
      peopleAffected: Number(data.peopleAffected) || 1,
      priorityScore,
      priorityLevel,
      status: 'REPORTED',
      supportCount: 0,
      supportedBy: [],
      adminHistory: [],
      fieldNotes: '',
      reportedBy: Number(data.reportedBy) || 1,
      reportedByName: data.reportedByName || 'Kasun Perera',
      adminNotes: '',
      assignedOfficer: officerInfo.id,
      assignedOfficerName: officerInfo.name,
      createdAt,
      updatedAt: createdAt,
    };
    issues.unshift(newIssue);
    return newIssue;
  },
  updateIssue: (id, updateData) => {
    const issueIndex = issues.findIndex((i) => i.id === Number(id) || i.id === id);
    if (issueIndex === -1) return null;

    const existing = issues[issueIndex];
    const updated = {
      ...existing,
      ...updateData,
      id: existing.id,
      reportedBy: existing.reportedBy,
      updatedAt: new Date().toISOString(),
    };

    // If severity or people affected changed, recalculate priority
    if (updateData.severity || updateData.peopleAffected) {
      const { priorityScore, priorityLevel } = calculatePriority(
        updated.severity,
        updated.peopleAffected,
        null,
        updated.createdAt
      );
      updated.priorityScore = priorityScore;
      updated.priorityLevel = priorityLevel;
    }

    issues[issueIndex] = updated;
    return updated;
  },
  deleteIssue: (id) => {
    const issueIndex = issues.findIndex((i) => i.id === Number(id) || i.id === id);
    if (issueIndex === -1) return false;
    issues.splice(issueIndex, 1);
    return true;
  },

  // ─── Admin / Priority Engine Methods ────────────────────────────────────────

  getAdminStats: () => {
    const total = issues.length;
    const open = issues.filter((i) => ['REPORTED', 'UNDER_REVIEW'].includes(i.status)).length;
    const inProgress = issues.filter((i) => i.status === 'IN_PROGRESS').length;
    const critical = issues.filter((i) => i.priorityLevel === 'CRITICAL').length;
    const resolved = issues.filter((i) => i.status === 'RESOLVED').length;
    return { totalIssues: total, openIssues: open, inProgressIssues: inProgress, criticalIssues: critical, resolvedIssues: resolved };
  },

  // Officer-specific helpers
  getAssignedIssues: (officerId, filters = {}) => {
    let filtered = issues.filter((i) => i.assignedOfficer === Number(officerId));
    const { status, priorityLevel, category, search } = filters;
    if (status && status !== 'ALL') filtered = filtered.filter((i) => i.status === status.toUpperCase());
    if (priorityLevel && priorityLevel !== 'ALL') filtered = filtered.filter((i) => i.priorityLevel === priorityLevel.toUpperCase());
    if (category && category !== 'ALL') filtered = filtered.filter((i) => i.category === category.toUpperCase());
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.title.toLowerCase().includes(term) ||
          i.location.toLowerCase().includes(term) ||
          i.description.toLowerCase().includes(term)
      );
    }
    filtered.sort((a, b) => b.priorityScore - a.priorityScore || new Date(a.createdAt) - new Date(b.createdAt));
    return filtered;
  },

  getOfficerStats: (officerId) => {
    const mine = issues.filter((i) => i.assignedOfficer === Number(officerId));
    return {
      totalIssues: mine.length,
      openIssues: mine.filter((i) => ['REPORTED', 'UNDER_REVIEW'].includes(i.status)).length,
      inProgressIssues: mine.filter((i) => i.status === 'IN_PROGRESS').length,
      resolvedIssues: mine.filter((i) => i.status === 'RESOLVED').length,
      criticalIssues: mine.filter((i) => i.priorityLevel === 'CRITICAL').length,
    };
  },

  reassignOfficer: (id, officerId, officerName) => {
    const issueIndex = issues.findIndex((i) => i.id === Number(id) || i.id === id);
    if (issueIndex === -1) return null;
    issues[issueIndex].assignedOfficer = Number(officerId);
    issues[issueIndex].assignedOfficerName = officerName;
    issues[issueIndex].updatedAt = new Date().toISOString();
    return issues[issueIndex];
  },

  getOfficers: () => users.filter((u) => u.role === 'OFFICER'),

  getPriorityQueue: ({ status, priorityLevel, category, search } = {}) => {
    let filtered = [...issues];
    if (status && status !== 'ALL') filtered = filtered.filter((i) => i.status === status.toUpperCase());
    if (priorityLevel && priorityLevel !== 'ALL') filtered = filtered.filter((i) => i.priorityLevel === priorityLevel.toUpperCase());
    if (category && category !== 'ALL') filtered = filtered.filter((i) => i.category === category.toUpperCase());
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.title.toLowerCase().includes(term) ||
          i.location.toLowerCase().includes(term) ||
          i.description.toLowerCase().includes(term)
      );
    }
    // Sort descending by priority score, then ascending by age (oldest unresolved first)
    filtered.sort((a, b) => b.priorityScore - a.priorityScore || new Date(a.createdAt) - new Date(b.createdAt));
    return filtered;
  },

  updateIssueStatus: (id, { newStatus, adminNotes, adjustedSeverity } = {}) => {
    const issueIndex = issues.findIndex((i) => i.id === Number(id) || i.id === id);
    if (issueIndex === -1) return null;

    const existing = issues[issueIndex];
    const updated = {
      ...existing,
      status: newStatus.toUpperCase(),
      updatedAt: new Date().toISOString(),
    };

    if (adminNotes !== undefined) updated.adminNotes = adminNotes;

    if (adjustedSeverity) {
      updated.severity = adjustedSeverity.toUpperCase();
      const { priorityScore, priorityLevel } = calculatePriority(
        updated.severity,
        updated.peopleAffected,
        null,
        updated.createdAt
      );
      updated.priorityScore = priorityScore;
      updated.priorityLevel = priorityLevel;
    }

    issues[issueIndex] = updated;
    return updated;
  },
};
