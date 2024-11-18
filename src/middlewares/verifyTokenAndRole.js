import jwt from 'jsonwebtoken';

const verifyTokenAndRole = (req, res, requiredRole) => {
  const token = req.cookies["x-token"];
  if (!token) {
    console.error("No token provided");
    return {
      authorized: false,
      response: res.status(401).json({ error: "Unauthorized" }),
    };
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (decodedToken.role !== requiredRole) {
      return {
        authorized: false,
        response: res.status(403).json({ error: "Forbidden" }),
      };
    }
    console.log(`Decoded Token: ${decodedToken.role}`);
    return { authorized: true, user: decodedToken };
  } catch (error) {
    console.error("Token verification failed:", error);
    return {
      authorized: false,
      response: res.status(401).json({ error: "Invalid Token" }),
    };
  }
};

export default verifyTokenAndRole;
