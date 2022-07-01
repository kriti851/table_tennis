var express = require("express");
const CoachplayerchatController = require("../../controllers/api/CoachplayerchatController");
const UsercoachController = require("../../controllers/api/UsercoachController");

var router = express.Router();
router.post("/playersendmessage", CoachplayerchatController.playersendmessage);
router.get("/getplayermessagelist", CoachplayerchatController.GetplayerChatlist);
router.post("/coachsendmessage", CoachplayerchatController.coachsendmessage);
router.get("/getcoachmessagelist", CoachplayerchatController.GetcoachChatlist);
router.post("/getmessage", CoachplayerchatController.getchat);

///player user routes

router.post("/Usersendmessagetocoach", UsercoachController.Usersendmessagetocoach);
router.post("/coachsendmessagetouser", UsercoachController.Coachsendmessagetouser);


module.exports = router;