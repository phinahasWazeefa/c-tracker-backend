import mongoose from 'mongoose';

const uri = "mongodb+srv://ctracker:ctracker@my-cluster.udgav8g.mongodb.net/C-Tracker?retryWrites=true&w=majority&appName=My-Cluster";

const MONGO_URI = uri || 'mongodb://localhost:27017/mydatabase';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1); // Exit process if the connection fails
    }
};

export default connectDB;
