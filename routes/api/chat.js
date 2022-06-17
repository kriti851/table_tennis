var express = require("express");
const PlayeradminchatController = require("../../controllers/api/PlayeradminchatController");

var router = express.Router();

router.post("/playersendmessage", PlayeradminchatController.sendmessage);


module.exports = router;