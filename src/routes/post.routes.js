const express = require("express");
const { createPost, getAllPosts } = require("../controller/post.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/create", authMiddleware, createPost);
router.get("/", getAllPosts);

module.exports = router;
