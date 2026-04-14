const postModel = require("../models/post.model");
const userModel = require("../models/user.model");

async function createPost(req, res, next) {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: "Post text is required" });
    }

    const post = await postModel.create({
      text,
      author: req.user._id,
    });

    return res.status(201).json({ success: true, message: "Post created successfully", post });
  } catch (error) {
    next(error);
  }
}

async function getAllPosts(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const posts = await postModel.find()
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({ success: true, count: posts.length, page, posts });
  } catch (error) {
    next(error);
  }
}

async function getUserPosts(req, res, next) {
  try {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const user = await userModel.findOne({ username });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const posts = await postModel.find({ author: user._id })
      .populate("author", "username bio")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({ success: true, count: posts.length, page, posts });
  } catch (error) {
    next(error);
  }
}

module.exports = { createPost, getAllPosts, getUserPosts };
