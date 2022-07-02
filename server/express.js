// external imports
const compress = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const devBundle = require("./devBundle");
// internal imports
const authRouter = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const shopRouter = require("./routes/shop.routes");
const productRouter = require("./routes/product.routes");

// create app
const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(compress());
app.use(helmet());
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
devBundle.compile(app);

// const CURRENT_WORKING_DIR = process.cwd();
// app.use("/dist", express.static(path.join(CURRENT_WORKING_DIR, "dist")));
//routers
app.use("/api/users", userRoutes);
app.use("/api/auth", authRouter);
app.use("/api/shops", shopRouter);
app.use("/api/products", productRouter);
// app.use("/api/courses", courseRouter);
// app.use("/api/courses", courseRouter);

app.get("/api/health", (req, res) => {
  res.status(200).send("hello health");
});

// handle auth related errors
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  } else if (err) {
    res
      .status(err.status || 400)
      .json({ error: err.name + ": " + err.message });
    console.log(err);
  }
});

module.exports = app;
