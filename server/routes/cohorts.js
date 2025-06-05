const express = require("express");
const router = express.Router();
const Cohort = require("../models/Cohort");

// GET all cohorts
router.get("/", (req, res, next) => {
  Cohort.find()
    .then((cohorts) => res.json(cohorts))
    .catch(next);
});

// POST new cohort
router.post("/", (req, res, next) => {
  Cohort.create(req.body)
    .then((newCohort) => res.status(201).json(newCohort))
    .catch(next);
});

// GET cohort by ID
router.get("/:cohortId", (req, res, next) => {
  const { cohortId } = req.params;

  Cohort.findById(cohortId)
    .then((cohort) => {
      if (!cohort) return res.status(404).json({ message: "Cohort not found" });
      res.json(cohort);
    })
    .catch(next);
});

// UPDATE cohort
router.put("/:cohortId", (req, res, next) => {
  const { cohortId } = req.params;

  Cohort.findByIdAndUpdate(cohortId, req.body, {
    new: true,
    runValidators: true,
  })
    .then((updatedCohort) => {
      if (!updatedCohort)
        return res.status(404).json({ message: "Cohort not found" });
      res.json(updatedCohort);
    })
    .catch(next);
});

// DELETE cohort
router.delete("/:cohortId", (req, res, next) => {
  const { cohortId } = req.params;

  Cohort.findByIdAndDelete(cohortId)
    .then((deletedCohort) => {
      if (!deletedCohort)
        return res.status(404).json({ message: "Cohort not found" });
      res.json({ message: "Cohort deleted successfully" });
    })
    .catch(next);
});

module.exports = router;




