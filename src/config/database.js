import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (process.env.NODE_ENV === "production") {
      await mongoose.connect(process.env.MONGO_URI, {
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASSWORD,
      });
    } else if (process.env.NODE_ENV === "development") {
      await mongoose.connect(process.env.MONGO_URI_LOCAL);
    }

    console.log(
      `MongoDB Connected, Host: ${mongoose.connection.host}, Database Name: ${mongoose.connection.name}, Port: ${mongoose.connection.port}`
    );
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
