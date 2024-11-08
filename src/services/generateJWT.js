import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    SECRET_KEY,
    { expiresIn: "7d" }
  );
};
