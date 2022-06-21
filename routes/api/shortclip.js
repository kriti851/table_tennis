var express = require("express");
const TrainingvideoController = require("../../controllers/api/ShortclipController");

var router = express.Router();
router.post("/uploadvideo", TrainingvideoController.Trainingvideo);
router.post("/list", TrainingvideoController.list);
router.post("/deletevideo", TrainingvideoController.deleteVideo);

module.exports = router;
