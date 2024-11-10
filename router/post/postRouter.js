const express = require("express");
const postRouter = express.Router();

const {
  createPost,
  getAllPosts,
  updatePost,
  getSinglePost,
  deletePost,
} = require("../../controllers/post/postControllers");
const upload = require("../../utils/cloudinary");

// ----Create Post----
postRouter.post("/create", upload.single("image"), createPost);

// ----Get All Posts----
postRouter.get("/", getAllPosts);

// ----Update Post----
postRouter.put("/:postId", upload.single("image"), updatePost);
// ----Get Post----
postRouter.get("/:postId", getSinglePost);
// ----Delete Post----
postRouter.delete("/:postId", deletePost);

module.exports = postRouter;
