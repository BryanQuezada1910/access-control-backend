import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieSession from "cookie-session";
import passportConfig from "./src/config/passport.js";
import authenticationRoutes from "./src/routes/authentication.js";
import connectDB from "./src/config/database.js";

dotenv.config();

const app = express();

connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:9000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(
  cookieSession({
    name: "session",
    keys: ["keys1"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(express.json());

app.use(passportConfig.initialize());
app.use(passportConfig.session());

// Auth Routes
app.use("/auth", authenticationRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("The server it's working!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on http://localhost:3000");
});
