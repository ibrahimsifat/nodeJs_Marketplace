// external imports
const compress = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");

// internal imports
const template = require("../template");
const authRouter = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
// create app
const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

//routers
app.use("/api/users", userRoutes);
app.use("/api/auth", authRouter);
app.get("/dist", (req, res) => {
  res.status(200).send(template());
});

// handle auth related errors
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ": " + err.message });
    console.log(err);
  }
});

module.exports = app;
