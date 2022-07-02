const productRouter = require("express").Router();
const {
  requireSignIn,
  hasAuthorization,
} = require("../controllers/auth.controller");
const userCtrl = require("../controllers/user.controller");
const productCtrl = require("../controllers/product.controller");
const shopCtrl = require("../controllers/shop.controller");
const upload = require("../middlewares/users/avatarUpload");

productRouter
  .route("/by/:shopId")
  .post(
    requireSignIn,
    shopCtrl.isOwner,
    upload.single("image"),
    productCtrl.create
  );
productRouter.param("shopId", shopCtrl.shopByID);

module.exports = productRouter;

// courseRouter
// .route("/:courseId/comment/:commentId")
// .get(requireSignIn, courseCtrl.isInstructor, courseCtrl.getCommentById)
// .patch(requireSignIn, courseCtrl.isInstructor, courseCtrl.updateComment);

// // add comments
// courseRouter
// .route("/:courseId/comments")
// .get(requireSignIn, courseCtrl.isInstructor, courseCtrl.readComments)
// .post(requireSignIn, courseCtrl.comment);

// // delete comment
// courseRouter.route("/uncomment").put(requireSignIn, courseCtrl.uncomment);
