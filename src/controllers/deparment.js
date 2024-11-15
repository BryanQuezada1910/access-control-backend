import Deparment from "../models/Deparment.js";
import jwt from "jsonwebtoken";
// import User from "../models/User.js";

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

export const createDepartment = async (req, res) => {
  const { authorized, response } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return response;

  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newDepartment = new Deparment({ name, description });
    await newDepartment.save();
    return res.status(201).json({ message: "Department created" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDepartments = async (req, res) => {
  const { authorized, response } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return response;

  try {
    const departments = await Deparment.find();
    return res.status(200).json(departments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDepartment = async (req, res) => {
  const { authorized, response } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return response;

  try {
    const { id } = req.params;
    const department = await Deparment.findById(id).populate("employees");
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }
    return res.status(200).json(department);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateDepartment = async (req, res) => {
  const { authorized, response } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return response;

  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const department = await Deparment.findById(id);
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }
    await Deparment.findByIdAndUpdate(id, { name, description });
    return res.status(200).json({ message: "Department updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteDepartment = async (req, res) => {
  const { authorized, response } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return response;

  try {
    const { id } = req.params;
    const department = await Deparment.findById(id);
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }
    await Deparment.findByIdAndDelete(id);
    return res.status(200).json({ message: "Department deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
