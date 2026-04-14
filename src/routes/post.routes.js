const express = require("express");
const { createPost, getAllPosts, getUserPosts, toggleLikePost, addComment } = require("../controller/post.controller");
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../config/upload.config");

const router = express.Router();

router.post("/create", authMiddleware, upload.single("image"), createPost);
router.get("/", getAllPosts);
router.get("/user/:username", getUserPosts);
router.post("/:id/like", authMiddleware, toggleLikePost);
router.post("/:id/comment", authMiddleware, addComment);

module.exports = router;
