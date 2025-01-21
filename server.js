import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { socketHandler } from "./src/services/wsHandler.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/database.js";

dotenv.config();

const corsOptions = {
  origin: ["*"], // process.env.FRONTEND_URL, "http://localhost:9000"
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: corsOptions,
});

connectDB();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

// Auth Route
app.use("/api/auth", async (req, res, next) => {
  try {
    const module = await import("./src/routes/authentication.js");
    module.default(req, res, next);
  } catch (error) {
    next(error);
  }
});

// NFC Data Receiving Route
app.use("/api/esp32", async (req, res, next) => {
  try {
    const module = await import("./src/routes/esp32Data.js");
    module.default(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Department Route
app.use("/api/department", async (req, res, next) => {
  try {
    const module = await import("./src/routes/department.js");
    module.default(req, res, next);
  } catch (error) {
    next(error);
  }
});

// NFC Card Route
app.use("/api/nfcCard", async (req, res, next) => {
  try {
    const module = await import("./src/routes/nfcCard.js");
    module.default(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Attendance Route
app.use("/api/attendance", async (req, res, next) => {
  try {
    const module = await import("./src/routes/attendance.js");
    module.default(req, res, next);
  } catch (error) {
    next(error);
  }
});

// User Route
app.use("/api/user", async (req, res, next) => {
  try {
    const module = await import("./src/routes/user.js");
    module.default(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Admin Route
app.use("/api/admin", async (req, res, next) => {
  try {
    const module = await import("./src/routes/admin.js");
    module.default(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Endpoint para recibir datos de la app expo ITNegocios
app.post('/api/receive-data', (req, res) => {
  console.log('Datos recibidos:');
  console.log(req.body); // Muestra los datos enviados por la app

  // Enviar respuesta al cliente
  res.status(200).json({ message: 'Datos recibidos correctamente' });
});

// Test Route
app.get("/", (req, res) => {
  res.send("The server it's working!");
});

// Websocket Service
socketHandler(io);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}\nNODE_ENV=${process.env.NODE_ENV}\n`
  );
});
