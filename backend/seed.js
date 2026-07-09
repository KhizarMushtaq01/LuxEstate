require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Property = require('./models/Property');
const { Review, Blog, Neighborhood } = require('./models/Other');

async function seed() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri || uri.includes('YOUR_PASSWORD_HERE')) {
      console.error('❌ Please set a valid MONGODB_URI in backend/.env first');
      process.exit(1);
    }

    console.log('🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to:', mongoose.connection.name);
    console.log('');
    console.log('🌱 Seeding database...');

    // Clear
    await Promise.all([
      User.deleteMany({}),
      Property.deleteMany({}),
      Review.deleteMany({}),
      Blog.deleteMany({}),
      Neighborhood.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // ── USERS ──────────────────────────────────────────────────────────
    const admin = await User.create({
      firstName: 'Admin', lastName: 'User',
      email: 'admin@luxestate.com', password: 'admin123',
      role: 'admin', isActive: true, isVerified: true,
      phone: '(520) 544-4400',
    });

    const agent1 = await User.create({
      firstName: 'Sarah', lastName: 'Mitchell',
      email: 'agent@luxestate.com', password: 'agent123',
      role: 'agent', isActive: true, isVerified: true,
      phone: '(520) 544-4401',
      bio: 'With 15 years of experience in Tucson luxury real estate, Sarah specializes in Catalina Foothills and Oro Valley properties. Her commitment to excellence and deep market knowledge consistently delivers outstanding results.',
      specialties: ['Luxury Homes', 'First-Time Buyers', 'Investment Properties'],
      languages: ['English', 'Spanish'],
      licenseNumber: 'SA500123000',
      yearsExperience: 15, totalSales: 342, rating: 4.9, reviewCount: 87,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    });

    const agent2 = await User.create({
      firstName: 'Michael', lastName: 'Torres',
      email: 'agent2@luxestate.com', password: 'agent123',
      role: 'agent', isActive: true, isVerified: true,
      phone: '(520) 544-4402',
      bio: 'Michael is a Tucson native specializing in Marana and Sahuarita. Expert in new construction and investment properties.',
      specialties: ['New Construction', 'Investment Properties', 'Relocation'],
      languages: ['English', 'Spanish', 'Portuguese'],
      licenseNumber: 'SA500124000',
      yearsExperience: 8, totalSales: 198, rating: 4.8, reviewCount: 54,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    });

    const agent3 = await User.create({
      firstName: 'Jennifer', lastName: 'Park',
      email: 'agent3@luxestate.com', password: 'agent123',
      role: 'agent', isActive: true, isVerified: true,
      phone: '(520) 544-4403',
      bio: 'Jennifer specializes in midtown and historic Tucson properties. Her eye for design and deep knowledge of the urban core makes her the go-to agent for downtown buyers.',
      specialties: ['Historic Homes', 'Urban Properties', 'Condo Sales'],
      languages: ['English', 'Korean'],
      licenseNumber: 'SA500125000',
      yearsExperience: 12, totalSales: 267, rating: 4.9, reviewCount: 103,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    });

    const client = await User.create({
      firstName: 'John', lastName: 'Smith',
      email: 'client@luxestate.com', password: 'client123',
      role: 'client', isActive: true, isVerified: true,
      phone: '(520) 555-0100',
    });

    console.log('👤 Created 4 users (1 admin, 3 agents, 1 client)');

    // ── PROPERTIES ──────────────────────────────────────────────────────
    const properties = await Property.create([
      {
        mlsId: 'LUX2024001',
        title: 'Stunning Catalina Foothills Estate',
        description: 'Breathtaking mountain views from this exquisite 5-bedroom estate nestled in the heart of the Catalina Foothills. Features soaring ceilings, gourmet kitchen with Wolf appliances, resort-style pool with waterfall, and a 3-car garage. The primary suite offers panoramic views, a spa bath with dual vanities, and a generous walk-in closet. Fully owned solar panels, smart home technology, and lush desert landscaping complete this exceptional offering.',
        price: 1250000, status: 'active', propertyType: 'luxury', listingType: 'sale',
        address: { street: '4521 E Skyline Drive', city: 'Tucson', state: 'AZ', zip: '85718', county: 'Pima' },
        coordinates: { lat: 32.3200, lng: -110.8764 },
        bedrooms: 5, bathrooms: 4, halfBathrooms: 1, squareFootage: 4850,
        lotSize: 0.85, lotUnit: 'acres', yearBuilt: 2018, garage: 3, pool: true, fireplace: true,
        features: ['Mountain Views', 'Smart Home', 'Solar Panels', 'Wolf Appliances', 'Wine Cellar', 'Home Theater', 'Guest Casita', 'RV Gate'],
        heating: 'Central Gas', cooling: 'Dual Zone Central Air',
        hoaFee: 450, hoaFrequency: 'monthly', taxAmount: 14200,
        photos: [
          { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80', isPrimary: true, caption: 'Front Exterior' },
          { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', caption: 'Living Room' },
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', caption: 'Kitchen' },
          { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80', caption: 'Pool Area' },
        ],
        schools: [
          { name: 'Catalina Foothills High School', type: 'high', rating: 9, distance: 1.2 },
          { name: 'Canyon View Elementary', type: 'elementary', rating: 9, distance: 0.8 },
        ],
        neighborhood: { name: 'Catalina Foothills', walkScore: 28, bikeScore: 35, description: 'Prestigious hilltop community with world-class desert vistas.' },
        taxHistory: [{ year: 2023, amount: 14200, assessment: 980000 }, { year: 2022, amount: 13800, assessment: 950000 }],
        agent: agent1._id, isFeatured: true, views: 287, daysOnMarket: 12,
      },
      {
        mlsId: 'LUX2024002',
        title: 'Modern Oro Valley Family Home',
        description: 'Impeccably maintained 4-bedroom home in the sought-after Stone Canyon community of Oro Valley. Open-concept living with 10-foot ceilings, chef\'s kitchen with quartz counters, and a private backyard oasis. Walking distance to top-rated elementary school and community parks. Move-in ready with fresh paint and new carpet throughout.',
        price: 589000, status: 'active', propertyType: 'single-family', listingType: 'sale',
        address: { street: '1847 W Painted Hills Drive', city: 'Oro Valley', state: 'AZ', zip: '85737', county: 'Pima' },
        coordinates: { lat: 32.4226, lng: -110.9787 },
        bedrooms: 4, bathrooms: 3, squareFootage: 2680, lotSize: 7840, lotUnit: 'sqft',
        yearBuilt: 2015, garage: 2, pool: true,
        features: ['Quartz Counters', 'Stainless Appliances', 'Covered Patio', 'Upgraded Flooring', 'Tankless Water Heater', 'Epoxy Garage'],
        heating: 'Central Gas', cooling: 'Central Air',
        hoaFee: 125, hoaFrequency: 'monthly', taxAmount: 5800,
        photos: [
          { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
        ],
        schools: [
          { name: 'Painted Sky Elementary', type: 'elementary', rating: 9, distance: 0.3 },
          { name: 'Copper Canyon High School', type: 'high', rating: 8, distance: 1.8 },
        ],
        taxHistory: [{ year: 2023, amount: 5800, assessment: 420000 }],
        agent: agent1._id, isFeatured: true, views: 156, daysOnMarket: 5,
      },
      {
        mlsId: 'LUX2024003',
        title: 'Downtown Tucson Luxury Condo',
        description: 'Sleek and sophisticated 2-bedroom condo in the heart of downtown Tucson. Floor-to-ceiling windows with city views, designer finishes throughout, and a private rooftop terrace. Two secured parking spaces, concierge service, and steps from the city\'s best restaurants and entertainment venues.',
        price: 425000, status: 'active', propertyType: 'condo', listingType: 'sale',
        address: { street: '240 S Stone Ave Unit 1501', city: 'Tucson', state: 'AZ', zip: '85701', county: 'Pima' },
        coordinates: { lat: 32.2217, lng: -110.9747 },
        bedrooms: 2, bathrooms: 2, squareFootage: 1480, yearBuilt: 2020, garage: 2,
        features: ['City Views', 'Rooftop Terrace', 'Concierge', 'Secured Parking', 'Floor-to-Ceiling Windows', 'Gym Access'],
        hoaFee: 650, hoaFrequency: 'monthly', taxAmount: 4200,
        photos: [
          { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
        ],
        agent: agent3._id, isFeatured: true, views: 203, daysOnMarket: 18,
      },
      {
        mlsId: 'LUX2024004',
        title: 'Marana New Construction — Single Story',
        description: 'Brand new construction in Marana\'s premier Gladden Farms community. This stunning single-story home features an open floorplan, 3-car garage, and a beautifully appointed kitchen. Builder warranty included. Exceptional schools and easy freeway access make this the ideal family home.',
        price: 465000, status: 'active', propertyType: 'single-family', listingType: 'sale',
        address: { street: '12380 N Cornerstone Drive', city: 'Marana', state: 'AZ', zip: '85653', county: 'Pima' },
        coordinates: { lat: 32.4369, lng: -111.1668 },
        bedrooms: 4, bathrooms: 3, squareFootage: 2290, lotSize: 8200, lotUnit: 'sqft',
        yearBuilt: 2024, garage: 3,
        features: ['New Construction', 'Builder Warranty', 'Smart Home Pre-wired', 'Energy Star Certified', 'Granite Counters', '10-ft Ceilings'],
        heating: 'Central Gas', cooling: 'Central Air',
        hoaFee: 95, hoaFrequency: 'monthly', taxAmount: 4100,
        photos: [
          { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80' },
        ],
        agent: agent2._id, isFeatured: false, views: 89, daysOnMarket: 2,
      },
      {
        mlsId: 'LUX2024005',
        title: 'Sahuarita Ranch Home with Pool',
        description: 'Spacious and charming ranch-style home in Green Valley Farms. Perfect for families with an oversized lot, RV gate, extended patio, and sparkling pool. Split floor plan with large primary suite. Priced to sell in one of Tucson\'s most affordable and family-friendly communities.',
        price: 345000, status: 'active', propertyType: 'single-family', listingType: 'sale',
        address: { street: '680 W Calle Concordia', city: 'Sahuarita', state: 'AZ', zip: '85629', county: 'Pima' },
        coordinates: { lat: 31.9462, lng: -110.9553 },
        bedrooms: 3, bathrooms: 2, squareFootage: 1850, lotSize: 10200, lotUnit: 'sqft',
        yearBuilt: 2008, garage: 2, pool: true,
        features: ['RV Gate', 'Extended Covered Patio', 'Split Floor Plan', 'Tile Throughout', 'New AC 2022'],
        heating: 'Central Gas', cooling: 'Central Air', taxAmount: 3100,
        photos: [
          { url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' },
        ],
        agent: agent1._id, isFeatured: false, views: 112, daysOnMarket: 21,
      },
      {
        mlsId: 'LUX2024006',
        title: 'Luxury Rental — Foothills Townhome',
        description: 'Stunning 3-bedroom luxury townhome available for rent in the Catalina Foothills. Fully furnished, resort-style community pool, mountain views from private patio. Water and trash included. Walking distance to La Encantada shopping. Ideal for corporate relocation or extended stay.',
        price: 3200, status: 'active', propertyType: 'townhouse', listingType: 'rent',
        address: { street: '5765 N Kolb Road Unit 208', city: 'Tucson', state: 'AZ', zip: '85750', county: 'Pima' },
        coordinates: { lat: 32.2950, lng: -110.8340 },
        bedrooms: 3, bathrooms: 2, squareFootage: 1680, yearBuilt: 2016, garage: 1,
        features: ['Furnished Available', 'Mountain Views', 'Pool Access', 'Water Included', 'In-Unit Laundry', 'Fitness Center'],
        hoaFee: 0, taxAmount: 0,
        photos: [
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', isPrimary: true },
        ],
        agent: agent2._id, isFeatured: true, views: 67, daysOnMarket: 4,
      },
      {
        mlsId: 'LUX2024007',
        title: 'Midtown Remodeled Bungalow',
        description: 'Completely remodeled 3BR/2BA bungalow in walkable Midtown Tucson. New roof, HVAC, plumbing, and electrical in 2022. Open kitchen with shaker cabinets and quartz counters, refinished hardwood floors, and fully landscaped backyard.',
        price: 329000, status: 'sold', propertyType: 'single-family', listingType: 'sale',
        address: { street: '1342 N 4th Ave', city: 'Tucson', state: 'AZ', zip: '85705', county: 'Pima' },
        coordinates: { lat: 32.2347, lng: -110.9723 },
        bedrooms: 3, bathrooms: 2, squareFootage: 1380, lotSize: 5500, lotUnit: 'sqft',
        yearBuilt: 1952, garage: 1,
        features: ['Hardwood Floors', 'Remodeled Kitchen', 'New Roof 2022', 'New HVAC 2022', 'Drip Irrigation'],
        taxAmount: 2800,
        photos: [
          { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', isPrimary: true },
        ],
        taxHistory: [{ year: 2023, amount: 2800, assessment: 235000 }],
        agent: agent3._id, isFeatured: false, views: 198,
        soldDate: new Date('2024-11-15'), soldPrice: 342000, daysOnMarket: 6,
      },
      {
        mlsId: 'LUX2024008',
        title: 'Vail School District — Move-In Ready',
        description: 'Beautiful 4-bedroom home in the award-winning Vail School District. This like-new home sits on a premium corner lot with mountain views. The gourmet kitchen opens to the great room, perfect for entertaining. Low-maintenance desert landscaping and oversized 2.5-car garage.',
        price: 485000, status: 'active', propertyType: 'single-family', listingType: 'sale',
        address: { street: '9940 S Prairie Sunset Trail', city: 'Vail', state: 'AZ', zip: '85641', county: 'Pima' },
        coordinates: { lat: 32.0214, lng: -110.7016 },
        bedrooms: 4, bathrooms: 3, squareFootage: 2420, lotSize: 9100, lotUnit: 'sqft',
        yearBuilt: 2019, garage: 2,
        features: ['Corner Lot', 'Mountain Views', 'Gourmet Kitchen', 'Great Room', 'Desert Landscaping', 'Vail Schools'],
        heating: 'Central Gas', cooling: 'Central Air',
        hoaFee: 78, hoaFrequency: 'monthly', taxAmount: 4600,
        photos: [
          { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' },
        ],
        schools: [
          { name: 'Acacia Elementary', type: 'elementary', rating: 10, distance: 0.5 },
          { name: 'Cienega High School', type: 'high', rating: 9, distance: 2.1 },
        ],
        agent: agent2._id, isFeatured: false, views: 134, daysOnMarket: 9,
      },
    ]);
    console.log(`🏠 Created ${properties.length} properties`);

    // ── REVIEWS ──────────────────────────────────────────────────────────
    await Review.create([
      {
        client: client._id, agent: agent1._id,
        rating: 5, clientName: 'Jennifer & Mark Davis',
        title: 'Exceptional experience from start to finish!',
        comment: 'Sarah was phenomenal. She found us our dream home in just two weeks, negotiated $40,000 below asking, and handled every detail seamlessly. We cannot recommend LuxEstate highly enough.',
        transactionType: 'bought', isVerified: true, isApproved: true, helpfulVotes: 24,
      },
      {
        client: client._id, agent: agent2._id,
        rating: 5, clientName: 'Robert Chen',
        title: 'Best real estate team in Tucson',
        comment: 'I have worked with many realtors across multiple states. LuxEstate\'s market knowledge and negotiation skills are unmatched. They helped me acquire three investment properties at exceptional value in under four months.',
        transactionType: 'bought', isVerified: true, isApproved: true, helpfulVotes: 18,
      },
      {
        client: client._id, agent: agent1._id,
        rating: 5, clientName: 'Sarah & Tom Williams',
        title: 'Sold above asking in just 3 days!',
        comment: 'We listed on Friday, had 12 showings over the weekend, and accepted an offer 8% above asking by Monday morning. The staging advice, professional photography, and pricing strategy were absolutely spot-on.',
        transactionType: 'sold', isVerified: true, isApproved: true, helpfulVotes: 31,
      },
      {
        client: client._id, agent: agent3._id,
        rating: 5, clientName: 'Dr. Amy Liu',
        title: 'Found our perfect downtown condo!',
        comment: 'Jennifer\'s knowledge of the urban Tucson market is unparalleled. She showed us exactly what we wanted and guided us through the condo purchase process with incredible clarity and patience.',
        transactionType: 'bought', isVerified: true, isApproved: true, helpfulVotes: 15,
      },
    ]);
    console.log('⭐ Created 4 reviews');

    // ── BLOG POSTS ────────────────────────────────────────────────────────
    await Blog.create([
      {
        title: 'Tucson Real Estate Market Report: Q1 2024',
        slug: 'tucson-market-report-q1-2024',
        excerpt: 'Tucson\'s real estate market continues to show resilience with median home prices up 4.2% year-over-year. Here\'s what buyers and sellers need to know heading into spring.',
        content: `Tucson's real estate market kicked off 2024 with continued strength, despite elevated interest rates creating some headwinds for affordability.

Key Market Statistics:
• Median home price: $329,000 (up 4.2% year-over-year)
• Average days on market: 28 days (up from 19 days in Q1 2023)
• Active listings: 1,847 (up 12% from Q1 2023)
• Closed sales: 1,203 (down 8% year-over-year due to rate sensitivity)
• List-to-sale price ratio: 98.4%

What This Means for Buyers:
While higher rates have cooled competition somewhat, buyers are finding slightly more inventory and negotiating leverage than during the frenzied 2021-2022 market. Pre-approval is still critical, and well-priced homes in desirable neighborhoods are still receiving multiple offers within the first week.

What This Means for Sellers:
Strategic pricing is more important than ever. Overpriced homes are sitting longer and often requiring price reductions. Homes priced at or slightly below market value are still moving quickly. Professional photography, staging, and targeted digital marketing continue to produce strong results.

Neighborhood Breakdown:
- Oro Valley: Median $485,000, 22 days on market
- Marana: Median $412,000, 18 days on market
- Foothills: Median $620,000, 35 days on market
- Sahuarita: Median $365,000, 25 days on market

Outlook for Spring 2024:
With anticipated Federal Reserve rate reductions later in 2024, we expect increased buyer activity in Q2 and Q3. If you've been waiting for the "right time" to enter the market, the current environment — with more inventory and less competition — may be your best window before rates drop and demand surges again.`,
        category: 'market-update', author: admin._id,
        isPublished: true, publishedAt: new Date('2024-01-15'),
        coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
        tags: ['market report', 'Tucson', '2024', 'real estate trends'],
        views: 842, readTime: 5,
      },
      {
        title: '5 Things First-Time Buyers Must Know Before Buying in Tucson',
        slug: 'first-time-buyers-guide-tucson',
        excerpt: 'Buying your first home is exciting but complex. After helping hundreds of first-time buyers navigate Tucson, here are our top five tips that will save you time, money, and stress.',
        content: `Purchasing your first home is one of the biggest financial decisions of your life. After helping hundreds of first-time buyers successfully navigate the Tucson market, here are our top five tips.

1. Get Pre-Approved Before You Start Looking
In today's market, sellers won't take you seriously without a pre-approval letter. More importantly, pre-approval helps you understand exactly what you can afford — including the actual monthly payment with principal, interest, taxes, insurance, and HOA fees.

Getting pre-approved also reveals any credit issues early enough to address them before you find your dream home.

2. Understand the True Cost of Homeownership
Your mortgage payment is just the beginning. Budget for:
• Property taxes: typically 1–1.5% of home value annually in Pima County
• Homeowner's insurance: $1,200–$2,000/year for most homes
• HOA fees: $75–$650/month depending on community
• Maintenance reserve: budget 1% of home value per year
• Utilities: budget $200–$400/month for a typical Tucson home

3. Don't Skip the Home Inspection
We've seen buyers waive inspections to be more competitive. This is almost always a mistake. A $400–500 inspection by a licensed home inspector could save you from a $40,000 surprise. In Arizona's desert climate, pay special attention to: roof condition and remaining life, HVAC age and efficiency (critical in Tucson summers), plumbing and water heater age, and any evidence of pest or termite activity.

4. The Neighborhood Matters as Much as the House
You can renovate a house, but you can't change its location. Research school ratings even if you don't have children (they affect resale value), commute times at rush hour, proximity to amenities you use, planned development or construction nearby, and crime statistics.

5. Work with a Buyer's Agent — It's Free to You
Many first-time buyers don't realize that the seller typically pays both agent commissions. Working with a dedicated buyer's agent gives you expert representation, access to off-market listings, professional negotiation, and full transaction management — all at zero cost to you.`,
        category: 'buyer-tips', author: agent1._id,
        isPublished: true, publishedAt: new Date('2024-02-01'),
        coverImage: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
        tags: ['first-time buyers', 'buying tips', 'Tucson', 'home inspection'],
        views: 1243, readTime: 6,
      },
      {
        title: 'How to Price Your Tucson Home to Sell Fast and for Top Dollar',
        slug: 'how-to-price-your-home-tucson',
        excerpt: 'Pricing strategy is the single most important factor in how quickly your home sells and at what price. Here\'s our proven approach to positioning your home for maximum results.',
        content: `After selling over 10,000 homes in the Tucson area, we've learned that pricing strategy is the most critical decision a seller makes. Price it right, and you create urgency and competition. Price it too high, and your home sits, accumulates stigma, and ultimately sells for less.

The Dangers of Overpricing:
• Buyers' agents preview the market constantly and immediately notice overpriced homes
• Homes that sit on the market for 30+ days are viewed with suspicion
• You may end up with multiple price reductions, often selling for less than if you'd priced correctly from the start
• Your listing loses its "new listing" momentum, which is when you get the most showings

How We Price Your Home:
Our Comparative Market Analysis (CMA) examines: recent sales of truly comparable homes (same neighborhood, similar size, age, and condition), current active listings (your competition), expired listings (homes that didn't sell and why), and market trends (days on market, list-to-sale ratios, inventory levels).

The Sweet Spot Strategy:
We typically recommend pricing at or slightly below the top of fair market value. This creates urgency among buyers, often resulting in multiple offers and a final sales price at or above asking — not despite pricing conservatively, but because of it.

What's Your Home Really Worth?
Request a free Comparative Market Analysis from one of our agents. We'll analyze your specific home, neighborhood, and the current market to give you an honest assessment of your home's value and the optimal pricing strategy.`,
        category: 'seller-tips', author: agent1._id,
        isPublished: true, publishedAt: new Date('2024-02-20'),
        coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
        tags: ['selling tips', 'pricing strategy', 'CMA', 'home value'],
        views: 967, readTime: 5,
      },
    ]);
    console.log('📝 Created 3 blog posts');

    // ── NEIGHBORHOODS ─────────────────────────────────────────────────────
    await Neighborhood.create([
      {
        name: 'Oro Valley', slug: 'oro-valley',
        city: 'Oro Valley', state: 'AZ',
        description: 'One of Arizona\'s safest and most desirable communities, Oro Valley offers top-rated schools, master-planned neighborhoods, and stunning Catalina Mountain views.',
        longDescription: 'Oro Valley consistently ranks among Arizona\'s safest cities and most desirable communities to raise a family. The town offers a perfect blend of suburban convenience, natural beauty, and exceptional schools. The Catalina Mountains provide a dramatic backdrop, and residents enjoy easy access to hiking, golf, and world-class resort amenities.',
        highlights: ['Top-rated Amphitheater & CFSD School Districts', 'Catalina Mountains backdrop', 'CDO River Park trail system', 'Consistently rated safest city in AZ', 'Abundant shopping and dining at Oro Valley Marketplace'],
        amenities: ['Naranja Park Community Center', 'Multiple Golf Courses', 'Catalina State Park', 'Whole Foods', 'Target', 'La Encantada'],
        medianHomePrice: 485000, avgRentPrice: 2200,
        walkScore: 32, transitScore: 18, bikeScore: 42,
        commuteTime: '25 min to downtown Tucson',
        stats: { population: 47000, medianAge: 44, medianIncome: 92000, homeOwnershipRate: 78 },
        activeListings: 142,
        coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      },
      {
        name: 'Marana', slug: 'marana',
        city: 'Marana', state: 'AZ',
        description: 'Arizona\'s fastest-growing city offers new construction communities, excellent amenities, and easy access to I-10 and Tucson\'s employment centers.',
        highlights: ['Fastest-growing city in Southern AZ', 'New construction deals throughout', 'Award-winning Marana Unified School District', 'Easy I-10 freeway access', 'Family-friendly master-planned communities'],
        medianHomePrice: 412000, avgRentPrice: 1900,
        walkScore: 28, transitScore: 12, bikeScore: 38,
        commuteTime: '30 min to downtown Tucson',
        stats: { population: 52000, medianAge: 36, medianIncome: 78000, homeOwnershipRate: 72 },
        activeListings: 89,
        coverImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      },
      {
        name: 'Catalina Foothills', slug: 'foothills',
        city: 'Tucson', state: 'AZ',
        description: 'The prestigious Catalina Foothills offer luxury living with panoramic mountain and city views, top-rated private and public schools, and proximity to world-class hiking.',
        highlights: ['Luxury estate homes and custom properties', 'Catalina Foothills School District (A+)', 'Sabino Canyon access', 'Panoramic city and mountain views', 'La Encantada and Foothills Mall shopping'],
        medianHomePrice: 620000, avgRentPrice: 2800,
        walkScore: 35, transitScore: 22, bikeScore: 30,
        commuteTime: '20 min to downtown Tucson',
        stats: { population: 38000, medianAge: 52, medianIncome: 125000, homeOwnershipRate: 85 },
        activeListings: 54,
        coverImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
      },
      {
        name: 'Sahuarita', slug: 'sahuarita',
        city: 'Sahuarita', state: 'AZ',
        description: 'Affordable family living south of Tucson with excellent schools, master-planned communities with lakes and parks, and a safe, tight-knit suburban atmosphere.',
        highlights: ['Most affordable family community near Tucson', 'Award-winning Sahuarita Unified School District', 'Sahuarita Lake Park — fishing and recreation', 'Close-knit community feel', 'Consistently low crime rates'],
        medianHomePrice: 365000, avgRentPrice: 1700,
        walkScore: 25, transitScore: 10, bikeScore: 35,
        commuteTime: '35 min to downtown Tucson',
        stats: { population: 35000, medianAge: 33, medianIncome: 68000, homeOwnershipRate: 75 },
        activeListings: 67,
        coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      },
      {
        name: 'Midtown Tucson', slug: 'midtown',
        city: 'Tucson', state: 'AZ',
        description: 'Walkable, vibrant, and eclectic — Midtown Tucson is home to the 4th Avenue arts district, University of Arizona, diverse restaurants, and charming historic neighborhoods.',
        highlights: ['Walkable 4th Avenue entertainment district', 'Close to University of Arizona', 'Historic and mid-century homes', 'Diverse restaurant and arts scene', 'Most walkable area in Tucson'],
        medianHomePrice: 295000, avgRentPrice: 1400,
        walkScore: 72, transitScore: 48, bikeScore: 68,
        commuteTime: '10 min to downtown Tucson',
        stats: { population: 42000, medianAge: 29, medianIncome: 45000, homeOwnershipRate: 42 },
        activeListings: 38,
        coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      },
      {
        name: 'Vail', slug: 'vail',
        city: 'Vail', state: 'AZ',
        description: 'Home to Arizona\'s top-rated school district, Vail offers newer construction, beautiful desert scenery, and a peaceful community atmosphere southeast of Tucson.',
        highlights: ['Vail Unified — Arizona\'s #1 school district', 'Affordable newer construction', 'Beautiful desert mountain scenery', 'Low HOA fees compared to other areas', 'Growing dining and retail options'],
        medianHomePrice: 385000, avgRentPrice: 1750,
        walkScore: 22, transitScore: 8, bikeScore: 28,
        commuteTime: '35 min to downtown Tucson',
        stats: { population: 28000, medianAge: 35, medianIncome: 72000, homeOwnershipRate: 80 },
        activeListings: 71,
        coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
      },
    ]);
    console.log('🏘️  Created 6 neighborhoods');

    console.log('');
    console.log('🎉 Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Demo Login Credentials:');
    console.log('   Admin:   admin@luxestate.com  / admin123');
    console.log('   Agent:   agent@luxestate.com  / agent123');
    console.log('   Agent2:  agent2@luxestate.com / agent123');
    console.log('   Agent3:  agent3@luxestate.com / agent123');
    console.log('   Client:  client@luxestate.com / client123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
