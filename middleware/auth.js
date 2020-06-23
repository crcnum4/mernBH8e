const jwt = require("jsonwebtoken");
const config = require("../config");

const name = (req, res, next) => {
  // must do one of the following:
  // respond to the front end and end early
  // or
  // call next();
  console.log("i'm a middleware");
  req.foo = "bar";
  next();
};

const auth = (req, res, next) => {
  const token = req.header("xauth-token");
  if (!token) {
    return res.status(401).json({ message: "Invalid Authorization" });
  }
  try {
    const decoded = jwt.verify(token, config.secretOrKey);

    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = auth;
