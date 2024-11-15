import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateAccessToken, generateForgotPasswordToken } from "../services/generateJWT.js";
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

    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new User({ name, lastName, email, password });
    await newUser.save();

    const token = generateAccessToken(newUser);

    if (process.env.NODE_ENV === "production") {
      const emailService = new EmailService();
      await emailService.sendWelcomeEmail(email, name, lastName);
    }

    res
      .status(201)
      .cookie("x-token", token, {
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

  if (email === "" || password === "") {
    return res.status(400).json({ error: "Empty fields are not allowed" });
  }

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
      .cookie("x-token", token, {
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
    .clearCookie("x-token")
    .json({ message: "User logged out successfully" });
};
