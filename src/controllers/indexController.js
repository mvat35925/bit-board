const asyncHandler = require("express-async-handler");

// require models
const Post = require('../models/post.model');

const getIndex = asyncHandler(async (req, res, next) => {
  try {
    const posts = await Post.find();
    function mapTags(posts) {
      // Map through each post
      return posts.map(post => {
        // Split the tag_IDs and tag_names into arrays if they are not null
        const tagIDs = post.tag_IDs ? post.tag_IDs.split(',') : [];
        const tagNames = post.tag_names ? post.tag_names.split(',') : [];

        // Create an array of tag objects with id and name
        const tags = tagIDs.map((id, index) => {
          return { id: id, name: tagNames[index] || '' };
        });

        // Return the post with a new tags field that combines the ID and name
        return { ...post, tags: tags };
      });
    }
    const postsWithTags = mapTags(posts);

    res.render("index", {
      posts: postsWithTags
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: null, data: null });
  }
})

module.exports = {
  getIndex
}