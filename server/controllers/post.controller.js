const Post = require("../models/Post.model");
const { createPostService } = require("../services/post.services");
const listNewsFeed = async (req, res) => {
  // TODO req.profile.following come from token or requireSignIn middleware

  //  the Post listNewsFeed get post in the database to get the matching posts.
  let following = req.profile.following;
  following.push(req.profile._id);
  try {
    let posts = await Post.find({ postedBy: { $in: req.profile.following } })
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .sort("-created")
      .exec();
    res.json(posts);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// This query will return the list of posts that were created by a specific user
const listByUser = async (req, res) => {
  try {
    let posts = await Post.find({ postedBy: req.profile.userId })
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .sort("-createdAt")
      .exec();
    res.json(posts);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// create a post
const create = async (req, res, next) => {
  try {
    const newPost = await createPostService(req, res);
    res.status(200).json({
      message: "Successfully Added post!",
      newPost,
    });
  } catch (err) {
    next(err);
  }
};

//
const photo = (req, res, next) => {
  return res.status(200).send(req.post.photo);
};

//it will attach the post retrieved from the database to the request object so that it can be accessed by the next method
const postByID = async (req, res, next, id) => {
  try {
    let post = await Post.findById(id).populate("postedBy", "_id name").exec();
    if (!post)
      return res.status("400").json({
        error: "Post not found",
      });
    req.post = post;
    next();
  } catch (err) {
    return res.status("400").json({
      error: "Could not retrieve use post",
    });
  }
};

//checks whether the signed-in user is the original creator of the post before executing the next method
const isPoster = (req, res, next) => {
  let isPoster =
    req.post && req.profile && req.post.postedBy._id == req.profile.userId;
  if (!isPoster) {
    return res.status("403").json({
      error: "User is not authorized",
    });
  }
  next();
};

//
const deletePost = async (req, res, next) => {
  try {
    let postId = req.params.postId;
    console.log(postId);
    await Post.findByIdAndDelete(postId);
    res.status(203).json({ message: "success" });
  } catch (err) {
    next(err);
  }
};

// post like
const like = async (req, res) => {
  try {
    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $push: { likes: req.profile.userId } },
      { new: true }
    );
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// unlike post
const unlike = async (req, res) => {
  try {
    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $pull: { likes: req.profile.userId } },
      { new: true }
    );
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// add comments
const comment = async (req, res, next) => {
  let comment = req.body;
  comment.text = req.body.comment;
  comment.postedBy = req.profile.userId;
  try {
    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $push: { comments: comment } },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .exec();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// delete comment
const uncomment = async (req, res) => {
  let commentId = req.body.commentId;
  try {
    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .exec();
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

module.exports = {
  listNewsFeed,
  listByUser,
  create,
  photo,
  postByID,
  isPoster,
  deletePost,
  like,
  unlike,
  comment,
  uncomment,
};
