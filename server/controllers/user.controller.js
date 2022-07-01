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
    let user = await User.findById(id)
      .populate("following", "_id name")
      .populate("followers", "_id name");

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

/// follower add and remove
const addFollowing = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.profile.userId, {
      $push: { following: req.body.followId },
    });
    next();
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const addFollower = async (req, res) => {
  try {
    let result = await User.findByIdAndUpdate(
      req.body.followId,
      { $push: { followers: req.profile.userId } },
      { new: true }
    )
      .populate("following", "_id name")
      .populate("followers", "_id name")
      .exec();
    result.password = undefined;
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const removeFollowing = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.profile.userId, {
      $pull: { following: req.body.unfollowId },
    });
    next();
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const removeFollower = async (req, res) => {
  try {
    let result = await User.findByIdAndUpdate(
      req.body.unfollowId,
      { $pull: { followers: req.profile.userId } },
      { new: true }
    )
      .populate("following", "_id name")
      .populate("followers", "_id name")
      .exec();
    result.hashed_password = undefined;
    result.salt = undefined;
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// find user followers
const findFollowers = async (req, res, next) => {
  let followers = req.profile.followers;
  followers.push(req.profile.userId);
  try {
    let users = await User.find({ _id: { $nin: followers } }).select(
      "username"
    );
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// find users following following
const findFollowing = async (req, res, next) => {
  let following = req.profile.following;
  following.push(req.profile._id);
  try {
    let users = await User.find({ _id: { $nin: following } }).select(
      "username"
    );
    res.json(users);
  } catch (err) {
    next(err);
  }
};

//  current user is actually an educator
const isEducator = (req, res, next) => {
  const isEducator = req.profile.userId && req.profile.educator;
  console.log(isEducator);
  if (!isEducator) {
    console.log("isEducator", isEducator);
    return res.status("403").json({
      error: "User is not an educator",
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
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
  findFollowers,
  findFollowing,
  isEducator,
};
