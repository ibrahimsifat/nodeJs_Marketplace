const jwt = require("jsonwebtoken");
const config = require("../config/config");
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const cookie = req.cookies.t;
  const token = authHeader && authHeader.split(" ")[1];
  //   console.log(token);
  //   console.log(cookie);
  if (cookie == null) return res.sendStatus(401);
  jwt.verify(cookie, config.jwtSecret, (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}

//
const adminAuth = (req, res, next) => {
  const token = req.cookies.t;
  if (token) {
    jwt.verify(token, config.jwtSecret, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized" });
      } else {
        if (decodedToken.role !== "admin") {
          return res.status(401).json({ message: "Not authorized" });
        } else {
          next();
        }
      }
    });
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" });
  }
};

module.exports = { authenticateToken, adminAuth };
