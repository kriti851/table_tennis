var express = require("express");
const PostController = require("../../controllers/api/PostController");
var router = express.Router();
router.post("/add", PostController.addpost);

module.exports = router;