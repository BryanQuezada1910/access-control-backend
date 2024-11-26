import Attendance from "../models/Attendance.js";
import verifyTokenAndRole from "../middlewares/verifyTokenAndRole.js";

export const getAllAttendances = async (req, res) => {
  const { authorized } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return;

  try {
    const attendances = await Attendance.find();
    res.status(200).json(attendances);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
