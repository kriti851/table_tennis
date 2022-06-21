var express = require("express");
const ArticleController = require("../../controllers/admin/ArticleController");

var router = express.Router();
router.post("/add", ArticleController.add);
router.post("/list", ArticleController.list);
router.post("/listhistory", ArticleController.list_history);
router.post("/delete", ArticleController.delete );
router.post("/update", ArticleController.update );

module.exports = router;