const User = require("../models/User.model");
const extend = require("lodash/extend");
const errorHandler = require("./error.controller");
const bcrypt = require("bcrypt");

const create = async (req, res, next) => {
  try {
    const user = new User(req.body);
    if (req.body.password.length < 6) {
      return res.status(403).json({ message: "password too short" });
    }
    // hashing password.(registration)
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    const newUser = await user.save();
    res.status(200).json({
      message: "Successfully signed up!",
      user: newUser,
    });
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
};
const list = async (req, res) => {
  try {
    let users = await User.find().select("username email updated createdAt");
    res.json(users);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id);
    if (!user)
      return res.status("400").json({
        error: "User not found",
      });
    req.requestedUser = user;
    next();
  } catch (err) {
    return res.status("400").json({
      error: "Could not retrieve user",
    });
  }
};
const read = (req, res) => {
  req.profile.password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};
const update = async (req, res, next) => {
  try {
    const filter = { _id: req.params.userId };
    const update = {
      username: req.body.username,
      email: req.body.email,
    };
    const option = { new: true };
    const updatedUser = await User.findOneAndUpdate(filter, update, option);
    res.status(400).json({
      status: "success",
      user: updatedUser,
    });
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
};
const remove = async (req, res, next) => {
  try {
    let user = req.profile;
    let deletedUser = await user.remove();
    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;
    res.json(deletedUser);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
module.exports = { create, userByID, read, list, remove, update };
