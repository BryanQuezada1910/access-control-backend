import { registerNfcCard } from "./nfcCard.js";
import { ioInstance } from "../services/wsHandler.js";
import NfcCard from "../models/NfcCard.js";
import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

// This controller is used to receive data from the ESP32
export const esp32RecieveData = async (req, res) => {
  const data = req.body;
  const { uid } = data;

  try {
    if (!uid) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const cardExists = await NfcCard.findOne({ cardId: uid });
    const user = await User.findOne({ nfcCard: uid });

    if (cardExists && cardExists.isAsigned && ioInstance && user) {
      const populatedCard = await cardExists
        .populate({
          path: "assignedTo",
          select: "-password",
        })
        .execPopulate();

      if (!user.isPresent) {
        const newAttendance = new Attendance({
          userId: populatedCard.assignedTo._id,
          checkIn: new Date(),
        });
        user.isPresent = true;
        await user.save();
        await newAttendance.save();

        ioInstance.emit("assistance", { user, type: "checkIn" });
      } else {
        const attendanceRecord = await Attendance.findOne({
          userId: populatedCard.assignedTo._id,
          checkOut: null,
        });

        if (attendanceRecord) {
          attendanceRecord.checkOut = new Date();
          user.isPresent = false;
          await user.save();
          await attendanceRecord.save();

          ioInstance.emit("assistance", { user, type: "checkOut" });
        }
      }
    }

    const result = await registerNfcCard(data);
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.error(error.message || error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};
