const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// GET all students
router.get("/", (req, res) => {
  Student.find()
    .then(students => res.json(students))
    .catch(err => res.status(500).json({ message: "Error fetching students 😬", error: err }));
});

// POST new student
router.post("/", (req, res) => {
  Student.create(req.body)
    .then(newStudent => res.status(201).json(newStudent))
    .catch(err => res.status(400).json({ message: "Error creating student 😢", error: err }));
});

// GET students by cohort ID
router.get("/cohort/:cohortId", (req, res) => {
  const { cohortId } = req.params;

  Student.find({ cohort: cohortId })
    .then(students => res.json(students))
    .catch(err => res.status(500).json({ message: "Error fetching students by cohort 😓", error: err }));
});

// GET one student by ID
router.get("/:studentId", (req, res) => {
  const { studentId } = req.params;

  Student.findById(studentId)
    .then(student => {
      if (!student) return res.status(404).json({ message: "Student not found" });
      res.json(student);
    })
    .catch(err => res.status(500).json({ message: "Error fetching student 😓", error: err }));
});

// UPDATE student by ID
router.put("/:studentId", (req, res) => {
  const { studentId } = req.params;

  Student.findByIdAndUpdate(studentId, req.body, { new: true, runValidators: true })
    .then(updatedStudent => {
      if (!updatedStudent) return res.status(404).json({ message: "Student not found" });
      res.json(updatedStudent);
    })
    .catch(err => res.status(400).json({ message: "Error updating student 😓", error: err }));
});

// DELETE student by ID
router.delete("/:studentId", (req, res) => {
  const { studentId } = req.params;

  Student.findByIdAndDelete(studentId)
    .then(deletedStudent => {
      if (!deletedStudent) return res.status(404).json({ message: "Student not found" });
      res.json({ message: "Student deleted successfully" });
    })
    .catch(err => res.status(500).json({ message: "Error deleting student 😓", error: err }));
});

module.exports = router;
