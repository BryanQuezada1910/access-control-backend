import mongoose from "mongoose";

const NfcCardSchema = new mongoose.Schema({
  cardId: { type: String, required: true, unique: true },
  isAsigned: { type: Boolean, default: false },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: false,
    default: null,
  },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("nfccard", NfcCardSchema);
