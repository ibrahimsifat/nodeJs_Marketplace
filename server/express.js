// external imports
const compress = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");

// internal imports
const template = require("../template");
const userRoutes = require("./routes/user.routes");
// create app
const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

//routers
app.get("/api/users", userRoutes);
app.get("/", (req, res) => {
  res.status(200).send(template());
});

module.exports = app;
