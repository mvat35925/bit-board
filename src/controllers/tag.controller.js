const Tag = require("../models/tag.model");

const getTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    if (tags.length > 0) {
      res.status(200).json({
        statusCode: 200,
        statusMessage: "Ok",
        message: "Successfully retrieved all tags.",
        data: tags,
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        statusMessage: "Not Found",
        message: "tags not found.",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: null, data: null });
  }
}

const getTag = async (req, res) => {
  // change id of tag here
  const id = req.params.id;
  try {
    const posts = await Tag.getPostByTagID(id);
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
    res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: null, data: null });
  }
};

module.exports = {
  getTags,
  getTag,
}