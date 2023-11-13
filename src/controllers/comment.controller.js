const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const crypto = require("crypto");

// require models
const Comment = require("../models/comment.model");

const getPostComments = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  try {
    const postID = req.params.id;
    const comments = await Comment.findByPostId(postID);
    if (comments) {
      res.status(200).json({
        statusCode: 200,
        statusMessage: "Ok",
        message: "Successfully retrieved comments.",
        data: comments,
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        statusMessage: "Not Found",
        message: "Comments not found.",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: null, data: null });
  }
}

const addComment = [
  body("content")
    .trim()
    .isLength({ min: 1 }).withMessage("username must be atleast 1 characters").escape()
    .escape(),

  asyncHandler(async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.redirect("/login");
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const commentID = crypto.randomUUID();
    try {
      const memberID = req.user.member_ID;
      const postID = req.params.id;
      const { content } = req.body;
      const comment = new Comment(commentID, memberID, postID, content);
      await comment.save();
      return res.redirect("back"); 
    } catch (err) {
      console.log(err);
      res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: null, data: null });
    }
  })
]

module.exports = {
  getPostComments,
  addComment
}