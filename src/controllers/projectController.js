const Project = require('../models/Project');
const fs = require('fs');
const path = require('path');

/**
 * GET /api/projects
 * Public — returns all projects sorted by order
 */
exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ featured: -1, order: 1, createdAt: 1 });
    res.status(200).json({ success: true, data: projects });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/projects/:id
 * Public
 */
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/projects
 * Admin — create project, optionally with image upload
 */
exports.createProject = async (req, res, next) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      data.image = `/uploads/images/${req.file.filename}`;
    }

    // Parse objectives if sent as JSON string
    if (data.objectives && typeof data.objectives === 'string') {
      try { data.objectives = JSON.parse(data.objectives); } catch { data.objectives = []; }
    }

    const project = await Project.create(data);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/admin/projects/:id
 * Admin — update project
 */
exports.updateProject = async (req, res, next) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      // Remove old image file if replacing
      const existing = await Project.findById(req.params.id);
      if (existing && existing.image) {
        const oldPath = path.join(__dirname, '../../', existing.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      data.image = `/uploads/images/${req.file.filename}`;
    }

    if (data.objectives && typeof data.objectives === 'string') {
      try { data.objectives = JSON.parse(data.objectives); } catch { delete data.objectives; }
    }

    const project = await Project.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    res.status(200).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/projects/:id
 * Admin
 */
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    // Remove image file
    if (project.image) {
      const imgPath = path.join(__dirname, '../../', project.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await project.deleteOne();
    res.status(200).json({ success: true, message: 'Project deleted.' });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/stats
 * Admin dashboard summary counts
 */
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [projects, volunteers, contacts, updates, gallery] = await Promise.all([
      require('../models/Project').countDocuments(),
      require('../models/Volunteer').countDocuments(),
      require('../models/Contact').countDocuments({ status: 'unread' }),
      require('../models/Update').countDocuments({ published: true }),
      require('../models/Gallery').countDocuments({ visible: true }),
    ]);
    res.status(200).json({ success: true, data: { projects, volunteers, unreadMessages: contacts, updates, gallery } });
  } catch (err) {
    next(err);
  }
};
