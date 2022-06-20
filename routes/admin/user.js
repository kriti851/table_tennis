var express = require("express");
const UserController = require("../../controllers/admin/UserController");

var router = express.Router();
router.post("/list/", UserController.list);
router.post("/list_history", UserController.list_data);
router.post("/updates_data", UserController.update_user);
router.get("/traing_playerlist", UserController.playerlist);

module.exports = router;