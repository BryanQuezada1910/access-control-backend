import Admin from "../models/Admin.js";
import User from "../models/User.js";
import verifyTokenAndRole from "../middlewares/verifyTokenAndRole.js";

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

export const getAdminById = async (req, res) => {
  const { authorized, response } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return;

  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    if (response.role === "admin") {
      return res.status(200).json(admin);
    }

    if (admin._id != response._id || response.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    return res.status(200).json(admin);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
