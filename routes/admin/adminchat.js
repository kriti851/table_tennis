var express = require("express");
const AdminplayerController = require("../../controllers/admin/AdminplayerController");

var router = express.Router();

router.post("/adminsendmessage", AdminplayerController.sendmessage);


module.exports = router;