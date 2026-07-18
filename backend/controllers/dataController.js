const { Lead, Review, Blog, Neighborhood } = require('../models/Other');
const User = require('../models/User');

// LEADS
exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const query = req.user.role === 'agent' ? { agent: req.user.id } : {};
    const leads = await Lead.find(query).populate('property', 'title address').sort('-createdAt');
    res.json({ success: true, leads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// REVIEWS
exports.createReview = async (req, res) => {
  try {
    const existing = await Review.findOne({ client: req.user.id, agent: req.body.agent, property: req.body.property });
    if (existing) return res.status(400).json({ success: false, message: 'You have already reviewed this agent for this property' });
    const review = await Review.create({ ...req.body, client: req.user.id, clientName: `${req.user.firstName} ${req.user.lastName}` });
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const query = { isApproved: true };
    if (req.query.agentId) query.agent = req.query.agentId;
    const reviews = await Review.find(query).populate('client', 'firstName lastName avatar').sort('-createdAt');
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('client', 'firstName lastName avatar')
      .populate('agent', 'firstName lastName avatar')
      .sort('-createdAt');
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// BLOGS
exports.getBlogs = async (req, res) => {
  try {
    const { category, page = 1, limit = 9 } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;
    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate('author', 'firstName lastName avatar')
      .sort('-publishedAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, blogs, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true }).populate('author', 'firstName lastName avatar bio');
    if (!blog) return res.status(404).json({ success: false, message: 'Not found' });
    blog.views += 1;
    await blog.save();
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createBlog = async (req, res) => {
  try {
    req.body.author = req.user.id;
    if (req.body.isPublished) req.body.publishedAt = new Date();
    const blog = await Blog.create(req.body);
    res.status(201).json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// NEIGHBORHOODS
exports.getNeighborhoods = async (req, res) => {
  try {
    const neighborhoods = await Neighborhood.find().sort('name');
    res.json({ success: true, neighborhoods });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getNeighborhood = async (req, res) => {
  try {
    const neighborhood = await Neighborhood.findOne({ slug: req.params.slug });
    if (!neighborhood) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, neighborhood });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createNeighborhood = async (req, res) => {
  try {
    const neighborhood = await Neighborhood.create(req.body);
    res.status(201).json({ success: true, neighborhood });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// AGENTS
exports.getAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent', isActive: true }).select('-password');
    res.json({ success: true, agents });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAgent = async (req, res) => {
  try {
    const agent = await User.findOne({ _id: req.params.id, role: 'agent' }).select('-password');
    if (!agent) return res.status(404).json({ success: false, message: 'Agent not found' });
    res.json({ success: true, agent });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ADMIN
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const Property = require('../models/Property');
    const Appointment = require('../models/Appointment');
    const [totalUsers, totalProperties, totalLeads, totalAppointments, recentLeads, recentAppointments] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Lead.countDocuments(),
      Appointment.countDocuments(),
      Lead.find().sort('-createdAt').limit(5),
      Appointment.find().populate('property', 'title').populate('client', 'firstName lastName').sort('-createdAt').limit(5)
    ]);
    res.json({ success: true, stats: { totalUsers, totalProperties, totalLeads, totalAppointments }, recentLeads, recentAppointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
