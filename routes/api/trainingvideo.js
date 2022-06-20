var express = require("express");
const TrainingvideoController = require("../../controllers/api/TrainingvideoController");

var router = express.Router();
router.post("/trainingvideo", TrainingvideoController.Trainingvideo);
router.post("/deletevideo", TrainingvideoController.deleteVideo);
// router.post("/training_list", Training_mangeController.training_list);
// router.post("/training_update", Training_mangeController.training_update);
// router.delete("/training_delete", Training_mangeController.delete);

module.exports = router;