
const express = require("express");
const Post = require("./models/post/post");
const connectDb = require("./utils/connectDb");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

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

// ! Create Post
app.post("/api/v1/posts/create", async (req, res) => {
  try {
    // get the payload
    const { title, description } = req.body;
    const postCreated = await Post.create({
      title,
      description,
    });

    res.json({
      status: "success",
      message: "Post created successfully",
      data: postCreated,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});
// ! List Posts
app.get("/api/v1/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json({
      status: "success",
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});
// ! Update Post
app.put("/api/v1/posts/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, description } = req.body;

    // Check if postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid post ID format",
      });
    }

    // find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        status: "error",
        message: "Post not found",
      });
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
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});
// ! get Post
app.get("/api/v1/posts/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid post ID format",
      });
    }

    // find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        status: "error",
        message: "Post not found",
      });
    }

    res.json({
      status: "success",
      message: "Post fetched successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});
// ! delete Post
app.delete("/api/v1/posts/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid post ID format",
      });
    }

    // find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        status: "error",
        message: "Post not found",
      });
    }

    // delete the post
    const deletedPost = await Post.findByIdAndDelete(postId);

    res.json({
      status: "success",
      message: "Post deleted successfully",
      data: deletedPost,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

//! Start Server

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
