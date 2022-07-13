var express = require("express");
const TrainingvideoController = require("../../controllers/api/TrainingvideoController");
var router = express.Router();
router.post("/upload", TrainingvideoController.trainingvideo);
router.post("/trainingvideolist", TrainingvideoController.list);
router.post("/updatetrainingvideo", TrainingvideoController.update);
router.post("/deletetrainingvideo", TrainingvideoController.deleteVideo);

module.exports = router;

