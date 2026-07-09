const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  mlsId: { type: String, unique: true, sparse: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  priceHistory: [{
    price: Number,
    date: { type: Date, default: Date.now },
    event: String
  }],
  status: {
    type: String,
    enum: ['active', 'pending', 'sold', 'off-market', 'coming-soon'],
    default: 'active'
  },
  propertyType: {
    type: String,
    enum: ['single-family', 'condo', 'townhouse', 'multi-family', 'land', 'commercial', 'luxury'],
    required: true
  },
  listingType: { type: String, enum: ['sale', 'rent'], default: 'sale' },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    county: String,
    country: { type: String, default: 'USA' }
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  halfBathrooms: { type: Number, default: 0 },
  squareFootage: { type: Number, required: true },
  lotSize: Number,
  lotUnit: { type: String, enum: ['sqft', 'acres'], default: 'sqft' },
  yearBuilt: Number,
  garage: { type: Number, default: 0 },
  floors: { type: Number, default: 1 },
  basement: { type: Boolean, default: false },
  pool: { type: Boolean, default: false },
  fireplace: { type: Boolean, default: false },
  features: [String],
  appliances: [String],
  heating: String,
  cooling: String,
  parking: String,
  hoaFee: { type: Number, default: 0 },
  hoaFrequency: { type: String, enum: ['monthly', 'quarterly', 'annually', 'none'], default: 'none' },
  taxAmount: { type: Number, default: 0 },
  taxHistory: [{
    year: Number,
    amount: Number,
    assessment: Number
  }],
  photos: [{
    url: String,
    caption: String,
    isPrimary: { type: Boolean, default: false }
  }],
  virtualTourUrl: String,
  threeDTourUrl: String,
  videoUrl: String,
  floorPlanUrl: String,
  schools: [{
    name: String,
    type: { type: String, enum: ['elementary', 'middle', 'high', 'private'] },
    rating: Number,
    distance: Number
  }],
  neighborhood: {
    name: String,
    walkScore: Number,
    transitScore: Number,
    bikeScore: Number,
    description: String
  },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  views: { type: Number, default: 0 },
  favorites: { type: Number, default: 0 },
  showings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
  isFeatured: { type: Boolean, default: false },
  isNew: { type: Boolean, default: true },
  daysOnMarket: { type: Number, default: 0 },
  soldDate: Date,
  soldPrice: Number,
  listingDate: { type: Date, default: Date.now },
  expirationDate: Date,
  openHouses: [{
    date: Date,
    startTime: String,
    endTime: String,
    type: { type: String, enum: ['in-person', 'virtual'] }
  }]
}, { timestamps: true });

propertySchema.index({ 'address.city': 1, price: 1, status: 1 });
propertySchema.index({ propertyType: 1, bedrooms: 1, bathrooms: 1 });
propertySchema.index({ isFeatured: 1, status: 1 });

module.exports = mongoose.model('Property', propertySchema);
