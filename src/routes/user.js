import { Router } from "express";
import {
  getUserById,
  getUsers,
  getUserWithoutNfcCard,
} from "../controllers/user.js";

const router = Router();

router.get("/", getUsers);
router.get("/withoutNfcCard", getUserWithoutNfcCard);
router.get("/:id", getUserById);

export default router;
