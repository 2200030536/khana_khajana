import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://rohitkumarg698:0908@cluster0.qmw92.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    // await mongoose.connect(process.env.ATLAS_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
