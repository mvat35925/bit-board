const express = require("express");
const router = express.Router({ mergeParams: true });

// require controller
const commentController = require("../controllers/comment.controller");

// get post comments
router.get("/", commentController.getPostComments);

// add comment to post
router.post("/", commentController.addComment);

module.exports = router;