const jwt = require('jsonwebtoken');
const User = require('../models/User');
const emailService = require('../services/emailService');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const userData = user.toObject();
  delete userData.password;
  res.status(statusCode).json({ success: true, token, user: userData });
};

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });
    const allowedRole = ['client', 'agent'].includes(role) ? role : 'client';
    const user = await User.create({ firstName, lastName, email, password, phone, role: allowedRole });
    emailService.sendWelcomeEmail(user);
    sendToken(user, 201, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Provide email and password' });
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    if (!user.isActive) return res.status(401).json({ success: false, message: 'Account deactivated' });
    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedProperties');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const fields = ['firstName','lastName','phone','bio','specialties','languages','address','social','avatar'];
    const updates = {};
    fields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    if (req.body.yearsExperience) updates.yearsExperience = req.body.yearsExperience;
    if (req.body.licenseNumber) updates.licenseNumber = req.body.licenseNumber;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password incorrect' });
    }
    user.password = newPassword;
    await user.save();
    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleSaveProperty = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const propId = req.params.propertyId;
    const idx = user.savedProperties.indexOf(propId);
    if (idx > -1) user.savedProperties.splice(idx, 1);
    else user.savedProperties.push(propId);
    await user.save();
    res.json({ success: true, savedProperties: user.savedProperties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
