const Appointment = require('../models/Appointment');
const Property = require('../models/Property');
const emailService = require('../services/emailService');

exports.createAppointment = async (req, res) => {
  try {
    const { propertyId, agentId, date, timeSlot, type, notes, clientName, clientEmail, clientPhone } = req.body;
    const appointment = await Appointment.create({
      property: propertyId,
      client: req.user.id,
      agent: agentId,
      date,
      timeSlot,
      type: type || 'in-person',
      notes,
      clientName,
      clientEmail,
      clientPhone
    });
    const populated = await appointment.populate([
      { path: 'property', select: 'title address photos' },
      { path: 'agent', select: 'firstName lastName email phone' },
      { path: 'client', select: 'firstName lastName email phone' }
    ]);
    emailService.sendAppointmentConfirmation(populated);
    res.status(201).json({ success: true, appointment: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyAppointments = async (req, res) => {
  try {
    const filter = req.user.role === 'agent'
      ? { agent: req.user.id }
      : req.user.role === 'admin'
      ? {}
      : { client: req.user.id };

    const appointments = await Appointment.find(filter)
      .populate('property', 'title address photos price')
      .populate('agent', 'firstName lastName email phone avatar')
      .populate('client', 'firstName lastName email phone')
      .sort('-date');
    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    const isOwner = appointment.client.toString() === req.user.id ||
      appointment.agent.toString() === req.user.id ||
      req.user.role === 'admin';
    if (!isOwner) return res.status(403).json({ success: false, message: 'Not authorized' });
    const oldStatus = appointment.status;
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('property', 'title address')
      .populate('agent', 'firstName lastName email')
      .populate('client', 'firstName lastName email');
    if (req.body.status && req.body.status !== oldStatus) {
      emailService.sendAppointmentStatusUpdate(updated);
    }
    res.json({ success: true, appointment: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Not found' });
    await appointment.deleteOne();
    res.json({ success: true, message: 'Cancelled' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const { agentId, date } = req.query;
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    const booked = await Appointment.find({
      agent: agentId,
      date: { $gte: start, $lt: end },
      status: { $ne: 'cancelled' }
    }).select('timeSlot');
    const allSlots = ['9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
      '1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM'];
    const bookedSlots = booked.map(a => a.timeSlot);
    const available = allSlots.filter(s => !bookedSlots.includes(s));
    res.json({ success: true, available });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
