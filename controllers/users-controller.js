const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const HttpError = require("../models/http-error");

const User = require("../models/user-model");

exports.getAllUsers = (req, res, next) => {};

exports.deleteUser = (req, res, next) => {
  const { uid } = req.params;
};

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, pic } = req.body;

    if (!(name && email && password)) {
      return next(new HttpError("All informations are required", 400));
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return next(
        new HttpError("Account Exists.Please login or use another email.", 409)
      );
    }

    const user = await User.create({
      name,
      email,
      password,
    });
    const token = jwt.sign(
      { userId: user._id, email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res
      .status(201)
      .json({ user: user.toObject({ getters: true }), token });
  } catch (err) {
    return next(new HttpError(err, 500));
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return next(new HttpError("All Informations are required."));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(new HttpError("User does not exist. Please sign up.", 400));
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { userId: user._id, email },
        process.env.JWT_SECRET,
        {
          expiresIn: "2h",
        }
      );

      return res
        .status(200)
        .json({ user: user.toObject({ getters: true }), token });
    } else {
      return next(new HttpError("Invalid credentials", 403));
    }
  } catch (err) {
    return next(new HttpError(err, 500));
  }
};
