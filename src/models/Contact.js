const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
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
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      enum: ['General Inquiry', 'Partnership', 'Donation', 'Media', 'Other'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'replied', 'archived'],
      default: 'unread',
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

contactSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Contact', contactSchema);
