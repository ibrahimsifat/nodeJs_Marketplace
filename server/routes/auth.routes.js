const express = require("express");
const authCtrl = require("../controllers/auth.controller");
const authRouter = express.Router();
authRouter.post("/signIn", authCtrl.signIn);
authRouter.get("/signOut", authCtrl.signOut);
module.exports = authRouter;
