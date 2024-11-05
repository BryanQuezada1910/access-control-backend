import { Router } from "express";
import { esp32RecieveData } from "../controllers/esp32Conection.js";

const router = Router();

router.post("/nfcData", esp32RecieveData);

export default router;