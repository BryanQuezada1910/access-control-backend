import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyToken = (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.error("No token provided");
    return {
      authorized: false,
      response: res.status(401).json({ error: "Unauthorized" }),
    };
  }

  try {
    const token = authHeader.split(" ")[1];

    if (!token) {
      console.error("No token provided");
      return {
        authorized: false,
        response: res.status(401).json({ error: "Unauthorized" }),
      };
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    return { authorized: true, decodedToken: decodedToken };
  } catch (error) {
    console.error("Token verification failed:", error);
    return {
      authorized: false,
      response: res.status(401).json({ error: "Invalid Token" }),
    };
  }
};

export default verifyToken;
