const express = require("express");
const router = express.Router();

// require controller
const loginController = require("../controllers/login.controller");
router.get("/", loginController.getLogin)
router.post("/", loginController.postLogin);
router.get("/auth", loginController.checkAuth);
module.exports = router;