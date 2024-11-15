import Deparment from "../models/Deparment.js";
import verifyTokenAndRole from "../utils/verifyTokenAndRole.js";

export const createDepartment = async (req, res) => {
  const { authorized, user } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return;

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
  const { authorized, user } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return;

  try {
    const departments = await Deparment.find();
    return res.status(200).json(departments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDepartment = async (req, res) => {
  const { authorized } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return;

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
  const { authorized } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return;

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
  const { authorized, user } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return;

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
