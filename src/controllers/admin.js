import Admin from "../models/Admin.js";
import User from "../models/User.js";
import verifyTokenAndRole from "../utils/verifyTokenAndRole.js";

export const createAdmin = async (req, res) => {
  const { authorized, response } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return response;

  try {
    const { name, lastName, email, password } = req.body;

    if (!name || !lastName || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const userExists = await Admin.findOne({ email });
    const adminExists = await User.findOne({ email });

    if (userExists || adminExists) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const newAdmin = new Admin({ name, lastName, email, password });
    await newAdmin.save();
    return res.status(201).json({ message: "Admin created" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
