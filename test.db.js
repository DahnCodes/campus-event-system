import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://campusadmin:BcyLca5JdX57kwHo@cluster0.woeysgb.mongodb.net/?appName=Cluster0";

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log("✅ MongoDB connected successfully");

    await mongoose.disconnect();

    console.log("🔌 Disconnected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
}

testConnection();