const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require('mongoose');



// DYNAMIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
const Cohort = require("./models/Cohort.js");
const Student = require("./models/Student.js");

// DEFINE PORT
const PORT = 5005;

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MONGOOSE 
mongoose.connect("mongodb://localhost/cohort-tools-api");

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5005"
    ],
  })
);

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

app.get("/api/cohorts", (req, res) => {
  Cohort.find()
  .then(cohorts => res.json(cohorts))
  .catch(err => res.status(500).json({ message: "Error fetching cohorts 😬", error: err }))
});

app.get("/api/students", (req, res) => {
  Student.find()
  .then(students => res.json(students))
  .catch(err => res.status(500).json({ message: "Error fetching cohorts 😬", error: err }))
});


// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


