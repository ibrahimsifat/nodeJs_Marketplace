const { port } = require("./config/config.js");
const http = require("http");
const app = require("./express");
const { connectDB } = require("./services/connectDB.js");
const { infoLogger, errorLogger, processRequest } = require("./errorLogger.js");
// implement error file log and console log and electricSearch

// console.log(port);

connectDB();
app.use(processRequest);

// logger service
app.use(infoLogger);
const server = http.createServer(app);
app.use(errorLogger);

// listen the app
server.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.info("Server started on port %s.", port);
});
