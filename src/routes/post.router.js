const express = require("express");
const router = express.Router();

// require controller
const postController = require("../controllers/post.controller");
const commentController = require("../controllers/comment.controller");

// get all posts
router.get("/", postController.getPosts);

// get post
router.get("/:id", postController.getPost);

// add post
router.post("/new", postController.addPost);

router.post("/:id/delete", postController.deletePost);

module.exports = router;