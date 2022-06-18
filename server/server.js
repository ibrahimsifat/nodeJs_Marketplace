const mongoose = require("mongoose");
const { port, mongoUri } = require("../config/config.js");
// console.log(port);
const app = require("./express");

// database connection
mongoose.Promise = global.Promise;
mongoose.connect(mongoUri);
// if errors
mongoose.connection.on("error", () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

// listen the app
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.info("Server started on port %s.", port);
});
