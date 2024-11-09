const express = require("express");
const postRouter = express.Router();

const {
  createPost,
  getAllPosts,
  updatePost,
  getSinglePost,
  deletePost,
} = require("../../controllers/post/postControllers");

// ----Create Post----
postRouter.post("/create", createPost);

// ----Get All Posts----
postRouter.get("/", getAllPosts);

// ----Update Post----
postRouter.put("/:postId", updatePost);
// ----Get Post----
postRouter.get("/:postId", getSinglePost);
// ----Delete Post----
postRouter.delete("/:postId", deletePost);

module.exports = postRouter;
