const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const Tag = require("../models/tag.model");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const crypto = require("crypto");

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();

    if (posts.length > 0) {
      res.status(200).json({
        statusCode: 200,
        statusMessage: "Ok",
        message: "Successfully retrieved all posts.",
        data: posts,
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        statusMessage: "Not Found",
        message: "Posts not found.",
      });
    }

  } catch (err) {
    console.log(err);
    res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: null, data: null });
  }
}

const getPost = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  const id = req.params.id;
  try {
    const post = await Post.findByID(id);
    const comments = await Comment.findByPostId(id);
    console.log(comments);
    if (post) {
      res.render("post", { post, comments})
    } else {
      res.status(404).json({
        statusCode: 404,
        statusMessage: "Not Found",
        message: "Post not found.",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: null, data: null });
  }
}

const addPost = [
  body("title")
    .trim()
    .isLength({ min: 1 }).withMessage("username must be atleast 1 characters").escape(),
  body("content")
    .trim()
    .isLength({ min: 1 }).withMessage("password must be atleast 1 characters")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const tags = req.body["tags[]"];
    if (!req.isAuthenticated()) {
      return res.redirect("/login");
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    const postID = crypto.randomUUID();
    try {

      const memberID = req.user.member_ID
      const { title, content } = req.body;
      const post = new Post(postID, title, memberID, content);
      await post.save();
      if (tags) {
        const tagsArray = Array.isArray(tags) ? tags : [tags];

        tagsArray.forEach((value) => {
          Tag.addTagToPost(postID, value);
        });
      }
      res.redirect("/");
    } catch (err) {
      console.log(err);
      res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: null, data: null });
    }
  })
]

const deletePost = async (req, res, next) => {
  const id = req.params.id;
  try {
    await Post.findByIdandDelete(id);
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: null, data: null });
  }
}

module.exports = {
  getPosts,
  getPost,
  addPost,
  deletePost
}