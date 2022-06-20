const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const config = require("../../config/config");
const bcrypt = require("bcrypt");
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

// check user is login with jwt token
const requireSignIn = (req, res, next) => {
  // const authHeader = req.headers["authorization"];
  // const token = authHeader && authHeader.split(" ")[1];
  //   console.log(token);
  //   console.log(cookie);
  const cookie = req.cookies.t;
  if (cookie == null) return res.sendStatus(401);
  jwt.verify(cookie, config.jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403).json({ error: err.message });

    req.tokenUserId = user._id;
    req.profile = user;
    next();
  });
};

// user authorized to update and delete own details
const hasAuthorization = (req, res, next) => {
  const token = req.cookies.t;
  if (token) {
    jwt.verify(token, config.jwtSecret, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized" });
      } else {
        const authorized = req.tokenUserId == decodedToken._id.toString();
        if (authorized) {
          next();
        } else {
          return res.status("403").json({
            error: "User is not authorized for this operation",
          });
        }
      }
    });
  } else {
    return res.status("403").json({
      error: "User is not authorized ",
    });
  }
  next();
};

module.exports = { signIn, signOut, requireSignIn, hasAuthorization };
