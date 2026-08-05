const Update = require('../models/Update');
const fs = require('fs');
const path = require('path');

/** GET /api/updates  — public */
exports.getUpdates = async (req, res, next) => {
  try {
    const updates = await Update.find({ published: true }).sort({ publishedAt: -1 });
    res.status(200).json({ success: true, data: updates });
  } catch (err) {
    next(err);
  }
};

/** GET /api/updates/:id  — public */
exports.getUpdate = async (req, res, next) => {
  try {
    const update = await Update.findOne({ _id: req.params.id, published: true });
    if (!update) return res.status(404).json({ success: false, message: 'Article not found.' });
    res.status(200).json({ success: true, data: update });
  } catch (err) {
    next(err);
  }
};

/** POST /api/admin/updates  — admin */
exports.createUpdate = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/images/${req.file.filename}`;
    const update = await Update.create(data);
    res.status(201).json({ success: true, data: update });
  } catch (err) {
    next(err);
  }
};

/** PATCH /api/admin/updates/:id  — admin */
exports.updateUpdate = async (req, res, next) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      const existing = await Update.findById(req.params.id);
      if (existing && existing.image) {
        const oldPath = path.join(__dirname, '../../', existing.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      data.image = `/uploads/images/${req.file.filename}`;
    }

    const update = await Update.findByIdAndUpdate(req.params.id, data, {
      new: true, runValidators: true,
    });

    if (!update) return res.status(404).json({ success: false, message: 'Article not found.' });
    res.status(200).json({ success: true, data: update });
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/admin/updates/:id  — admin */
exports.deleteUpdate = async (req, res, next) => {
  try {
    const update = await Update.findById(req.params.id);
    if (!update) return res.status(404).json({ success: false, message: 'Article not found.' });

    if (update.image) {
      const imgPath = path.join(__dirname, '../../', update.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await update.deleteOne();
    res.status(200).json({ success: true, message: 'Article deleted.' });
  } catch (err) {
    next(err);
  }
};

/** GET /api/admin/updates  — admin (all, including unpublished) */
exports.adminGetUpdates = async (req, res, next) => {
  try {
    const updates = await Update.find().sort({ publishedAt: -1 });
    res.status(200).json({ success: true, data: updates });
  } catch (err) {
    next(err);
  }
};
