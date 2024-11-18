import NfcCard from "../models/NfcCard.js";
// import User from '../models/User.js';

export const registerNfcCard = async (req, res) => {
  const { uuid } = req.body;
  try {
    const nfcCard = new NfcCard({ cardId: uuid });
    await nfcCard.save();
    res.status(201).json({ message: "NFC Card created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const assignNfcCard = async (req, res) => {};
