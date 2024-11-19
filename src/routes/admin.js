import { Router } from "express";
import { createAdmin, addUserToDepartment } from "../controllers/admin.js";

const router = Router();

router.post("/register", createAdmin);
router.post("/addUserToDepartment", addUserToDepartment);

export default router;
