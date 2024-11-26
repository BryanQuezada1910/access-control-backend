import { registerNfcCard } from "./nfcCard.js";
import { ioInstance } from "../services/wsHandler.js";
import NfcCard from "../models/NfcCard.js";
import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

export const esp32RecieveData = async (req, res) => {
  const data = req.body;
  const { uid } = data;

  try {
    if (!uid) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const card = await NfcCard.findOne({ cardId: uid });

    if (!card) {
      // Registrar nueva tarjeta NFC
      const result = await registerNfcCard(data);
      if (!result.card) {
        return res.status(500).json({ message: "Error registering card" });
      }
      return res
        .status(201)
        .json({ message: "Card registered successfully", card: result.card });
    }

    if (!card.isAsigned) {
      // Tarjeta no asignada
      ioInstance.emit("unassignedCard", { card });
      return res.status(400).json({ message: "The card is not assigned" });
    }

    const user = await User.findOne({ nfcCard: card._id }).populate(
      "department"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const attendance = await handleAttendance(user, card);

    res.status(200).json({
      message: "Data processed successfully",
      attendance,
    });
  } catch (error) {
    console.error("Error in esp32RecieveData:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const handleAttendance = async (user, card) => {
  const departmentId = user.department._id;
  const userId = user._id;

  // Busca el documento de asistencia para el departamento
  let attendanceRecord = await Attendance.findOne({ departmentId });

  if (!attendanceRecord) {
    // Si no existe, crea uno nuevo
    attendanceRecord = new Attendance({ departmentId, attendances: [] });
  }

  if (!user.isPresent) {
    // Registro de entrada (checkIn)
    attendanceRecord.attendances.push({
      userId,
      checkIn: new Date(),
    });
    user.isPresent = true;
    await attendanceRecord.save();
    await user.save();

    ioInstance.emit("assistance", {
      user,
      card,
      type: "checkIn",
    });

    return attendanceRecord;
  } else {
    // Registro de salida (checkOut)
    const lastAttendance = attendanceRecord.attendances
      .filter((entry) => entry.userId.toString() === userId.toString())
      .sort((a, b) => b.checkIn - a.checkIn)[0]; // Último registro de entrada

    if (lastAttendance && !lastAttendance.checkOut) {
      lastAttendance.checkOut = new Date();
      user.isPresent = false;
      await attendanceRecord.save();
      await user.save();

      ioInstance.emit("assistance", {
        user,
        card,
        type: "checkOut",
      });

      return attendanceRecord;
    } else {
      throw new Error("No valid check-in found for this user.");
    }
  }
};
