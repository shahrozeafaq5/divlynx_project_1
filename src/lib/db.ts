import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || null;


let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null as mongoose.Mongoose | null,
    promise: null as Promise<mongoose.Mongoose> | null,
  };
}

export async function connectDB() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined.");
    return null;
  }
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
