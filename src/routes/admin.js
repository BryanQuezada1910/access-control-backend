import { Router } from "express";
import { createAdmin } from "../controllers/admin.js";

const router = Router();

router.post("/", createAdmin);

export default router;
