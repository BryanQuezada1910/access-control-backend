import User from "../models/User.js";
import verifyTokenAndRole from "../middlewares/verifyTokenAndRole.js";
import verifyToken from "../middlewares/verifyToken.js";

export const getUserById = async (req, res) => {
  const { authorized, decodedToken } = verifyToken(req, res);
  if (!authorized) return;

  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await User.findById(id).select("-password").populate({
      path: "department",
      select: "name",
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (decodedToken.role === "admin") {
      return res.status(200).json(user);
    }

    if (user._id != decodedToken.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserWithoutNfcCard = async (req, res) => {
  const { authorized } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return;

  try {
    const users = await User.find({ haveNfcCard: false })
      .select("-password")
      .populate({
        path: "department",
        select: "name",
      });
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUsers = async (req, res) => {
  const { authorized } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return;

  try {
    const users = await User.find().select("-password").populate({
      path: "department",
      select: "name",
    });
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
