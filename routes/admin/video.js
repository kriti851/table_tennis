var express = require("express");
const ShortclipController = require("../../controllers/admin/ShortclipController");
var router = express.Router();
// router.post("/uploadvideo", ShortclipController.uploadvideo);
router.post("/list", ShortclipController.list);
router.post("/list_history", ShortclipController.list_history);
router.get("/user-info", ShortclipController.info_user);
router.post("/update", ShortclipController.update);
router.post("/disableupdate", ShortclipController.Disable_update);
router.post("/disablevideolist", ShortclipController.disablelist);
router.post("/approvevideolist", ShortclipController.approvelist);
router.post("/deletevideo", ShortclipController.deleteVideo);


module.exports = router;