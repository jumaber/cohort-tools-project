const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model"); // Mongoose model for the User
const { isAuthenticated } = require("./../middleware/jwt.middleware.js"); // Middleware to protect routes
const router = express.Router();
const saltRounds = 10; // Number of salt rounds for bcrypt hashing

// ======================================
// POST /auth/signup - Register new user
// ======================================
router.post("/signup", (req, res, next) => {
  const { email, password, name } = req.body;

  // Check for empty fields
  if (email === "" || password === "" || name === "") {
    return res
      .status(400)
      .json({ message: "Provide email, password and name" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Provide a valid email address." });
  }

  // Validate password format (at least 6 characters, 1 lowercase, 1 uppercase, 1 number)
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
  }

  // Check if user with this email already exists
  User.findOne({ email })
    .then((foundUser) => {
      if (foundUser) {
        return res.status(400).json({ message: "User already exists." });
      }

      // Hash the password before saving
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create and save the new user
      return User.create({ email, password: hashedPassword, name });
    })
    .then((createdUser) => {
      // Exclude password from response
      const { email, name, _id } = createdUser;
      res.status(201).json({ user: { email, name, _id } });
    })
    .catch((err) => {
      console.log("Signup error:", err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

// ======================================
// POST /auth/login - Log in user
// ======================================
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  // Check for empty fields
  if (email === "" || password === "") {
    return res.status(400).json({ message: "Provide email and password." });
  }

  // Look for user in database
  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        return res.status(401).json({ message: "User not found." });
      }

      // Compare input password with hashed password
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
      if (!passwordCorrect) {
        return res
          .status(401)
          .json({ message: "Unable to authenticate the user" });
      }

      // Create token payload
      const { _id, email, name } = foundUser;
      const payload = { _id, email, name };

      // Sign the token with a secret and expiration
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      });

      // Send token to client
      res.status(200).json({ authToken });
    })
    .catch((err) => {
      console.log("Login error:", err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

// ======================================
// GET /auth/verify - Verify JWT token
// ======================================
router.get("/verify", isAuthenticated, (req, res, next) => {
  // If token is valid, `isAuthenticated` attaches the payload to `req.payload`
  console.log("Token payload:", req.payload);
  res.status(200).json(req.payload);
});

module.exports = router;
