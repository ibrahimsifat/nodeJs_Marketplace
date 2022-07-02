const shopRouter = require("express").Router();
const {
  requireSignIn,
  hasAuthorization,
} = require("../controllers/auth.controller");
const userCtrl = require("../controllers/user.controller");
const shopCtrl = require("../controllers/shop.controller");
const upload = require("../middlewares/users/avatarUpload");

shopRouter.route("/").get(shopCtrl.list);
shopRouter
  .route("/new/:userId")
  .post(
    requireSignIn,
    userCtrl.isSeller,
    upload.single("image"),
    shopCtrl.create
  );
shopRouter.param("userId", userCtrl.userByID);
shopRouter
  .route("/by/:userId")
  .get(requireSignIn, hasAuthorization, shopCtrl.listByOwner);

shopRouter
  .route("/shop/:shopId")
  .get(shopCtrl.read)
  .patch(
    requireSignIn,
    shopCtrl.isOwner,
    upload.single("image"),
    shopCtrl.update
  )
  .delete(requireSignIn, shopCtrl.isOwner, shopCtrl.remove);

shopRouter.param("shopId", shopCtrl.shopByID);
module.exports = shopRouter;
