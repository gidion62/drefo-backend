const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Education', 'Health', 'Community', 'Youth', 'Empowerment', 'Family', 'Friendship', 'Other'],
    },
    status: {
      type: String,
      enum: ['Active', 'Completed', 'Paused'],
      default: 'Active',
    },
    image: {
      type: String,       // relative path: /uploads/images/filename.jpg
      default: null,
    },
    objectives: [{ type: String, trim: true }],
    impact: {
      type: String,
      trim: true,
    },
    startYear: {
      type: Number,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for sorting by order and featured
projectSchema.index({ featured: -1, order: 1 });

module.exports = mongoose.model('Project', projectSchema);
