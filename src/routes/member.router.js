const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');

const memberController = require("../controllers/member.controller.js");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/profile')); 
  },
  filename: function (req, file, cb) {
    // cb(null, req.session.uid + path.extname(file.originalname));
    console.log(req.session.uid)
    cb(null, req.session.uid+".jpeg");

  }
});

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/profile')); 
  },
  filename: function (req, file, cb) {
    cb(null, req.user.member_ID+".jpeg");

  }
});

const upload = multer({ storage: storage });
const upload2 = multer({ storage: storage2 });

// Get all members
router.get("/", memberController.getMembers);

router.get("/register", memberController.resgister)
// Add member to database
router.post("/register", upload.single('profile'), memberController.addMember);

// Get member 
router.get("/:id", memberController.getMember);


router.get("/:id/edit", memberController.getUpdate);
// edit member
router.post("/:id/edit", upload2.single('profile'), memberController.updateMember);

router.get("/:id/pic", memberController.getPics);
module.exports = router;
