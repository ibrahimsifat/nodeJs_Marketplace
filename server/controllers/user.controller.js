const User = require("../models/User.model");
const errorHandler = require("./error.controller");
const { createUserService } = require("../services/user.services");

const create = async (req, res, next) => {
  try {
    const newUser = await createUserService(req, res);
    res.status(200).json({
      message: "Successfully signed up!",
      newUser,
    });
  } catch (err) {
    next(err);
  }
};
const list = async (req, res) => {
  try {
    let users = await User.find().select(
      "username email updated createdAt avatar"
    );
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
    next(err);
  }
};
const read = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    next(err);
  }
};
const update = async (req, res, next) => {
  try {
    const filter = { _id: req.params.userId };
    const { username, email } = req.body;
    if (email.match(/.+\@.+\..+/))
      return res.status(400).json({ error: "need verify email" });
    const update = {
      username,
      email,
    };
    const option = { new: true };
    const updatedUser = await User.findOneAndUpdate(filter, update, option);
    res.status(200).json({
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
    let userId = req.params.userId;
    await User.findByIdAndDelete(userId);
    res.status(203).json({ message: "success" });
  } catch (err) {
    next(err);
  }
};

const isSeller = (req, res, next) => {
  const isSeller = req.profile && req.profile.seller;
  if (!isSeller) {
    return res.status("403").json({
      error: "User is not a seller",
    });
  }
  next();
};

module.exports = {
  create,
  userByID,
  read,
  list,
  remove,
  update,
  isSeller,
};
