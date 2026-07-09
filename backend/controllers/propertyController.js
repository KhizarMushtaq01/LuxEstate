const Property = require('../models/Property');

exports.getProperties = async (req, res) => {
  try {
    const {
      page = 1, limit = 12, city, zip, mlsId, minPrice, maxPrice,
      beds, baths, type, listingType, minSqft, maxSqft, status = 'active',
      sort = '-createdAt', featured, search, lotSize
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (zip) query['address.zip'] = zip;
    if (mlsId) query.mlsId = mlsId;
    if (type) query.propertyType = type;
    if (listingType) query.listingType = listingType;
    if (featured === 'true') query.isFeatured = true;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (beds) query.bedrooms = { $gte: Number(beds) };
    if (baths) query.bathrooms = { $gte: Number(baths) };
    if (minSqft || maxSqft) {
      query.squareFootage = {};
      if (minSqft) query.squareFootage.$gte = Number(minSqft);
      if (maxSqft) query.squareFootage.$lte = Number(maxSqft);
    }
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { 'address.city': new RegExp(search, 'i') },
        { 'address.street': new RegExp(search, 'i') },
        { 'address.zip': new RegExp(search, 'i') },
        { mlsId: new RegExp(search, 'i') }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('agent', 'firstName lastName email phone avatar rating')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: properties.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      properties
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('agent', 'firstName lastName email phone avatar bio rating reviewCount yearsExperience totalSales licenseNumber');
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    property.views += 1;
    await property.save();
    res.json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createProperty = async (req, res) => {
  try {
    req.body.agent = req.user.id;
    if (!req.body.mlsId) req.body.mlsId = `LUX${Date.now()}`;
    const property = await Property.create(req.body);
    res.status(201).json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await property.deleteOne();
    res.json({ success: true, message: 'Property removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFeaturedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ isFeatured: true, status: 'active' })
      .populate('agent', 'firstName lastName avatar rating')
      .limit(6);
    res.json({ success: true, properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getRecentlySold = async (req, res) => {
  try {
    const properties = await Property.find({ status: 'sold' })
      .populate('agent', 'firstName lastName avatar')
      .sort('-soldDate')
      .limit(8);
    res.json({ success: true, properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAgentProperties = async (req, res) => {
  try {
    const properties = await Property.find({ agent: req.params.agentId });
    res.json({ success: true, properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalActive = await Property.countDocuments({ status: 'active' });
    const totalSold = await Property.countDocuments({ status: 'sold' });
    const totalPending = await Property.countDocuments({ status: 'pending' });
    const avgPrice = await Property.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, avg: { $avg: '$price' } } }
    ]);
    res.json({ success: true, stats: { totalActive, totalSold, totalPending, avgPrice: avgPrice[0]?.avg || 0 } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
