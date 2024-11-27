import { Router } from "express";
import {
  getAllAttendances,
  getAttendanceByDepartment,
  getAttendancesByDateRange,
  getAttendanceByDepartmentAndDateRange,
  getAttendanceByUser,
} from "../controllers/attendance.js";

const router = Router();

router.get("/all", getAllAttendances);
router.get("/department/:departmentId", getAttendanceByDepartment);
router.get("/date-range", getAttendancesByDateRange);
router.get(
  "/department/:departmentId/date-range",
  getAttendanceByDepartmentAndDateRange
);
router.get("/user/:userId", getAttendanceByUser);

export default router;
