const express = require("express");
const userCtrl = require("../controllers/user.controller");
const upload = require("../middlewares/users/avatarUpload");
const authCtrl = require("../controllers/auth.controller");

const userRouter = express.Router();
const { requireSignIn, hasAuthorization } = authCtrl;

// routes path="/"
userRouter
  .route("/")
  .get(userCtrl.list)
  .post(upload.single("avatar"), userCtrl.create);

// routes path="/:userId"
userRouter
  .route("/:userId")
  .get(userCtrl.read)
  .patch(requireSignIn, hasAuthorization, userCtrl.update)
  .delete(requireSignIn, hasAuthorization, userCtrl.remove);

userRouter.param("userId", userCtrl.userByID);
module.exports = userRouter;
