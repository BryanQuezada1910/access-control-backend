import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Expresión regular para validar el formato de email
const emailValidator = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [emailValidator, 'Por favor, ingrese un correo electrónico válido.']
  },
  password: { type: String, required: true },
  nfcCard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NfcCard",
    required: false,
    default: null,
  },
  haveNfcCard: { type: Boolean, required: true, default: false },
  position: { type: String, required: false, default: "sin cargo" },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: false,
    default: null,
  },
  isPresent: { type: Boolean, required: true, default: false },
  role: { type: String, required: true, default: "user" },
  created_at: { type: Date, default: Date.now },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model("User", UserSchema);
