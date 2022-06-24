const Post = require("../models/Post.model");
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
    let posts = await Post.find({ postedBy: req.profile._id })
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

// create a post
const create = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    let post = new Post(fields);
    post.postedBy = req.profile;
    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }
    try {
      let result = await post.save();
      res.json(result);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
};

//
const photo = (req, res, next) => {
  res.set("Content-Type", req.post.photo.contentType);
  return res.send(req.post.photo.data);
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
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;
  if (!isPoster) {
    return res.status("403").json({
      error: "User is not authorized",
    });
  }
  next();
};

//
const deletePost = () => {
  remove(
    {
      postId: props.post._id,
    },
    {
      t: jwt.token,
    }
  ).then((data) => {
    if (data.error) {
      console.log(data.error);
    } else {
      props.onRemove(props.post);
    }
  });
};

// post like
const like = async (req, res) => {
  try {
    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $push: { likes: req.body.userId } },
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
      { $pull: { likes: req.body.userId } },
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
const comment = async (req, res) => {
  let comment = req.body.comment;
  comment.postedBy = req.body.userId;
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
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// delete comment
const uncomment = async (req, res) => {
  let comment = req.body.comment;
  try {
    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $pull: { comments: { _id: comment._id } } },
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
