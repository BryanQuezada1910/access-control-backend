import Attendance from "../models/Attendance.js";
import verifyTokenAndRole from "../middlewares/verifyTokenAndRole.js";
import verifyToken from "../middlewares/verifyToken.js";

export const getAllAttendances = async (req, res) => {
  const { authorized } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return;

  try {
    const departments = await Attendance.find().populate({
      path: "attendances.userId",
      select: "-password",
    });

    const allAttendances = departments.flatMap((doc) => doc.attendances);

    res.status(200).json(allAttendances);
  } catch (error) {
    console.error("Error fetching all attendances:", error.message);
    res.status(500).json({ message: "Error fetching all attendances" });
  }
};

export const getAttendanceByDepartment = async (req, res) => {
  const { authorized } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return;

  const { departmentId } = req.params;

  try {
    const attendance = await Attendance.findOne({ departmentId }).populate({
      path: "attendances.userId",
      select: "-password",
    });
    res.status(200).json(attendance);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getAttendancesByDateRange = async (req, res) => {
  const { authorized } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return;

  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "Start date and end date are required" });
  }

  try {
    let start = new Date(`${startDate}T00:00:00`);
    let end = new Date(`${endDate}T23:59:59.999`);

    // Ajustar las fechas en UTC compensando la zona horaria
    if (process.env.NODE_ENV === "production") {
      start.setHours(start.getHours() + 6);
      end.setHours(end.getHours() + 6);
    }

    const attendances = await Attendance.find({
      "attendances.checkIn": { $gte: start, $lte: end },
    }).populate({
      path: "attendances.userId",
      select: "-password",
    });

    const filteredAttendances = attendances.flatMap((attendance) =>
      attendance.attendances.filter(
        (att) => att.checkIn >= start && att.checkIn <= end
      )
    );

    if (filteredAttendances.length === 0) {
      return res
        .status(404)
        .json({ message: "No attendances found in the given date range" });
    }

    res.status(200).json(filteredAttendances);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching attendances", error: error.message });
  }
};

export const getAttendanceByDepartmentAndDateRange = async (req, res) => {
  const { authorized } = verifyTokenAndRole(req, res, "admin");
  if (!authorized) return;

  const { departmentId } = req.params;
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "Start date and end date are required" });
  }

  try {
    let start = new Date(`${startDate}T00:00:00`);
    let end = new Date(`${endDate}T23:59:59.999`);

    // Ajustar las fechas en UTC compensando la zona horaria
    if (process.env.NODE_ENV === "production") {
      start.setHours(start.getHours() + 6);
      end.setHours(end.getHours() + 6);
    }

    const attendance = await Attendance.findOne({
      departmentId,
      "attendances.checkIn": { $gte: start, $lte: end },
    }).populate({
      path: "attendances.userId",
      select: "-password",
    });

    if (!attendance) {
      return res.status(404).json({
        message:
          "No attendances found in the given date range for this department",
      });
    }

    res.status(200).json(attendance || { message: "No attendances found" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching attendance", error: error.message });
  }
};

export const getAttendanceByUser = async (req, res) => {
  const { authorized } = verifyToken(req, res);
  if (!authorized) return;

  const { userId } = req.params;

  try {
    const attendances = await Attendance.find({
      "attendances.userId": userId,
    }).populate({
      path: "attendances.userId",
      select: "-password",
    });

    if (!attendances || attendances.length === 0) {
      return res
        .status(404)
        .json({ message: "No attendances found for this user" });
    }

    const userAttendances = attendances.flatMap((doc) =>
      doc.attendances.filter(
        (attendance) => attendance.userId._id.toString() === userId
      )
    );

    if (userAttendances.length === 0) {
      return res
        .status(404)
        .json({ message: "No attendances found for this user" });
    }

    res.status(200).json(userAttendances);
  } catch (error) {
    console.error("Error fetching user attendance:", error.message);
    res.status(500).json({
      message: "Error fetching user attendance",
      error: error.message,
    });
  }
};
