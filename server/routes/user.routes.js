const express = require("express");
const userCtrl = require("../controllers/user.controller");
const upload = require("../middlewares/users/avatarUpload");
// const authCtrl = require("../controllers/auth.controller");

const userRouter = express.Router();
const { list, create, read, update, remove, userByID } = userCtrl;
// const { requireSignIn, hasAuthorization } = authCtrl;
// routes path="/"
userRouter.route("/").get(list).post(upload.single("image"), create);

// routes path="/:userId"
userRouter.route("/:userId").get(read).patch(update).delete(remove);
userRouter.param("userId", userByID);
module.exports = userRouter;
