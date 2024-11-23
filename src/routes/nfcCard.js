import { Router } from "express";
import {
  assignNfcCardToUser,
  getUnassignedNfcCards,
} from "../controllers/nfcCard.js";

const router = Router();

router.post("/assign", assignNfcCardToUser);
router.get("/unassigned", getUnassignedNfcCards);

export default router;
