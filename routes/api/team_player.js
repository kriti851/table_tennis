var express = require("express");

const TeamplayerController = require("../../controllers/api/TeamplayerController");

var router = express.Router();

router.post("/add", TeamplayerController.addplayer);

module.exports = router;