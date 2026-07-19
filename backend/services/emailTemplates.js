const BRAND = {
  navy: '#1B2B4B',
  gold: '#C9A84C',
  cream: '#FAF8F3',
};

function wrapTemplate(heading, bodyHtml) {
  return `
  <div style="background:${BRAND.cream};padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#2C2C2C;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:4px;overflow:hidden;">
      <div style="background:${BRAND.navy};padding:24px 32px;">
        <span style="color:${BRAND.gold};font-size:20px;font-weight:bold;letter-spacing:0.5px;">LuxEstate</span>
      </div>
      <div style="padding:32px;">
        <h1 style="font-size:20px;color:${BRAND.navy};margin:0 0 16px;">${heading}</h1>
        ${bodyHtml}
      </div>
      <div style="background:${BRAND.navy};padding:16px 32px;text-align:center;">
        <span style="color:rgba(255,255,255,0.5);font-size:12px;">&copy; ${new Date().getFullYear()} LuxEstate Realty Group</span>
      </div>
    </div>
  </div>`;
}

function button(url, label) {
  return `<a href="${url}" style="display:inline-block;background:${BRAND.gold};color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:4px;font-weight:bold;margin-top:8px;">${label}</a>`;
}

exports.welcomeEmail = (user) => ({
  subject: `Welcome to LuxEstate, ${user.firstName}!`,
  html: wrapTemplate('Welcome to LuxEstate', `
    <p>Hi ${user.firstName},</p>
    <p>Your ${user.role === 'agent' ? 'agent' : 'client'} account has been created. You can now ${user.role === 'agent' ? 'list properties, manage leads, and book showings' : 'save properties, book showings, and track your favorites'} from your dashboard.</p>
    ${button(`${process.env.CLIENT_URL}/${user.role === 'agent' ? 'agent' : 'client'}`, 'Go to Dashboard')}
  `),
});

exports.appointmentConfirmation = (appointment, recipientRole) => {
  const dateStr = new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const other = recipientRole === 'client' ? appointment.agent : appointment.client;
  return {
    subject: `Showing Confirmed: ${appointment.property?.title || 'Property Showing'}`,
    html: wrapTemplate('Showing Scheduled', `
      <p>A ${appointment.type} showing has been scheduled for <strong>${appointment.property?.title || 'the property'}</strong>.</p>
      <p><strong>Date:</strong> ${dateStr}<br/><strong>Time:</strong> ${appointment.timeSlot}<br/>
      <strong>${recipientRole === 'client' ? 'Agent' : 'Client'}:</strong> ${other?.firstName || ''} ${other?.lastName || ''}</p>
      ${button(`${process.env.CLIENT_URL}/${recipientRole}/appointments`, 'View Appointment')}
    `),
  };
};

exports.appointmentStatusUpdate = (appointment, recipientRole) => {
  const dateStr = new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const statusLabel = appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1);
  return {
    subject: `Showing ${statusLabel}: ${appointment.property?.title || 'Property Showing'}`,
    html: wrapTemplate(`Showing ${statusLabel}`, `
      <p>Your showing for <strong>${appointment.property?.title || 'the property'}</strong> on ${dateStr} at ${appointment.timeSlot} is now <strong>${appointment.status}</strong>.</p>
      ${appointment.cancelReason ? `<p><strong>Reason:</strong> ${appointment.cancelReason}</p>` : ''}
      ${button(`${process.env.CLIENT_URL}/${recipientRole}/appointments`, 'View Appointment')}
    `),
  };
};

exports.newLeadNotification = (lead) => ({
  subject: `New ${lead.type} Inquiry from ${lead.name}`,
  html: wrapTemplate('New Lead', `
    <p><strong>${lead.name}</strong> submitted a ${lead.type} inquiry.</p>
    <p><strong>Email:</strong> ${lead.email}<br/>${lead.phone ? `<strong>Phone:</strong> ${lead.phone}<br/>` : ''}
    ${lead.message ? `<strong>Message:</strong> ${lead.message}` : ''}</p>
    ${button(`${process.env.CLIENT_URL}/agent/leads`, 'View Lead')}
  `),
});

exports.newReviewAdminAlert = (review) => ({
  subject: 'New Review Pending Approval',
  html: wrapTemplate('New Review Submitted', `
    <p><strong>${review.clientName}</strong> left a ${review.rating}-star review${review.transactionType ? ` (${review.transactionType})` : ''}.</p>
    <p>"${review.comment}"</p>
    ${button(`${process.env.CLIENT_URL}/admin/reviews`, 'Moderate Reviews')}
  `),
});

exports.reviewApprovedNotification = (review, agent) => ({
  subject: `Your review from ${review.clientName} is now live`,
  html: wrapTemplate('Review Approved', `
    <p>Hi ${agent.firstName},</p>
    <p>A ${review.rating}-star review from <strong>${review.clientName}</strong> has been approved and is now visible on your profile.</p>
    <p>"${review.comment}"</p>
  `),
});

exports.passwordChangedNotification = (user) => ({
  subject: 'Your LuxEstate password was changed',
  html: wrapTemplate('Password Changed', `
    <p>Hi ${user.firstName},</p>
    <p>This confirms your password was just changed. If you didn't make this change, contact support immediately.</p>
  `),
});

exports.passwordResetEmail = (user, rawToken) => ({
  subject: 'Reset your LuxEstate password',
  html: wrapTemplate('Reset Your Password', `
    <p>Hi ${user.firstName},</p>
    <p>Click below to reset your password. This link expires in 30 minutes.</p>
    ${button(`${process.env.CLIENT_URL}/reset-password/${rawToken}`, 'Reset Password')}
    <p style="color:#999;font-size:12px;margin-top:16px;">If you didn't request this, you can safely ignore this email.</p>
  `),
});
