import mongoose from 'mongoose';

async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    if (process.env.NODE_ENV !== 'production') {
      process.stdout.write('MongoDB connected\n');
    }
  } catch (error) {
    process.stderr.write(`MongoDB connection failed: ${error.message}\n`);
    process.exit(1);
  }
}

export default connectDB;
