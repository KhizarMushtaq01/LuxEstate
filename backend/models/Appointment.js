const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  type: { type: String, enum: ['in-person', 'virtual'], default: 'in-person' },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'], default: 'pending' },
  notes: String,
  clientName: String,
  clientEmail: String,
  clientPhone: String,
  meetingLink: String,
  cancelReason: String,
  reminderSent: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
