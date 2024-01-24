 import mongoose, { Schema } from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connection() {

  if (cached.conn) {
    console.log("Cached mongodb is called!");
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set("strictQuery", true);
    cached.promise = await mongoose.connect(uri);
    console.log("connected to mongoDB!");
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connection;