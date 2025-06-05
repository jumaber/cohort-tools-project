const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// GET all students with populated cohort data
router.get("/", (req, res, next) => {
  Student.find()
    .populate("cohort")
    .then((students) => res.json(students))
    .catch(next);
});

// POST new student
router.post("/", (req, res, next) => {
  Student.create(req.body)
    .then((newStudent) => res.status(201).json(newStudent))
    .catch(next);
});

// GET students by cohort ID with populated cohort data
router.get("/cohort/:cohortId", (req, res, next) => {
  const { cohortId } = req.params;

  Student.find({ cohort: cohortId })
    .populate("cohort")
    .then((students) => res.json(students))
    .catch(next);
});

// GET one student by ID with populated cohort data
router.get("/:studentId", (req, res, next) => {
  const { studentId } = req.params;

  Student.findById(studentId)
    .populate("cohort")
    .then((student) => {
      if (!student)
        return res.status(404).json({ message: "Student not found" });
      res.json(student);
    })
    .catch(next);
});

// UPDATE student by ID
router.put("/:studentId", (req, res, next) => {
  const { studentId } = req.params;

  Student.findByIdAndUpdate(studentId, req.body, {
    new: true,
    runValidators: true,
  })
    .then((updatedStudent) => {
      if (!updatedStudent)
        return res.status(404).json({ message: "Student not found" });
      res.json(updatedStudent);
    })
    .catch(next);
});

// DELETE student by ID
router.delete("/:studentId", (req, res, next) => {
  const { studentId } = req.params;

  Student.findByIdAndDelete(studentId)
    .then((deletedStudent) => {
      if (!deletedStudent)
        return res.status(404).json({ message: "Student not found" });
      res.json({ message: "Student deleted successfully" });
    })
    .catch(next);
});

module.exports = router;
