var express = require("express");

const player_videoController = require("../../controllers/api/player_videoController");
var router = express.Router();
router.post("/player_video", player_videoController.player_video);
router.get("/player_wholelist", player_videoController.plyer_wholelist);
router.get("/player_list", player_videoController.plyerlist);
router.post("/update", player_videoController.update);
router.delete("/playervideo_delete",player_videoController.delete);

module.exports = router;


