const User = require("../../models/user/user");
const asyncHandler = require("express-async-handler");
const CustomError = require("../../utils/CustomError");
const bcrypt = require("bcryptjs");
const passport = require("../../utils/password-config");
const jwt = require("jsonwebtoken");

const register = asyncHandler(async (req, res) => {
  // check if username already exists
  const { username, email, password } = req.body;
  const user = await User.findOne({ username, email });
  if (user) {
    throw new CustomError("User already exists", 400);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    status: "success",
    message: "User registered successfully",
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    // if user not found
    if (!user) {
      throw new CustomError(info.message, 401);
    }

    // generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        username: user.username,
        email: user.email,
        _id: user._id,
      },
    });
  })(req, res, next);
});

// Google OAuth
const googleAuth = passport.authenticate("google", { scope: ["profile"] });
// !google auth callback
const googleAuthCallback = asyncHandler(async (req, res, next) => {
  passport.authenticate(
    "google",
    {
      failureRedirect: "/login",
      session: false,
    },
    (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect("http://localhost:5173/google-login-error");
      }
      // generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      // set token in cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
      res.redirect("http://localhost:5173/dashboard");
    }
  )(req, res, next);
});

module.exports = {
  register,
  login,
  googleAuth,
  googleAuthCallback,
};
