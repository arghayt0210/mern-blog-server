const asyncHandler = require("express-async-handler");
const Post = require("../../models/post/post");
const mongoose = require("mongoose");
const CustomError = require("../../utils/CustomError");

const createPost = asyncHandler(async (req, res) => {
  // get the payload
  const { title, description } = req.body;

  // find post by title
  const post = await Post.findOne({ title });
  if (post) {
    throw new CustomError("Post already exists", 400);
  }
  const postCreated = await Post.create({
    title,
    description,
  });

  res.json({
    status: "success",
    message: "Post created successfully",
    data: postCreated,
  });
});

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find();
  res.json({
    status: "success",
    message: "Posts fetched successfully",
    data: posts,
  });
});

const updatePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { title, description } = req.body;

  // Check if postId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new CustomError("Invalid post ID format", 400);
  }

  // find the post
  const post = await Post.findById(postId);
  if (!post) {
    throw new CustomError("Post not found", 404);
  }

  // update the post
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      title,
      description,
    },
    { new: true } // return the updated post
  );

  res.json({
    status: "success",
    message: "Post updated successfully",
    data: updatedPost,
  });
});

const getSinglePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  // Check if postId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new CustomError("Invalid post ID format", 400);
  }

  // find the post
  const post = await Post.findById(postId);
  if (!post) {
    throw new CustomError("Post not found", 404);
  }

  res.json({
    status: "success",
    message: "Post fetched successfully",
    data: post,
  });
});

const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  // Check if postId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new CustomError("Invalid post ID format", 400);
  }

  // find the post
  const post = await Post.findById(postId);
  if (!post) {
    throw new CustomError("Post not found", 404);
  }

  // delete the post
  const deletedPost = await Post.findByIdAndDelete(postId);

  res.json({
    status: "success",
    message: "Post deleted successfully",
    data: deletedPost,
  });
});

module.exports = {
  createPost,
  getAllPosts,
  updatePost,
  getSinglePost,
  deletePost,
};
