import Department from "../models/Department.js";
import verifyTokenAndRole from "../middlewares/verifyTokenAndRole.js";

export const createDepartment = async (req, res) => {
  const { authorized } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return;

  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newDepartment = new Department({ name, description });
    await newDepartment.save();
    return res.status(201).json(newDepartment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDepartments = async (req, res) => {
  const { authorized } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return;

  try {
    const departments = await Department.find();
    if (departments.length === 0) {
      return res.status(404).json({ error: "No departments found" });
    }
    return res.status(200).json(departments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDepartmentById = async (req, res) => {
  const { authorized } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return;

  try {
    const { id } = req.params;
    const department = await Department.findById(id).populate({
      path: "employees",
      select: "-password",
    });
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
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }
    await Department.findByIdAndUpdate(id, { name, description });
    return res.status(200).json({ message: "Department updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteDepartment = async (req, res) => {
  const { authorized } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return;

  try {
    const { id } = req.params;
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }
    await Department.findByIdAndDelete(id);
    return res.status(200).json({ message: "Department deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
