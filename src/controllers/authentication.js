import bcrypt from "bcrypt";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import {
  generateAccessToken,
  generateForgotPasswordToken,
} from "../services/generateJWT.js";
import { EmailService } from "../services/sendEmails.js";

export const register = async (req, res) => {
  const requiredFields = ["name", "lastName", "email", "password"];

  if (!req.body || !requiredFields.every((field) => field in req.body)) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { name, lastName, email, password } = req.body;

  if (name === "" || lastName === "" || email === "" || password === "") {
    return res.status(400).json({ error: "Empty fields are not allowed" });
  }

  try {
    const userExists = await User.findOne({ email });
    const adminExists = await Admin.findOne({ email });

    if (userExists || adminExists) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const newUser = new User({
      name,
      lastName,
      email,
      password,
      NfcCard: null,
    });
    await newUser.save();

    const token = generateAccessToken(newUser);

    if (process.env.NODE_ENV === "production") {
      const emailService = new EmailService();
      await emailService.sendWelcomeEmail(email, name, lastName);
    }

    res
      .status(201)
      .json({ message: "User registered successfully", token: token });
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

  if (email === "" || password === "") {
    return res.status(400).json({ error: "Empty fields are not allowed" });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await Admin.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.role === "admin") {
      const adminToken = generateAccessToken(user);
      return res
        .status(200)
        .json({ message: "Admin logged in successfully", token: adminToken });
    }

    const token = generateAccessToken(user);

    res
      .status(200)
      .json({ message: "User logged in successfully", token: token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = generateForgotPasswordToken(user);

    if (process.env.NODE_ENV === "production") {
      const emailService = new EmailService();
      await emailService.sendResetPasswordEmail(
        email,
        token,
        process.env.FRONTEND_URL
      );
    }

    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};

export const logout = (req, res) => {
  res
    .status(200)
    .clearCookie("token")
    .json({ message: "User logged out successfully" });
};
