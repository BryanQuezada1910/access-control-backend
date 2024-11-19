import { Router } from "express";
import { createAdmin, addUserToDepartment, removeUserFromDepartment } from "../controllers/admin.js";

const router = Router();

router.post("/register", createAdmin);
router.post("/addUserToDepartment", addUserToDepartment);
router.post("/removeUserFromDepartment", removeUserFromDepartment);

export default router;
