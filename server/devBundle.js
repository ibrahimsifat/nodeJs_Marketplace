const config = require("./config/config");
const webpack = require("webpack");
const webpackMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const compile = (app) => {
  if (config.env === "development") {
  }
};
module.exports = {
  compile,
};
