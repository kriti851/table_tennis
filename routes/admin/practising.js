var express = require("express");
const PractisingvideoController = require("../../controllers/admin/PractisingvideoController");

var router = express.Router();
router.post("/practising", PractisingvideoController.add );
// router.post("/practisinglist", PractisingvideoController.list);
// router.post("/update", ArticleController.update );

module.exports = router;