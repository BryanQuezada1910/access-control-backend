import { Router } from "express";
import { getUserById, getUsers } from "../controllers/user.js";

const router = Router();

router.get("/:id", getUserById);
router.get("/", getUsers);

export default router;
