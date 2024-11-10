const asyncHandler = require("express-async-handler");
const Post = require("../../models/post/post");
const mongoose = require("mongoose");
const CustomError = require("../../utils/CustomError");

const createPost = asyncHandler(async (req, res) => {
  // get the payload
  const { description } = req.body;

  const postCreated = await Post.create({
    description,
  });

  res.json({
    status: "success",
    message: "Post created successfully",
    data: postCreated,
  });
});

const getAllPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, cursor } = req.query;
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  let query = {};
  let posts;
  let totalPosts;

  // If cursor is provided, use cursor-based pagination
  if (cursor) {
    query = { _id: { $lt: cursor } };
  }

  // Fetch one extra post to determine if there are more
  posts = await Post.find(query)
    .sort({ _id: -1 })
    .limit(limitNumber + 1);

  // Check if there are more posts
  const hasMore = posts.length > limitNumber;
  // Remove the extra post from response
  posts = posts.slice(0, limitNumber);

  // Get the next cursor
  const nextCursor = posts.length > 0 ? posts[posts.length - 1]._id : null;

  // Only get total counts for page-based pagination
  if (!cursor) {
    totalPosts = await Post.countDocuments();
  }

  res.json({
    status: "success",
    message: "Posts fetched successfully",
    data: {
      posts,
      pagination: {
        nextCursor, // Always include nextCursor
        hasMore,
        ...(cursor
          ? {} // Cursor-based pagination only needs nextCursor and hasMore
          : {
              // Page-based pagination includes additional info
              currentPage: pageNumber,
              totalPages: Math.ceil(totalPosts / limitNumber),
              totalPosts,
            }),
      },
    },
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
