import { Router } from "express";
import {
  loginSuccess,
  loginFailed,
  googleAuth,
  googleCallback,
  logout,
} from "../controllers/authentication.js";

const router = Router();

router.get("/login/success", loginSuccess);
router.get("/login/failed", loginFailed);
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);
router.get("/logout", logout);

export default router;
