var express = require("express");
const CoachplayerchatController = require("../../controllers/api/CoachplayerchatController");

var router = express.Router();

router.post("/playersendmessage", CoachplayerchatController.sendmessage);

router.post("/coachsendmessage", CoachplayerchatController.coachsendmessage);
router.post("/recentmessage", CoachplayerchatController.recentChat);




module.exports = router;