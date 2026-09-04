/**
 * In-Memory fallback store with seeded Sri Lankan data
 * Used seamlessly if MongoDB daemon is not running locally.
 */

const { calculatePriority } = require('../utils/priorityCalculator');

const demoUsers = [
  {
    id: 1,
    fullName: 'Kasun Perera',
    email: 'kasun.citizen@gramafix.lk',
    role: 'RESIDENT',
    communityArea: 'Matale Town',
  },
  {
    id: 2,
    fullName: 'Eng. Bandara',
    email: 'admin.bandara@gramafix.lk',
    role: 'ADMIN',
    communityArea: 'Matale Municipal Council',
  },
];

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
    severity: 'HIGH',
    peopleAffected: 150,
    priorityScore: 82,
    priorityLevel: 'HIGH',
    status: 'REPORTED',
    supportCount: 28,
    reportedBy: 1,
    reportedByName: 'Kasun Perera',
    adminNotes: '',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
  },
  {
    id: 102,
    title: 'Deep Hazardous Pothole Near Kandy Clock Tower',
    description: 'Massive pothole approx 2 feet wide on the main bus lane. Motorbikes frequently swerve into oncoming traffic to avoid it, causing near collisions.',
    category: 'ROAD',
    location: 'Peradeniya Road Junction, Kandy',
    severity: 'CRITICAL',
    peopleAffected: 350,
    priorityScore: 94,
    priorityLevel: 'CRITICAL',
    status: 'UNDER_REVIEW',
    supportCount: 42,
    reportedBy: 1,
    reportedByName: 'Kasun Perera',
    adminNotes: 'Assigned to Central Province RDA inspection unit.',
    createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
  },
  {
    id: 103,
    title: 'Non-Functioning Streetlights along Galle Fort Ramparts',
    description: 'Five consecutive street lamp posts have been dark for over a week. Creates security issues for residents and evening walkers.',
    category: 'STREETLIGHT',
    location: 'Rampart Street, Galle Fort',
    severity: 'MEDIUM',
    peopleAffected: 65,
    priorityScore: 56,
    priorityLevel: 'MEDIUM',
    status: 'IN_PROGRESS',
    supportCount: 14,
    reportedBy: 2,
    reportedByName: 'Eng. Bandara',
    adminNotes: 'Technician dispatched for lamp replacement.',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
  {
    id: 104,
    title: 'Garbage Dump Overflowing Near Market Entrance',
    description: 'Municipal waste bins overflowing with organic waste. Stray animals spreading garbage onto pedestrian path, severe stench.',
    category: 'WASTE',
    location: 'Central Market Road, Colombo 11',
    severity: 'HIGH',
    peopleAffected: 220,
    priorityScore: 84,
    priorityLevel: 'HIGH',
    status: 'RESOLVED',
    supportCount: 31,
    reportedBy: 1,
    reportedByName: 'Kasun Perera',
    adminNotes: 'Cleared by Municipal Waste Management crew on Sept 3.',
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  }
];

let nextIssueId = 105;

module.exports = {
  getDemoUsers: () => demoUsers,
  getCategories: () => categories,
  getAllIssues: () => issues,
  getIssueById: (id) => issues.find((i) => i.id === Number(id) || i.id === id),
  getMyReports: (userId = 1) => issues.filter((i) => i.reportedBy === Number(userId)),
  createIssue: (data) => {
    const { priorityScore, priorityLevel } = calculatePriority(data.severity, data.peopleAffected);
    const newIssue = {
      id: nextIssueId++,
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category.toUpperCase(),
      location: data.location.trim(),
      severity: data.severity.toUpperCase(),
      peopleAffected: Number(data.peopleAffected) || 1,
      priorityScore,
      priorityLevel,
      status: 'REPORTED',
      supportCount: 0,
      reportedBy: Number(data.reportedBy) || 1,
      reportedByName: data.reportedByName || 'Kasun Perera',
      adminNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
};
