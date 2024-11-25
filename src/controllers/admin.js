import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Department from "../models/Department.js";
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
};

export const addUserToDepartment = async (req, res) => {
  const { authorized, response } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return response;

  if (
    !req.body ||
    !("departmentId" in req.body) ||
    !("userEmail" in req.body) ||
    !("position" in req.body)
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { departmentId, position, userEmail } = req.body;

    if (departmentId === "" || userEmail === "" || position === "") {
      return res.status(400).json({ error: "Empty fields are not allowed" });
    }

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: "Users not found" });
    }

    if (department.employees.includes(user._id) || user.department) {
      return res.status(400).json({ error: "User already in department" });
    }

    department.employees.push(user._id);
    await department.save();

    user.department = department._id;
    user.position = position;
    await user.save();

    return res.status(200).json({ message: "Users added to department" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const removeUserFromDepartment = async (req, res) => {
  const { authorized, response } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return response;

  if (
    !req.body ||
    !("departmentId" in req.body) ||
    !("userEmail" in req.body)
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { departmentId, userEmail } = req.body;

    if (
      !departmentId ||
      !userEmail ||
      departmentId === "" ||
      userEmail === ""
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    const user = await User.findById(userEmail);

    if (!user) {
      return res.status(404).json({ error: "Users not found" });
    }

    if (!department.employees.includes(userEmail)) {
      return res.status(404).json({ error: "User not found in department" });
    }

    department.employees = department.employees.filter(
      (employee) => employee.toString() !== userEmail
    );
    await department.save();

    user.department = null;
    user.position = "sin cargo";
    await user.save();

    return res.status(200).json({ message: "Users removed from department" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
