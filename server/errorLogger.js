const winston = require("winston");
const expressWinston = require("express-winston");
const winstonDaily = require("winston-daily-rotate-file");
const winstonMongo = require("winston-mongodb");
const { ElasticsearchTransport } = require("winston-elasticsearch");
const { mongoUri } = require("./config/config");

exports.processRequest = async (req, res, next) => {
  var correlationId = req.headers["x-correlation-id"];
  if (!correlationId) {
    req.headers["x-correlation-id"] = Date.now().toString();
    correlationId = req.headers["x-correlation-id"];
  }

  res.set("x-correlation-id", correlationId);

  return next();
};

var fileTransport = new winston.transports.DailyRotateFile({
  filename: "application-info-%DATE%.log",
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

const esTransportOpts = {
  level: "info",
  clientOpts: { node: "http://localhost:9200/" },
  indexPrefix: "log",
};

const esTransport = new ElasticsearchTransport(esTransportOpts);

var fileErrorTransport = new winston.transports.DailyRotateFile({
  filename: "application-error-%DATE%.log",
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

var mongoErrorTransport = new winston.transports.MongoDB({
  db: mongoUri,
  metaKey: "meta",
});

var getLogMessage = function (req, res) {
  var msgObj = {
    correlationId: req.headers["x-correlation-id"],
    requestBody: req.body,
  };

  return JSON.stringify(msgObj);
};

exports.infoLogger = expressWinston.logger({
  transports: [new winston.transports.Console(), fileTransport, esTransport],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: false,
  msg: getLogMessage,
});

exports.errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(),
    fileErrorTransport,
    mongoErrorTransport,
    esTransport,
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: true,
  msg: '{ "correlationId": "{{req.headers["x-correlation-id"]}}", "error" : "{{err.message}}" }',
  correlationId: "{{req.headers['x-correlation-id']}}",
});
