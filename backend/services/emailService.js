const { Resend } = require('resend');
const User = require('../models/User');
const templates = require('./emailTemplates');

const FROM = process.env.RESEND_FROM_EMAIL;
let resend;

function getResendClient() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

async function sendEmail({ to, subject, html }) {
  try {
    await getResendClient().emails.send({ from: FROM, to, subject, html });
  } catch (err) {
    console.error('[emailService] send failed:', err.message);
  }
}

async function getAdminEmails() {
  const admins = await User.find({ role: 'admin' }).select('email');
  return admins.map(a => a.email);
}

exports.sendWelcomeEmail = async (user) => {
  try {
    const { subject, html } = templates.welcomeEmail(user);
    await sendEmail({ to: user.email, subject, html });
  } catch (err) {
    console.error('[emailService] sendWelcomeEmail failed:', err.message);
  }
};

exports.sendAppointmentConfirmation = async (appointment) => {
  try {
    if (appointment.client?.email) {
      const { subject, html } = templates.appointmentConfirmation(appointment, 'client');
      await sendEmail({ to: appointment.client.email, subject, html });
    }
    if (appointment.agent?.email) {
      const { subject, html } = templates.appointmentConfirmation(appointment, 'agent');
      await sendEmail({ to: appointment.agent.email, subject, html });
    }
  } catch (err) {
    console.error('[emailService] sendAppointmentConfirmation failed:', err.message);
  }
};

exports.sendAppointmentStatusUpdate = async (appointment) => {
  try {
    if (appointment.client?.email) {
      const { subject, html } = templates.appointmentStatusUpdate(appointment, 'client');
      await sendEmail({ to: appointment.client.email, subject, html });
    }
    if (appointment.agent?.email) {
      const { subject, html } = templates.appointmentStatusUpdate(appointment, 'agent');
      await sendEmail({ to: appointment.agent.email, subject, html });
    }
  } catch (err) {
    console.error('[emailService] sendAppointmentStatusUpdate failed:', err.message);
  }
};

exports.sendNewLeadNotification = async (lead) => {
  try {
    const { subject, html } = templates.newLeadNotification(lead);
    let to;
    if (lead.agent) {
      const agent = await User.findById(lead.agent).select('email');
      to = agent?.email;
    }
    if (!to) to = await getAdminEmails();
    if (to && to.length !== 0) await sendEmail({ to, subject, html });
  } catch (err) {
    console.error('[emailService] sendNewLeadNotification failed:', err.message);
  }
};

exports.sendNewReviewAdminAlert = async (review) => {
  try {
    const admins = await getAdminEmails();
    if (admins.length === 0) return;
    const { subject, html } = templates.newReviewAdminAlert(review);
    await sendEmail({ to: admins, subject, html });
  } catch (err) {
    console.error('[emailService] sendNewReviewAdminAlert failed:', err.message);
  }
};

exports.sendReviewApprovedNotification = async (review) => {
  try {
    const agent = await User.findById(review.agent).select('firstName email');
    if (!agent?.email) return;
    const { subject, html } = templates.reviewApprovedNotification(review, agent);
    await sendEmail({ to: agent.email, subject, html });
  } catch (err) {
    console.error('[emailService] sendReviewApprovedNotification failed:', err.message);
  }
};

exports.sendPasswordChangedNotification = async (user) => {
  try {
    const { subject, html } = templates.passwordChangedNotification(user);
    await sendEmail({ to: user.email, subject, html });
  } catch (err) {
    console.error('[emailService] sendPasswordChangedNotification failed:', err.message);
  }
};

exports.sendPasswordResetEmail = async (user, rawToken) => {
  try {
    const { subject, html } = templates.passwordResetEmail(user, rawToken);
    await sendEmail({ to: user.email, subject, html });
  } catch (err) {
    console.error('[emailService] sendPasswordResetEmail failed:', err.message);
  }
};
