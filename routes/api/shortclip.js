var express = require("express");
const TrainingvideoController = require("../../controllers/api/ShortclipController");

var router = express.Router();
router.post("/uploadvideo", TrainingvideoController.uploadvideo);
router.post("/list", TrainingvideoController.list);
router.post("/deletevideo", TrainingvideoController.deleteVideo);

module.exports = router;
