const productRouter = require("express").Router();
const {
  requireSignIn,
  hasAuthorization,
} = require("../controllers/auth.controller");
const userCtrl = require("../controllers/user.controller");
const productCtrl = require("../controllers/product.controller");
const shopCtrl = require("../controllers/shop.controller");
const upload = require("../middlewares/users/avatarUpload");

productRouter.route("/:productId").get(productCtrl.read);
productRouter
  .route("/product/:shopId/:productId")
  .patch(
    requireSignIn,
    shopCtrl.isOwner,
    upload.single("image"),
    productCtrl.update
  )
  .delete(requireSignIn, shopCtrl.isOwner, productCtrl.remove);

productRouter.route("/latest").get(productCtrl.listLatest);
productRouter.route("/categories").get(productCtrl.listCategories);
productRouter.route("/api/products").get(productCtrl.list);

productRouter
  .route("/by/:shopId")
  .get(productCtrl.listByShop)
  .post(
    requireSignIn,
    shopCtrl.isOwner,
    upload.single("image"),
    productCtrl.create
  );

productRouter.route("/related/:productId").get(productCtrl.listRelated);
productRouter.param("productId", productCtrl.productByID);

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
