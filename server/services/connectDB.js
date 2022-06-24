const mongoose = require("mongoose");
const { mongoUri } = require("../config/config");

exports.connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log(mongoUri);
    console.log("database connection Successful");
  } catch (error) {
    console.log(error);
  }
};
