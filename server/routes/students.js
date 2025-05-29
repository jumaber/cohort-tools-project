// routes/students.js
const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// GET all students
router.get("/", (req, res) => {
  Student.find()
    .then(students => res.json(students))
    .catch(err => res.status(500).json({ message: "Error fetching students 😬", error: err }));
});

module.exports = router;
