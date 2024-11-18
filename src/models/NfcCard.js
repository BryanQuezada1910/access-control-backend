import mongoose from "mongoose";

const NfcCardSchema = new mongoose.Schema({
  cardId: { type: String, required: true, unique: true },
  isAsigned: { type: Boolean, default: false },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("NfcCard", NfcCardSchema);
