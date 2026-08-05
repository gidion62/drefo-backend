const Volunteer = require('../models/Volunteer');
const { sendVolunteerNotification, sendVolunteerAutoReply } = require('../utils/email');

/** POST /api/volunteer  — public */
exports.submitVolunteer = async (req, res, next) => {
  try {
    const { fullName, email, phone, location, interests, skills, availability, message } = req.body;

    if (!fullName || !email || !phone || !location || !availability) {
      return res.status(400).json({
        success: false,
        message: 'fullName, email, phone, location, and availability are required.',
      });
    }

    const volunteer = await Volunteer.create({
      fullName, email, phone, location,
      interests: Array.isArray(interests) ? interests : [],
      skills, availability, message,
    });

    // Notifications (non-blocking)
    sendVolunteerNotification(volunteer);
    sendVolunteerAutoReply(volunteer);

    res.status(201).json({
      success: true,
      message: 'Your volunteer application has been submitted successfully. We will contact you soon.',
    });
  } catch (err) {
    next(err);
  }
};

/** GET /api/admin/volunteers  — admin */
exports.getVolunteers = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const volunteers = await Volunteer.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: volunteers });
  } catch (err) {
    next(err);
  }
};

/** GET /api/admin/volunteers/:id  — admin */
exports.getVolunteer = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) return res.status(404).json({ success: false, message: 'Application not found.' });
    res.status(200).json({ success: true, data: volunteer });
  } catch (err) {
    next(err);
  }
};

/** PATCH /api/admin/volunteers/:id  — admin (update status / notes) */
exports.updateVolunteer = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true, runValidators: true }
    );
    if (!volunteer) return res.status(404).json({ success: false, message: 'Application not found.' });
    res.status(200).json({ success: true, data: volunteer });
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/admin/volunteers/:id  — admin */
exports.deleteVolunteer = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
    if (!volunteer) return res.status(404).json({ success: false, message: 'Application not found.' });
    res.status(200).json({ success: true, message: 'Application deleted.' });
  } catch (err) {
    next(err);
  }
};
