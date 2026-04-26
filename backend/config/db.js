const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    mongoose.set("bufferTimeoutMS", 5000);
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`  MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.warn(`  WARNING: MongoDB not available (${err.message})`);
    console.warn(`  Server will start but DB features won't work.`);
    console.warn(`  Install MongoDB or set MONGODB_URI to an Atlas cluster.`);
  }
};

module.exports = connectDB;
