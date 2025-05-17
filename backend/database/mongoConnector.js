import mongoose from "mongoose";

const mongoURI = process.env.MONGO_URI;
export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(mongoURI);
    console.log("mongo connected at:", connection.connection.host);
  } catch (error) {
    console.log("failed to connect at errors:", error.message);
    process.exit(1);
  }
};

export default connectDB;
