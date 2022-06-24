const { requireSignIn } = require("../controllers/auth.controller");
const postCtrl = require("../controllers/post.controller");
const postRouter = require("express").Router();

// routes path="/api/posts/by/:userId"
postRouter.route("/by/:userId").get(requireSignIn, postCtrl.listByUser);

//Creating the post
// routes path="/by/:userId"
postRouter.route("/new/:userId").post(requireSignIn, postCtrl.create);

// The photo controller will return the photo data stored in MongoDB as an image file.
// routes path="/photo/:postId"
postRouter.route("/photo/:postId").get(postCtrl.photo);
postRouter.param("postId", postCtrl.postByID);

// delete post
postRouter
  .route("/:postId")
  .delete(requireSignIn, postCtrl.isPoster, postCtrl.deletePost);

// post like
postRouter.route("/like").put(requireSignIn, postCtrl.like);

// post unlike
postRouter.route("/unlike").put(requireSignIn, postCtrl.unlike);

// add comments
postRouter.route("/comment").put(requireSignIn, postCtrl.comment);

// delete comment

//The uncomment controller method will find the relevant post by ID and pull the comment with the deleted comment's ID from the comments array in the post,
postRouter.route("/uncomment").put(requireSignIn, postCtrl.uncomment);

module.exports = postRouter;
