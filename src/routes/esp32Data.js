import { Router } from "express";
import { esp32RecieveData } from "../controllers/esp32Data.js";

const router = Router();

router.post("/nfcData", esp32RecieveData);

export default router;
