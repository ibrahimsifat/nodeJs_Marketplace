const orderRouter = require("express").Router();
const {
  requireSignIn,
  hasAuthorization,
} = require("../controllers/auth.controller");
const userCtrl = require("../controllers/user.controller");
const productCtrl = require("../controllers/product.controller");
const shopCtrl = require("../controllers/shop.controller");
const orderCtrl = require("../controllers/order.controller");
const upload = require("../middlewares/users/avatarUpload");

orderRouter
  .route("/api/orders/:userId")
  .post(
    requireSignIn,
    userCtrl.stripeCustomer,
    productCtrl.decreaseQuantity,
    orderCtrl.create
  );
orderRouter.param("userId", userCtrl.userByID);

// listing orders
orderRouter
  .route("/shop/:shopId")
  .get(requireSignIn, shopCtrl.isOwner, orderCtrl.listByShop);
orderRouter.param("shopId", shopCtrl.shopByID);

//Get status values
orderRouter.route("/status_values").get(orderCtrl.getStatusValues);

// /Update order status
orderRouter
  .route("/status/:shopId")
  .put(requireSignIn, shopCtrl.isOwner, orderCtrl.update);

//Cancel product order
orderRouter
  .route("/order/:shopId/cancel/:productId")
  .put(
    requireSignIn,
    shopCtrl.isOwner,
    productCtrl.increaseQuantity,
    orderCtrl.update
  );
orderRouter.param("productId", productCtrl.productByID);

//Process charge for a product
orderRouter
  .route("/order/:orderId/charge/:userId/:shopId")
  .put(
    requireSignIn,
    shopCtrl.isOwner,
    userCtrl.createCharge,
    orderCtrl.update
  );
orderRouter.param("orderId", orderCtrl.orderByID);

module.exports = orderRouter;
