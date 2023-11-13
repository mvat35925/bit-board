const express = require("express");

const router = express.Router();

const tagController = require("../controllers/tag.controller");

// Get all tags
router.get("/", tagController.getTags);

// Get tag
router.get("/:id", tagController.getTag);

module.exports = router;