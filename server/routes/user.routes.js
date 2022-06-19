const express = require("express");
const userCtrl = require("../controllers/user.controller");
const userRouter = express.Router();
userRouter.route("/").get(userCtrl.list).post(userCtrl.create);
userRouter
  .route("/:userId")
  .get(userCtrl.read)
  .put(userCtrl.update)
  .delete(userCtrl.remove);
userRouter.param("userId", userCtrl.userByID);
module.exports = userRouter;
