import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()


// mongodb ki api url ko .env file se le rahe hai

// database se connect karne ke liye function
async function connectDB() {
  if (!process.env.MONGODB_URL) {
    console.error("Please provide MONGODB_URL in the .env file / Vercel Environment Variables");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("Mongodb connected successfully")
  } catch (error) {
    console.log("Failed to connect to database:", error)
    // Removed process.exit(1) for Vercel compatibility
  }
}
export default connectDB