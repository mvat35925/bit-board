const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// require models
const Member = require("../models/member.model");
const Post = require("../models/post.model");
const resgister = async (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
  }
  res.render('register', { messages: req.flash() });
};

const getMembers = async (req, res) => {
  try {
    const members = await Member.find();

    if (members.length > 0) {
      res.status(200).json({
        statusCode: 200,
        statusMessage: "Ok",
        message: "Successfully retrieved all members.",
        data: members,
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        statusMessage: "Not Found",
        message: "Member not found.",
      });
    }

  } catch (err) {
    res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: null, data: null });
  }
}

const getMember = async (req, res) => {
  const id = req.params.id;
  try {
    const posts = await Post.findByMemberID(id);
    const memberProf = await Member.findById(id);
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
      posts: postsWithTags,
      member: memberProf
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: null, data: null });
  }
}


const addMember = [
  body("username")
    .trim()
    .isLength({ min: 5 }).withMessage("username must be atleast 5 characters")
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 5 }).withMessage("password must be atleast 5 characters")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const memberID = req.session.uid;
    const { username, password, short_info } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!memberID) {
      return res.status(400).send({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Invalid data',
        data: null,
      });
    }
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const member = new Member(memberID, username, hashedPassword, short_info);
      await member.save();
      res.redirect("/login");
    } catch (err) {
      console.log(err);
      res.render("register", { messages: err });
    }
  })
]

const getUpdate = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect("/login");
  } else {
    res.render("register")
  }
}

const updateMember = [
  body("username")
    .optional({ checkFalsy: true }) // This will accept an empty string as valid
    .trim()
    .isLength({ min: 5 }).withMessage("username must be atleast 5 characters")
    .escape(),
  body("password")
    .optional({ checkFalsy: true }) // This will accept an empty string as valids
    .trim()
    .isLength({ min: 5 }).withMessage("password must be atleast 5 characters")
    .escape(),
  body("short_info")
    .optional({ checkFalsy: true }) // This will accept an empty string as valid
    .trim()
    .isLength({ min: 1 }).withMessage("password must be atleast 1 characters")
    .escape(),
    asyncHandler(async (req, res, next) => {
      if (!req.isAuthenticated()) {
        res.redirect("/");
        return; // Make sure to return here so the rest of the function doesn't execute after redirect
      }
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const id = req.user.member_ID;
        const { username, password, short_info } = req.body;
        const memberData = await Member.findById(id);
        const updatedData = {
          username: username || memberData.username,
          shortInfo: short_info || memberData.shortInfo,
        };
  
        // Update password only if it is provided
        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          updatedData.password = hashedPassword;
        }
  
        // Apply the updates to the memberData
        Object.assign(memberData, updatedData);
  
        // Update the database entry for the member
        await Member.findByIdAndUpdate(id, updatedData); // Pass only the updatedData
  
        res.redirect("/"); // Specify the path to redirect after the operation
      } catch (err) {
        console.error(err);
        res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: null, data: null });
      }
    })
  ];
  
  

const getPics = async (req, res) => {
  const id = req.params.id;
  const member = await Member.findById(id);
  const url = member.pic;
  res.json({ path: url });
}
module.exports = {
  getMembers,
  getMember,
  addMember,
  updateMember,
  getPics,
  resgister,
  getUpdate
}
