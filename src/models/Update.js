const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 300,
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      trim: true,
      maxlength: 500,
    },
    content: {
      type: String,
      trim: true,
    },
    date: {
      type: String,        // e.g. "March 15, 2025"  — display string
      required: [true, 'Date is required'],
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    image: {
      type: String,
      default: null,
    },
    published: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

updateSchema.index({ publishedAt: -1 });

module.exports = mongoose.model('Update', updateSchema);
