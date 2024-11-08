import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import esp32 from "./src/routes/esp32.js";
import authentication from "./src/routes/authentication.js";
import connectDB from "./src/config/database.js";

dotenv.config();

const app = express();

connectDB();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:9000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
// Auth Route
app.use("/auth", authentication);
// NFC Data Receiving Route
app.use("/esp32", esp32);

// Test Route
app.get("/", (req, res) => {
  res.send("The server it's working!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
