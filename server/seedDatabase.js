const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Issue = require('./models/Issue');

const seedIssues = [
  {
    numericId: 102,
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
  },
  {
    numericId: 103,
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
  },
  {
    numericId: 104,
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
    adminNotes: 'Cleared by Municipal Waste Management crew.',
  },
  {
    numericId: 105,
    title: 'Broken Water Main Flooding Residential Lane',
    description: 'Underground municipal water pipeline cracked and spraying clean drinking water across the road, causing mud build up and low tap pressure.',
    category: 'WATER',
    location: 'Temple Road, Matale',
    severity: 'HIGH',
    peopleAffected: 180,
    priorityScore: 78,
    priorityLevel: 'HIGH',
    status: 'REPORTED',
    supportCount: 23,
    reportedBy: 1,
    reportedByName: 'Kasun Perera',
  },
  {
    numericId: 106,
    title: 'Stagnant Canal Canal Water Mosquito Breeding Hazard',
    description: 'Canal bed clogged by plastic bags and silt causing stagnant black water within 50m of preschool. Severe dengue risk during rainy season.',
    category: 'DRAINAGE',
    location: 'Hospital Road, Kurunegala',
    severity: 'HIGH',
    peopleAffected: 300,
    priorityScore: 88,
    priorityLevel: 'HIGH',
    status: 'REPORTED',
    supportCount: 37,
    reportedBy: 1,
    reportedByName: 'Kasun Perera',
  }
];

async function seed() {
  const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoURI) {
    console.log('No MONGO_URI provided in env');
    process.exit(1);
  }
  await mongoose.connect(mongoURI);
  console.log('Connected to MongoDB Atlas');

  for (const item of seedIssues) {
    const exists = await Issue.findOne({ numericId: item.numericId });
    if (!exists) {
      await Issue.create(item);
      console.log(`Seeded issue #${item.numericId}: ${item.title}`);
    } else {
      console.log(`Issue #${item.numericId} already exists`);
    }
  }

  console.log('Database seeding complete!');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
