import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Будь ласка, визначте змінну MONGODB_URI у .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}


const cache: MongooseCache = {
  conn: null,
  promise: null,
};

async function connectDB() {
  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    const opts = {
      bufferCommands: false,
    };

    cache.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (e) {
    cache.promise = null;
    throw e;
  }

  return cache.conn;
}

export default connectDB;