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

    if (!cardExists) {
      const result = await registerNfcCard(data);
      if (!result.card) {
        return res.status(500).json({ message: "Server Error" });
      }
      return res
        .status(201)
        .json({ message: "Card registered successfully", card: result.card });
    }

    if (!cardExists.isAsigned) {
      ioInstance.emit("unassignedCard", { card: cardExists });
      return res.status(400).json({ message: "The card is not assigned" });
    }

    const user = await User.findOne({ nfcCard: cardExists._id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (cardExists && cardExists.isAsigned && ioInstance && user) {
      const populatedCard = await cardExists.populate({
        path: "assignedTo",
        select: "-password",
      });

      if (!user.isPresent) {
        const newAttendance = new Attendance({
          userId: populatedCard.assignedTo._id,
          checkIn: new Date(),
        });
        user.isPresent = true;
        await user.save();
        await newAttendance.save();

        ioInstance.emit("assistance", { user, card: cardExists, type: "checkIn" });
      } else {
        const attendanceRecord = await Attendance.findOne({
          userId: user._id,
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

    res.status(200).json({ message: "Data processed successfully" });
  } catch (error) {
    console.error("Error en esp32: " + error.message || error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};
