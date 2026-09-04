const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    numericId: {
      type: Number,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['ROAD', 'STREETLIGHT', 'WASTE', 'WATER', 'DRAINAGE', 'TRAFFIC', 'ENVIRONMENT', 'OTHER'],
      uppercase: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [120, 'Location cannot exceed 120 characters'],
    },
    severity: {
      type: String,
      required: [true, 'Severity is required'],
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
      uppercase: true,
    },
    peopleAffected: {
      type: Number,
      required: [true, 'Estimated people affected is required'],
      min: [1, 'People affected must be at least 1'],
      default: 10,
    },
    priorityScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    priorityLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['REPORTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'DUPLICATE', 'REJECTED'],
      default: 'REPORTED',
      uppercase: true,
    },
    supportedBy: { type: [Number], default: [] },
    supportCount: {
      type: Number,
      default: 0,
    },
    reportedBy: {
      type: Number,
      default: 1, // Default to demo resident Kasun Perera (id: 1)
    },
    reportedByName: {
      type: String,
      default: 'Kasun Perera',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    fieldNotes: { type: String, default: '', maxlength: 500 },
    adminHistory: { type: [{
      _id: false, id: String, type: String, timestamp: Date,
      actorId: mongoose.Schema.Types.Mixed, actorName: String, actorRole: String,
      before: mongoose.Schema.Types.Mixed, after: mongoose.Schema.Types.Mixed, note: String,
    }], default: [] },
    assignedOfficer: {
      type: Number,
      default: null,
    },
    assignedOfficerName: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret.numericId || ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Auto-increment numericId simulation before saving
issueSchema.pre('save', async function (next) {
  if (!this.numericId) {
    this.numericId = await require('./Counter').nextId('issues', this.constructor, 100);
  }
  next();
});

module.exports = mongoose.model('Issue', issueSchema);
