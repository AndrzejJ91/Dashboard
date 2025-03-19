import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/IBM';


const connectDB = async () => {
    // If there is an active connection, disconnect
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  
    try {
      await mongoose.connect(process.env.MONGO_URI as string, {
        connectTimeoutMS: 1000,          // Connection timeout set to 1 second
        serverSelectionTimeoutMS: 1000,  // Server selection timeout set to 1 second
      });
      console.log("✅ Connected to MongoDB!");


    } catch (error) {
        console.error({ success: false, message: "Error connecting to the database", error });

        // In tests, throw an error, but in a normal environment, shut down the application
        if (process.env.NODE_ENV === "test") {
            throw new Error("Error connecting to MongoDB");
        } else {
            process.exit(1);
        }
    }
};

export default connectDB;





