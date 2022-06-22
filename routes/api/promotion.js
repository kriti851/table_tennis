var express = require("express");
const PromotionvideoController = require("../../controllers/api/PromotionvideoController");
var router = express.Router();
router.get("/list", PromotionvideoController.list);

module.exports = router;