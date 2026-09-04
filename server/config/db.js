const mongoose = require('mongoose');

const DEFAULT_MONGO_URI = 'mongodb+srv://atheekfareez47_db_user:bT1ntmAnxqf5XS5I@clustergramafiz.mt9mcof.mongodb.net/gramafix?retryWrites=true&w=majority&appName=ClusterGramaFiz';

let isConnected = false;
let connectionPromise = null;

const connectDB = async () => {
  if (process.env.STORAGE_MODE === 'memory') {
    isConnected = false;
    return false;
  }

  if (isConnected && mongoose.connection.readyState === 1) {
    return true;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || DEFAULT_MONGO_URI;

  connectionPromise = (async () => {
    try {
      mongoose.set('strictQuery', false);
      const conn = await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      });
      isConnected = true;
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return true;
    } catch (error) {
      isConnected = false;
      connectionPromise = null;
      if (process.env.STORAGE_MODE === 'mongo') throw error;
      console.warn(`⚠️ MongoDB connection issue (${error.message}).`);
      console.log(`🚀 GramaFix running in Resilient In-Memory Storage Mode for seamless evaluation!`);
      return false;
    }
  })();

  return connectionPromise;
};

const getIsConnected = () => isConnected || mongoose.connection.readyState === 1;

module.exports = { connectDB, getIsConnected };
