var express = require("express");
const { list } = require("../../controllers/admin/UserController");
const Training_mangeController = require("../../controllers/api/Training_mangeController");

var router = express.Router();
router.post("/training_manage", Training_mangeController.manage_training);
router.post("/training_list", Training_mangeController.training_list);
router.post("/training_update", Training_mangeController.training_update);
router.delete("/training_delete", Training_mangeController.delete);

module.exports = router;

