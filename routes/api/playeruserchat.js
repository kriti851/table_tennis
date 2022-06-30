var express = require("express");
const PlayeruserController = require("../../controllers/api/PlayeruserController");
var router = express.Router();
router.post("/sendmessage", PlayeruserController.sendmessage);
router.post("/usersendmessage", PlayeruserController.usersendmessage);
module.exports = router;