var express = require("express");
const TrainingvideoController = require("../../controllers/api/TrainingvideoController");
const practisingvideo = require("../../models/practisingvideo");
var router = express.Router();
router.post("/upload", TrainingvideoController.trainingvideo);
router.get("/list", TrainingvideoController.list);
// router.get("/player_wholelist", player_videoController.plyer_wholelist);
// router.get("/player_list", player_videoController.plyerlist);
// router.post("/player_listbyid", player_videoController.plyerlist_id);
// router.post("/update", player_videoController.update);
// router.delete("/playervideo_delete",player_videoController.delete);

module.exports = router;



