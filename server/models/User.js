const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    numericId: {
      type: Number,
      required: true,
      unique: true,
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
      default: 'password123',
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

module.exports = mongoose.model('User', userSchema);
