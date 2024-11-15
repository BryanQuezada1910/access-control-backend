import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

const verifyTokenAndRole = (req, res, requiredRole) => {
  const token = req.headers["x-token"];
  if (!token) {
    return {
      authorized: false,
      response: res.status(401).json({ error: "Unauthorized" }),
    };
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (decodedToken.role !== requiredRole) {
      return {
        authorized: false,
        response: res.status(403).json({ error: "Forbidden" }),
      };
    }
    return { authorized: true, user: decodedToken };
  } catch (error) {
    console.error("Token verification failed:", error);
    return {
      authorized: false,
      response: res.status(401).json({ error: "Invalid Token" }),
    };
  }
};

export const createAdmin = async (req, res) => {
  const { authorized, response } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return response;

  try {
    const { name, lastName, email, password } = req.body;
    if (!name || !lastName || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newAdmin = new Admin({ name, lastName, email, password });
    await newAdmin.save();
    return res.status(201).json({ message: "Admin created" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};