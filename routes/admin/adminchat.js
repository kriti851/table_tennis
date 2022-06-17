var express = require("express");
const PlayeradminchatController = require("../../controllers/api/PlayeradminchatController");

var router = express.Router();

router.post("/adminsendmessage", PlayeradminchatController.sendmessage);


module.exports = router;