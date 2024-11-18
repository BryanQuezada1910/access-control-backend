import { registerNfcCard } from "./nfcCard.js";

const esp32RecieveData = (req, res) => {
  const data = req.body;
  console.log(data);
  res.status(200).json({ message: "Data received" });
};

export { esp32RecieveData };
