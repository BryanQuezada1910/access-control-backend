import mongoose from "mongoose";

const Department = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  employees: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Department", Department);
