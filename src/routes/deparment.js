import { Router } from "express";
import { createDepartment, getDepartments, getDepartment, updateDepartment, deleteDepartment } from "../controllers/deparment.js";

const router = Router();

router.post("/", createDepartment);
router.get("/", getDepartments);
router.get("/:id", getDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

export default router;