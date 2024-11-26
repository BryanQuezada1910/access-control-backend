import { Router } from "express";
import { getAllAttendances } from "../controllers/attendance.js";

const router = Router();

router.get("/all", getAllAttendances);

export default router;
