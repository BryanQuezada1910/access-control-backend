import { Router } from "express";
import { assignNfcCardToUser } from "../controllers/nfcCard.js";

const router = Router();

router.post("/assign", assignNfcCardToUser);

export default router;
