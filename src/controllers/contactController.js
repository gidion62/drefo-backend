const Contact = require('../models/Contact');
const { sendContactNotification, sendContactAutoReply } = require('../utils/email');

/** POST /api/contact  — public */
exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const contact = await Contact.create({ name, email, subject, message });

    // Send notifications (non-blocking — errors logged inside utils)
    sendContactNotification(contact);
    sendContactAutoReply(contact);

    res.status(201).json({
      success: true,
      message: 'Your message has been received. We will be in touch soon.',
    });
  } catch (err) {
    next(err);
  }
};

/** GET /api/admin/contacts  — admin */
exports.getContacts = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const contacts = await Contact.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (err) {
    next(err);
  }
};

/** PATCH /api/admin/contacts/:id  — admin (update status / notes) */
exports.updateContact = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true, runValidators: true }
    );
    if (!contact) return res.status(404).json({ success: false, message: 'Message not found.' });
    res.status(200).json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/admin/contacts/:id  — admin */
exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Message not found.' });
    res.status(200).json({ success: true, message: 'Message deleted.' });
  } catch (err) {
    next(err);
  }
};
