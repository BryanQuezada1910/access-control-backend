import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

console.log("SECRET_KEY: ", SECRET_KEY);

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
