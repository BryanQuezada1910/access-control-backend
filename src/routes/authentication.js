import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  logout,
} from "../controllers/authentication.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgot-password", forgotPassword);

export default router;
