require("dotenv/config");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require('mongoose');
const { isAuthenticated } = require("./middleware/jwt.middleware");

// IMPORT ROUTES
const cohortRoutes = require("./routes/cohorts");
const studentRoutes = require("./routes/students");
const authRoutes = require("./routes/auth.routes");

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

// USE ROUTES FROM ROUTES FOLDER AND USE JTW MIDDLEWARE TO PROTECT THE ROUTES
app.use("/api/cohorts", isAuthenticated, cohortRoutes);
app.use("/api/students", isAuthenticated, studentRoutes);
app.use("/auth", authRoutes);

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// ERROR HANDLING
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  // ValidationError: usually means required fields were missing or typed wrong
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message:
        "It looks like something is missing or not quite right in the data you sent. Double-check your fields and try again 😊",
      details: err.message,
    });
  }

  // CastError: usually means the ID in the URL is not the right format
  if (err.name === "CastError") {
    return res.status(400).json({
      message:
        "Hmm... the ID you provided doesn’t look valid. It should look like a long string of letters and numbers 🧩",
      details: err.message,
    });
  }

  // NotFoundError: a custom one you can throw when an item isn't found
  if (err.name === "NotFoundError") {
    return res.status(err.status).json({
      message:
        "We couldn’t find what you were looking for. Maybe the ID is wrong, or the item was deleted 🧐",
      details: err.message,
    });
  }

  // All other errors
  res.status(500).json({
    message:
      "Something went wrong on the server — don’t worry, it’s not your fault! (sure) 😅",
    ...(process.env.NODE_ENV === "development" && { details: err.stack }),
  });
});

