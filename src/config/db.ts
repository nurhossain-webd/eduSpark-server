import mongoose from "mongoose";

export default async function connectDB(): Promise<void> {
  const mongodbUri = process.env.MONGODB_URI;

  if (!mongodbUri) {
    throw new Error("MONGODB_URI is not defined in .env");
  }

  try {
    await mongoose.connect(mongodbUri);

    console.log("✅ MongoDB Connected");
    console.log(
      `📦 Connected database: ${mongoose.connection.name}`,
    );
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
}