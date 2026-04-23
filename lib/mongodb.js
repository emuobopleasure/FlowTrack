import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in .env.local')
}

// Cache the connection on the global object to survive hot reloads in development.
// Without this, every file save in development creates a new connection
// and exhausts the MongoDB Atlas connection limit very quickly.
let cached = global.mongoose ?? { conn: null, promise: null }
global.mongoose = cached

const connectDB = async () => {
  if (cached.conn) return cached.conn

  cached.promise ??= mongoose.connect(MONGODB_URI)
  cached.conn = await cached.promise

  return cached.conn
}

export default connectDB