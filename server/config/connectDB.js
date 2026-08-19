import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let isConnected = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnected) {
    return isConnected;
  }

  if (!process.env.MONGODB_URL) {
    console.error("Please provide MONGODB_URL in the .env file / Vercel Environment Variables");
    throw new Error("MONGODB_URL is missing in environment variables");
  }

  try {
    isConnected = await mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Mongodb connected successfully");
    return isConnected;
  } catch (error) {
    isConnected = null;
    console.error("Failed to connect to database:", error.message || error);
    throw error;
  }
}

export default connectDB;