const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "letmein";

// POST /api/auth/login
// simple admin gate for the "reset season" button, nothing fancy needed for an internal tool
router.post("/login", (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin" }, req.app.locals.jwtSecret, { expiresIn: "7d" });
    return res.json({ token });
  }

  res.status(401).json({ error: "Invalid password" });
});

module.exports = router;
