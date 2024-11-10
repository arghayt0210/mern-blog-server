const express = require("express");
require("dotenv").config();
const Post = require("./models/post/post");
const connectDb = require("./utils/connectDb");
const cors = require("cors");
const passport = require("./utils/password-config");
const { default: mongoose } = require("mongoose");
const CustomError = require("./utils/CustomError");
const postRouter = require("./router/post/postRouter");
const userRouter = require("./router/users/userRouter");

connectDb();

const app = express();

//! PORT
const PORT = 5000;

//Middlewares
const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//! Passport middleware
app.use(passport.initialize());

//! Routes
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

//! Error Handling Middleware
app.use((err, req, res, next) => {
  // Set defaults
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

//! Start Server

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
