import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();  // Load environment variables

// Ensure MONGODB_URI is provided
if (!process.env.MONGODB_URI) {
  throw new Error("❌ Please provide MONGODB_URI in the .env file");
}

async function connectDB() {
  try {
    // Connect to MongoDB using the URI from the .env file
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB connection successful!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);  // Exit the process with a failure code
  }
}

export default connectDB;
