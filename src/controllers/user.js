import User from "../models/User.js";
import verifyTokenAndRole from "../utils/verifyTokenAndRole.js";

export const getUser = async (req, res) => {
  const { authorized } = verifyTokenAndRole(req, res, ["admin", "user"]);
  if (!authorized) return;

  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUsers = async (req, res) => {
  const { authorized } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return;

  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  const { authorized } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return;

  try {
    const { id } = req.params;
    const { name, lastName, role } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await User.findByIdAndUpdate(id, { name, lastName, role });
    return res.status(200).json({ message: "User updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
