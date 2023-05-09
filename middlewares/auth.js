const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const verifyToken = async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new HttpError("A token is required for authentication.", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, token);

    const user = await User.findById(decoded.userId).select("-password");
    req.user = user;
  } catch (err) {
    return next(new HttpError("Invalid Token", 403));
  }
  next();
};

module.exports = verifyToken;
