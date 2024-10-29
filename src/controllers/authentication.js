// src/controllers/authController.js
import passport from "passport";

const loginSuccess = (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully Logged In",
      user: req.user,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
};

const loginFailed = (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
};

const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

const googleCallback = passport.authenticate("google", {
  successRedirect: process.env.FRONTEND_URL,
  failureRedirect: "/auth/login/failed",
});

const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: true, message: "Logout failed" });
    }
    res.redirect(process.env.FRONTEND_URL);
  });
};

export { loginSuccess, loginFailed, googleAuth, googleCallback, logout };
