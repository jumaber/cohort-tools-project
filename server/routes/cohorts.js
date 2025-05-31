const express = require("express");
const router = express.Router();
const Cohort = require("../models/Cohort");

// GET all cohorts
router.get("/", (req, res) => {
  Cohort.find()
    .then(cohorts => res.json(cohorts))
    .catch(err => res.status(500).json({ message: "Error fetching cohorts 😬", error: err }));
});

// POST new cohort
router.post("/", (req, res) => {
  Cohort.create(req.body)
    .then(newCohort => res.status(201).json(newCohort))
    .catch(err => res.status(400).json({ message: "Error creating cohort 😢", error: err }));
});

// GET cohort by ID
router.get("/:cohortId", (req, res) => {
  const { cohortId } = req.params;

  Cohort.findById(cohortId)
    .then(cohort => {
      if (!cohort) return res.status(404).json({ message: "Cohort not found" });
      res.json(cohort);
    })
    .catch(err => res.status(500).json({ message: "Error fetching cohort 😓", error: err }));
});

// UPDATE cohort
router.put("/:cohortId", (req, res) => {
  const { cohortId } = req.params;

  Cohort.findByIdAndUpdate(cohortId, req.body, { new: true, runValidators: true })
    .then(updatedCohort => {
      if (!updatedCohort) return res.status(404).json({ message: "Cohort not found" });
      res.json(updatedCohort);
    })
    .catch(err => res.status(400).json({ message: "Error updating cohort 😓", error: err }));
});

// DELETE cohort
router.delete("/:cohortId", (req, res) => {
  const { cohortId } = req.params;

  Cohort.findByIdAndDelete(cohortId)
    .then(deletedCohort => {
      if (!deletedCohort) return res.status(404).json({ message: "Cohort not found" });
      res.json({ message: "Cohort deleted successfully" });
    })
    .catch(err => res.status(500).json({ message: "Error deleting cohort 😓", error: err }));
});

module.exports = router;