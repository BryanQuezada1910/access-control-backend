import { Router } from "express";
import {
  assignNfcCardToUser,
  getUnassignedNfcCards,
  getNfcCards,
} from "../controllers/nfcCard.js";

const router = Router();

router.post("/assign", assignNfcCardToUser);
router.get("/unassigned", getUnassignedNfcCards);
router.get("/all", getNfcCards);

export default router;
