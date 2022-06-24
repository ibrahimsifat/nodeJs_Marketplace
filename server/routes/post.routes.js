const { requireSignIn } = require("../controllers/auth.controller");
const postCtrl = require("../controllers/post.controller");
const postRouter = require("express").Router();
const upload = require("../middlewares/users/avatarUpload");

//Creating the post
// routes path="/by/:userId"
postRouter
  .route("/new")
  .post(requireSignIn, upload.single("postImg"), postCtrl.create);

// routes path="/api/posts/:userId"
postRouter.route("/myPost").get(requireSignIn, postCtrl.listByUser);

// to set req.post =post
postRouter.param("postId", postCtrl.postByID);

// routes path="/photo/:postId"
// The photo controller will return the photo data stored in MongoDB as an image file.
postRouter.route("/photo/:postId").get(postCtrl.photo);

// get a post by id  delete post
postRouter
  .route("/:postId")
  .get(requireSignIn, (req, res) => {
    res.json(req.post);
  })
  .delete(requireSignIn, postCtrl.isPoster, postCtrl.deletePost);

// post like
postRouter.route("/like").put(requireSignIn, postCtrl.like);

// post unlike
postRouter.route("/unlike").put(requireSignIn, postCtrl.unlike);

// add comments
postRouter.route("/comment").put(requireSignIn, postCtrl.comment);

// delete comment
postRouter.route("/uncomment").put(requireSignIn, postCtrl.uncomment);

module.exports = postRouter;
