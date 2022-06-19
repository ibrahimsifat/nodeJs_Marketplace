const express = require("express");
const userCtrl = require("../controllers/user.controller");
const authCtrl = require("../controllers/auth.controller");
const { authenticateToken } = require("../../middlewares/authorize");

const userRouter = express.Router();
const { list, create, read, update, remove, userByID } = userCtrl;
const { requireSignIn, hasAuthorization } = authCtrl;
// routes path="/"
userRouter.route("/").get(list).post(create);

// routes path="/:userId"
userRouter
  .route("/:userId")
  .get(authenticateToken, read)
  .put(requireSignIn, hasAuthorization, update)
  .delete(requireSignIn, hasAuthorization, remove);
userRouter.param("userId", userByID);
module.exports = userRouter;
