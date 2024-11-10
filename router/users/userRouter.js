const express = require("express");
const userController = require("../../controllers/users/userController");
const userRouter = express.Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.get("/auth/google", userController.googleAuth);
userRouter.get("/auth/google/callback", userController.googleAuthCallback);

module.exports = userRouter;
