var express = require("express");
const ArticleController = require("../../controllers/api/ArticleController");

var router = express.Router();
router.post("/list", ArticleController.list);


module.exports = router;