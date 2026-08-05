const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    src: {
      type: String,
      required: [true, 'Image path is required'],
    },
    alt: {
      type: String,
      required: [true, 'Alt text is required'],
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    order: {
      type: Number,
      default: 0,
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

gallerySchema.index({ order: 1, visible: 1 });

module.exports = mongoose.model('Gallery', gallerySchema);
