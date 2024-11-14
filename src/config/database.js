import mongoose from "mongoose";

const connectDB = async () => {
  try {
    let conn;

    if (process.env.NODE_ENV === "production") {
      conn = await mongoose.connect(process.env.MONGO_URI, {
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASSWORD,
      });
    } else if (process.env.NODE_ENV === "development") {
      conn = await mongoose.connect(process.env.MONGO_URI_LOCAL);
    }

    if (conn) {
      console.log(
        `MongoDB Connected, Host: ${conn.connection.host}, Database Name: ${conn.connection.name}, Port: ${conn.connection.port}`
      );
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
