import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  uuidCard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NfcCard",
    required: false,
  },
  position: { type: String, required: false, default: "none" },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  isPresent: { type: Boolean, required: true, default: false },
  role: { type: String, required: true, default: "user" },
  created_at: { type: Date, default: Date.now },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model("User", UserSchema);
