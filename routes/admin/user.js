var express = require("express");
const UserController = require("../../controllers/admin/UserController");

var router = express.Router();
router.post("/list/", UserController.list);

router.post("/list_history", UserController.list_data);

router.post("/updates_userdetail", UserController.update_user);

module.exports = router;