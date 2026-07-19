const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const property = require('../controllers/propertyController');
const appt = require('../controllers/appointmentController');
const data = require('../controllers/dataController');
const { protect, authorize } = require('../middleware/auth');

// AUTH
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.get('/auth/me', protect, auth.getMe);
router.put('/auth/profile', protect, auth.updateProfile);
router.put('/auth/password', protect, auth.updatePassword);
router.put('/auth/save/:propertyId', protect, auth.toggleSaveProperty);
router.post('/auth/forgot-password', auth.forgotPassword);
router.post('/auth/reset-password/:token', auth.resetPassword);

// PROPERTIES
router.get('/properties', property.getProperties);
router.get('/properties/featured', property.getFeaturedProperties);
router.get('/properties/sold', property.getRecentlySold);
router.get('/properties/stats', property.getStats);
router.get('/properties/agent/:agentId', property.getAgentProperties);
router.get('/properties/:id', property.getProperty);
router.post('/properties', protect, authorize('agent','admin'), property.createProperty);
router.put('/properties/:id', protect, authorize('agent','admin'), property.updateProperty);
router.delete('/properties/:id', protect, authorize('agent','admin'), property.deleteProperty);

// APPOINTMENTS
router.post('/appointments', protect, appt.createAppointment);
router.get('/appointments', protect, appt.getMyAppointments);
router.put('/appointments/:id', protect, appt.updateAppointment);
router.delete('/appointments/:id', protect, appt.deleteAppointment);
router.get('/appointments/slots', appt.getAvailableSlots);

// LEADS
router.post('/leads', data.createLead);
router.get('/leads', protect, authorize('agent','admin'), data.getLeads);
router.put('/leads/:id', protect, authorize('agent','admin'), data.updateLead);

// REVIEWS
router.post('/reviews', protect, data.createReview);
router.get('/reviews', data.getReviews);
router.put('/reviews/:id/approve', protect, authorize('admin'), data.approveReview);

// BLOGS
router.get('/blogs', data.getBlogs);
router.get('/blogs/:slug', data.getBlog);
router.post('/blogs', protect, authorize('agent','admin'), data.createBlog);

// NEIGHBORHOODS
router.get('/neighborhoods', data.getNeighborhoods);
router.get('/neighborhoods/:slug', data.getNeighborhood);
router.post('/neighborhoods', protect, authorize('admin'), data.createNeighborhood);

// AGENTS
router.get('/agents', data.getAgents);
router.get('/agents/:id', data.getAgent);

// ADMIN
router.get('/admin/users', protect, authorize('admin'), data.getAllUsers);
router.put('/admin/users/:id', protect, authorize('admin'), data.updateUser);
router.delete('/admin/users/:id', protect, authorize('admin'), data.deleteUser);
router.get('/admin/dashboard', protect, authorize('admin'), data.getDashboardStats);
router.get('/admin/reviews', protect, authorize('admin'), data.getAllReviewsAdmin);

module.exports = router;
