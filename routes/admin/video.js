var express = require("express");
const VideoController = require("../../controllers/admin/VideoController");

var router = express.Router();
router.post("/uploadvideo", VideoController.uploadvideo);
router.post("/list", VideoController.list);
router.get("/user-info", VideoController.info_user);
router.post("/update", VideoController.update);
router.post("/disableupdate", VideoController.Disable_update);
router.post("/deletevideo", VideoController.deleteVideo);
// router.post("/training_list", Training_mangeController.training_list);
// router.post("/training_update", Training_mangeController.training_update);
// router.delete("/training_delete", Training_mangeController.delete);

module.exports = router;