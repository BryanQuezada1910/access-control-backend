import express from "express";
import dotenv from "dotenv";
import cors from "cors";
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
app.use("/api/auth", (req, res, next) => {
  import("./src/routes/authentication.js").then(module => {
    module.default(req, res, next);
  }).catch(next);
});

// NFC Data Receiving Route
app.use("/api/esp32", (req, res, next) => {
  import("./src/routes/esp32.js").then(module => {
    module.default(req, res, next);
  }).catch(next);
});

// Test Route
app.get("/", (req, res) => {
  res.send("The server it's working!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
