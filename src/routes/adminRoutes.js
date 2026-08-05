const express = require('express');
const router = express.Router();
const { protect }                          = require('../middleware/auth');
const upload                               = require('../middleware/upload');

const { createProject, updateProject, deleteProject, getDashboardStats }
                                           = require('../controllers/projectController');
const { createUpdate, updateUpdate, deleteUpdate, adminGetUpdates }
                                           = require('../controllers/updateController');
const { getContacts, updateContact, deleteContact }
                                           = require('../controllers/contactController');
const { getVolunteers, getVolunteer, updateVolunteer, deleteVolunteer }
                                           = require('../controllers/volunteerController');
const { uploadGalleryItem, updateGalleryItem, deleteGalleryItem, adminGetGallery }
                                           = require('../controllers/galleryController');

// All admin routes require authentication
router.use(protect);

// ── Dashboard ──────────────────────────────
router.get('/stats', getDashboardStats);

// ── Projects ───────────────────────────────
router.post  ('/projects',      upload.single('image'), createProject);
router.patch ('/projects/:id',  upload.single('image'), updateProject);
router.delete('/projects/:id',  deleteProject);

// ── Updates (News) ─────────────────────────
router.get   ('/updates',       adminGetUpdates);
router.post  ('/updates',       upload.single('image'), createUpdate);
router.patch ('/updates/:id',   upload.single('image'), updateUpdate);
router.delete('/updates/:id',   deleteUpdate);

// ── Contacts (Messages) ────────────────────
router.get   ('/contacts',      getContacts);
router.patch ('/contacts/:id',  updateContact);
router.delete('/contacts/:id',  deleteContact);

// ── Volunteers ─────────────────────────────
router.get   ('/volunteers',       getVolunteers);
router.get   ('/volunteers/:id',   getVolunteer);
router.patch ('/volunteers/:id',   updateVolunteer);
router.delete('/volunteers/:id',   deleteVolunteer);

// ── Gallery ────────────────────────────────
router.get   ('/gallery',       adminGetGallery);
router.post  ('/gallery',       upload.single('image'), uploadGalleryItem);
router.patch ('/gallery/:id',   updateGalleryItem);
router.delete('/gallery/:id',   deleteGalleryItem);

module.exports = router;
