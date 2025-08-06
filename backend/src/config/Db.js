import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const db = process.env.MONGO_URI;
console.log("db =", db);

const connectDb = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error(error.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDb;
