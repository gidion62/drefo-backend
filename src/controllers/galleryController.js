const Gallery = require('../models/Gallery');
const fs = require('fs');
const path = require('path');

/** GET /api/gallery  — public */
exports.getGallery = async (req, res, next) => {
  try {
    const items = await Gallery.find({ visible: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

/** POST /api/admin/gallery  — admin, multipart/form-data */
exports.uploadGalleryItem = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required.' });
    }

    const { alt, caption, category, order } = req.body;

    if (!alt) {
      return res.status(400).json({ success: false, message: 'Alt text is required.' });
    }

    const item = await Gallery.create({
      src: `/uploads/images/${req.file.filename}`,
      alt,
      caption: caption || '',
      category: category || 'General',
      order: order ? parseInt(order) : 0,
    });

    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

/** PATCH /api/admin/gallery/:id  — admin */
exports.updateGalleryItem = async (req, res, next) => {
  try {
    const { alt, caption, category, order, visible } = req.body;
    const item = await Gallery.findByIdAndUpdate(
      req.params.id,
      { alt, caption, category, order, visible },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found.' });
    res.status(200).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/admin/gallery/:id  — admin */
exports.deleteGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found.' });

    // Remove file from disk
    const imgPath = path.join(__dirname, '../../', item.src);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

    await item.deleteOne();
    res.status(200).json({ success: true, message: 'Gallery item deleted.' });
  } catch (err) {
    next(err);
  }
};

/** GET /api/admin/gallery  — admin (all items including hidden) */
exports.adminGetGallery = async (req, res, next) => {
  try {
    const items = await Gallery.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};
