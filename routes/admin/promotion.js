var express = require("express");
const PromotionvideoController = require("../../controllers/admin/PromotionvideoController");
var router = express.Router();
router.post("/uploadvideo", PromotionvideoController.uploadvideo);
router.get("/list", PromotionvideoController.list);
router.post("/list_history", PromotionvideoController.list_history);
router.post("/update", PromotionvideoController.update );
router.post("/delete", PromotionvideoController.deleteVideo );


module.exports = router;