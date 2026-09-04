const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    numericId: {
      type: Number,
      unique: true,
      sparse: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['CITIZEN', 'OFFICER', 'ADMIN', 'RESIDENT'],
      default: 'CITIZEN',
    },
    communityArea: {
      type: String,
      default: 'Matale Town',
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      sparse: true,
      index: true,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
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

// Automatically generate numericId if not explicitly supplied
userSchema.pre('validate', async function (next) {
  if (!this.numericId) {
    this.numericId = await require('./Counter').nextId('users', this.constructor);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
