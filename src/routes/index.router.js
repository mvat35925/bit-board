var express = require('express');
var router = express.Router();

// require controllers
const indexController = require("../controllers/indexController"); 

/* GET home page. */
router.get('/', indexController.getIndex); 



module.exports = router;
