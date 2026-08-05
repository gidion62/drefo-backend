const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: 150,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    interests: {
      type: [String],
      enum: ['Education', 'Health', 'Community Outreach', 'Administration', 'Event Planning'],
    },
    skills: {
      type: String,
      trim: true,
    },
    availability: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Weekends', 'Flexible'],
      required: [true, 'Availability is required'],
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'accepted', 'declined'],
      default: 'pending',
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    emailNotificationSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

volunteerSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Volunteer', volunteerSchema);
