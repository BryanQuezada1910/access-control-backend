import NfcCard from "../models/NfcCard.js";
import User from "../models/User.js";

// This controller is used to register a new NFC card in esp32Data.js
export const registerNfcCard = async (data) => {
  const { uid } = data;

  if (!uid) {
    throw new Error("Missing required fields");
  }

  const cardExists = await NfcCard.findOne({ cardId: uid });
  if (cardExists) {
    throw new Error("Card already exists");
  }

  const nfcCard = new NfcCard({ cardId: uid });
  await nfcCard.save();
  return { message: "NFC Card created", card: nfcCard };
};

// This controller is not used in the project
export const getNfcCards = async (req, res) => {
  try {
    const cards = await NfcCard.find();
    res.status(200).json(cards);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getUnassignedNfcCards = async (req, res) => {
  try {
    const unassignedCards = await NfcCard.find({ isAsigned: false });
    res.status(200).json(unassignedCards);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const assignNfcCardToUser = async (req, res) => {
  const { userId, cardId } = req.body;
  try {
    if (!userId || !cardId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (userId === "" || cardId === "") {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const card = await NfcCard.findOne({ _id: cardId });
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    if (user.nfcCard) {
      return res.status(400).json({ message: "User already has a card" });
    }

    if (card.isAsigned) {
      return res.status(400).json({ message: "Card already assigned" });
    }

    user.nfcCard = card._id;
    user.haveNfcCard = true;
    card.isAsigned = true;
    card.assignedTo = userId;
    await user.save();
    await card.save();
    res.status(200).json({ message: "Card assigned" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
