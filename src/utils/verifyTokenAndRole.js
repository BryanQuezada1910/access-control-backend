import jwt from 'jsonwebtoken';

const verifyTokenAndRole = (req, res, requiredRole) => {
  const token = req.cookies["x-token"];

  if (!token) {
    console.log("Token not found");
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedToken.role !== requiredRole) {
      return res.status(403).json({ error: "Forbidden" });
    }

    return { authorized: true, user: decodedToken };
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ error: "Invalid Token" });
  }
};

export default verifyTokenAndRole;
