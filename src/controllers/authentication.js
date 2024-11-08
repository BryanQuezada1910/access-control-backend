import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateAccessToken } from "../services/generateJWT.js";
import { EmailService } from "../services/sendEmails.js";

export const register = async (req, res) => {
  const requiredFields = ["name", "lastName", "email", "password"];

  if (!req.body || !requiredFields.every((field) => field in req.body)) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { name, lastName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new User({ name, lastName, email, password });
    await newUser.save();

    const token = generateAccessToken(newUser);
    
    const emailService = new EmailService();
    await emailService.sendWelcomeEmail(email, name, lastName);

    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};

export const login = async (req, res) => {
  const requiredFields = ["email", "password"];

  if (!req.body || !requiredFields.every((field) => field in req.body)) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateAccessToken(user);

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json({ message: "User logged in successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};

export const logout = (req, res) => {
  res.status(200).clearCookie("token").json({ message: "User logged out successfully" });
};
