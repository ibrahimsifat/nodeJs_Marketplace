const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const config = require("../../config/config");
const bcrypt = require("bcrypt");
// const { expressJwt } = require("express-jwt");
const { expressjwt: expressJwt } = require("express-jwt");
const signIn = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status("401").json({ error: "User not found" });
    const isMatchedPassword = bcrypt.compare(req.body.password, user.password);
    if (isMatchedPassword) {
      const token = jwt.sign({ _id: user._id }, config.jwtSecret);
      res.cookie("t", token, { expire: new Date() + 9999 });
      res.status(200).json({
        token,
        user: {
          _id: user._id,
          name: user.username,
          email: user.email,
        },
      });
    } else {
      return res
        .status("401")
        .send({ error: "Email and password don't match." });
    }
  } catch (err) {
    return res.status("401").json({ error: err });
  }
};
const signOut = (req, res) => {
  res.clearCookie("t");
  return res.status("200").json({
    message: "signed out",
  });
};
const requireSignIn = expressJwt({
  secret: config.jwtSecret,
  algorithms: ["HS256"],
  userProperty: "auth",
});

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!authorized) {
    return res.status("403").json({
      error: "User is not authorized",
    });
  }
  next();
};
module.exports = { signIn, signOut, requireSignIn, hasAuthorization };
