import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectDB(): Promise<typeof mongoose> {
  const mongodbUri = process.env.MONGODB_URI;

  if (!mongodbUri) {
    throw new Error("MONGODB_URI is not defined.");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongodbUri, {
      serverSelectionTimeoutMS: 10000,
    });
  }

  try {
    const connection = await connectionPromise;

    console.log(
      `✅ MongoDB connected: ${connection.connection.name}`,
    );

    return connection;
  } catch (error) {
    connectionPromise = null;

    console.error("❌ MongoDB connection failed:", error);

    throw error;
  }
}