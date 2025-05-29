const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require('mongoose');

// IMPORT ROUTES
const cohortRoutes = require("./routes/cohorts");
const studentRoutes = require("./routes/students");

// DEFINE PORT
const PORT = 5005;

// INITIALIZE EXPRESS APP
const app = express();

// MONGOOSE CONNECT with debug logs
mongoose.connect("mongodb://localhost:27017/cohort-tools-api")
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

// MIDDLEWARE
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5005"],
  })
);

// ROUTE FOR DOCUMENTATION
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// USE ROUTES FROM ROUTES FOLDER
app.use("/api/cohorts", cohortRoutes);
app.use("/api/students", studentRoutes);

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
