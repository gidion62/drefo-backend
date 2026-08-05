const express = require('express');
const router = express.Router();

const { getProjects, getProject }        = require('../controllers/projectController');
const { getUpdates, getUpdate }          = require('../controllers/updateController');
const { getGallery }                     = require('../controllers/galleryController');
const { submitContact }                  = require('../controllers/contactController');
const { submitVolunteer }                = require('../controllers/volunteerController');

// ── Projects ───────────────────────────────
router.get('/projects',      getProjects);
router.get('/projects/:id',  getProject);

// ── Updates (News) ─────────────────────────
router.get('/updates',       getUpdates);
router.get('/updates/:id',   getUpdate);

// ── Gallery ────────────────────────────────
router.get('/gallery',       getGallery);

// ── Contact form ───────────────────────────
router.post('/contact',      submitContact);

// ── Volunteer application ──────────────────
router.post('/volunteer',    submitVolunteer);

module.exports = router;
