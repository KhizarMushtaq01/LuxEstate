const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: String,
  comment: { type: String, required: true },
  clientName: String,
  clientAvatar: String,
  transactionType: { type: String, enum: ['bought', 'sold', 'rented'] },
  isVerified: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  helpfulVotes: { type: Number, default: 0 },
}, { timestamps: true });

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  message: String,
  type: { type: String, enum: ['contact', 'valuation', 'newsletter', 'showing', 'mortgage', 'general'], default: 'general' },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  address: String,
  status: { type: String, enum: ['new', 'contacted', 'qualified', 'converted', 'lost'], default: 'new' },
  source: String,
  notes: String,
  estimatedBudget: Number,
  timeline: String,
  preferredContact: { type: String, enum: ['email', 'phone', 'text'], default: 'email' },
}, { timestamps: true });

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  content: { type: String, required: true },
  excerpt: String,
  coverImage: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { type: String, enum: ['market-update', 'buyer-tips', 'seller-tips', 'neighborhood', 'investment', 'news'] },
  tags: [String],
  isPublished: { type: Boolean, default: false },
  publishedAt: Date,
  views: { type: Number, default: 0 },
  readTime: Number,
  metaTitle: String,
  metaDescription: String,
}, { timestamps: true });

const neighborhoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  city: String,
  state: String,
  description: String,
  longDescription: String,
  coverImage: String,
  images: [String],
  highlights: [String],
  schools: [{
    name: String,
    type: String,
    rating: Number
  }],
  amenities: [String],
  restaurants: [String],
  parks: [String],
  medianHomePrice: Number,
  avgRentPrice: Number,
  walkScore: Number,
  transitScore: Number,
  bikeScore: Number,
  commuteTime: String,
  stats: {
    population: Number,
    medianAge: Number,
    medianIncome: Number,
    homeOwnershipRate: Number
  },
  activeListings: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = {
  Review: mongoose.model('Review', reviewSchema),
  Lead: mongoose.model('Lead', leadSchema),
  Blog: mongoose.model('Blog', blogSchema),
  Neighborhood: mongoose.model('Neighborhood', neighborhoodSchema),
};
