import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Attendance", AttendanceSchema);
