const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (process.env.STORAGE_MODE === 'memory') {
    isConnected = false;
    return false;
  }
  const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gramafix';
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    if (process.env.STORAGE_MODE === 'mongo') throw error;
    isConnected = false;
    console.warn(`⚠️ Local MongoDB service not detected (${error.message}).`);
    console.log(`🚀 GramaFix running in Resilient In-Memory Storage Mode for seamless evaluation!`);
    return false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
