import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.js";

const router = Router();

router.get("/:id", getUser);
router.get("/", getUsers);

export default router;
