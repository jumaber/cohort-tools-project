// routes/cohorts.js
const express = require("express");
const router = express.Router();
const Cohort = require("../models/Cohort");

// GET all cohorts
router.get("/", (req, res) => {
  Cohort.find()
    .then(cohorts => res.json(cohorts))
    .catch(err => res.status(500).json({ message: "Error fetching cohorts 😬", error: err }));
});

module.exports = router;