const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send email notification to admin when a contact form is submitted
 */
const sendContactNotification = async (contact) => {
  if (!process.env.EMAIL_USER) return; // skip if email not configured
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@drefo.org',
      to: process.env.ADMIN_NOTIFY_EMAIL,
      subject: `[drefo Contact] ${contact.subject} — from ${contact.name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Subject:</strong> ${contact.subject}</p>
        <hr/>
        <p>${contact.message.replace(/\n/g, '<br/>')}</p>
        <hr/>
        <p style="color:#888;font-size:12px">Received at ${new Date().toISOString()}</p>
      `,
    });
  } catch (err) {
    console.error('Email notification error (contact):', err.message);
  }
};

/**
 * Send auto-reply to person who submitted contact form
 */
const sendContactAutoReply = async (contact) => {
  if (!process.env.EMAIL_USER) return;
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@drefo.org',
      to: contact.email,
      subject: 'We received your message — Dreamers Foundation',
      html: `
        <p>Dear ${contact.name},</p>
        <p>Thank you for reaching out to Dreamers Foundation (drefo). We have received your message and will get back to you as soon as possible.</p>
        <p><strong>Your message:</strong><br/>${contact.message.replace(/\n/g, '<br/>')}</p>
        <br/>
        <p>Warm regards,<br/>Dreamers Foundation Team<br/>Moshi, Tanzania</p>
      `,
    });
  } catch (err) {
    console.error('Email auto-reply error (contact):', err.message);
  }
};

/**
 * Send email notification to admin when a volunteer applies
 */
const sendVolunteerNotification = async (volunteer) => {
  if (!process.env.EMAIL_USER) return;
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@drefo.org',
      to: process.env.ADMIN_NOTIFY_EMAIL,
      subject: `[drefo Volunteer] New application from ${volunteer.fullName}`,
      html: `
        <h2>New Volunteer Application</h2>
        <p><strong>Name:</strong> ${volunteer.fullName}</p>
        <p><strong>Email:</strong> ${volunteer.email}</p>
        <p><strong>Phone:</strong> ${volunteer.phone}</p>
        <p><strong>Location:</strong> ${volunteer.location}</p>
        <p><strong>Availability:</strong> ${volunteer.availability}</p>
        <p><strong>Interests:</strong> ${(volunteer.interests || []).join(', ')}</p>
        <p><strong>Skills:</strong> ${volunteer.skills || '—'}</p>
        <p><strong>Message:</strong><br/>${(volunteer.message || '').replace(/\n/g, '<br/>')}</p>
        <hr/>
        <p style="color:#888;font-size:12px">Submitted at ${new Date().toISOString()}</p>
      `,
    });
  } catch (err) {
    console.error('Email notification error (volunteer):', err.message);
  }
};

/**
 * Send confirmation to volunteer applicant
 */
const sendVolunteerAutoReply = async (volunteer) => {
  if (!process.env.EMAIL_USER) return;
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@drefo.org',
      to: volunteer.email,
      subject: 'Your Volunteer Application — Dreamers Foundation',
      html: `
        <p>Dear ${volunteer.fullName},</p>
        <p>Thank you for applying to volunteer with <strong>Dreamers Foundation (drefo)</strong>! We are grateful for your interest in supporting our mission.</p>
        <p>Our team will review your application and reach out to you soon with next steps.</p>
        <br/>
        <p>With gratitude,<br/>Dreamers Foundation Team<br/>Moshi, Tanzania</p>
      `,
    });
  } catch (err) {
    console.error('Email auto-reply error (volunteer):', err.message);
  }
};

module.exports = {
  sendContactNotification,
  sendContactAutoReply,
  sendVolunteerNotification,
  sendVolunteerAutoReply,
};
