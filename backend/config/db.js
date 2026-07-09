const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    if (uri.includes('YOUR_PASSWORD_HERE')) {
      throw new Error('Please replace YOUR_PASSWORD_HERE in .env with your actual MongoDB Atlas password');
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📁 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('');
    console.error('🔧 Fix: Open backend/.env and set your correct MONGODB_URI');
    console.error('   Example: MONGODB_URI=mongodb+srv://khizar:YourPassword@cluster0.bvopf8y.mongodb.net/LuxEstate');
    process.exit(1);
  }
};

module.exports = connectDB;
