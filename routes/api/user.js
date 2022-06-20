var express = require("express");
const UserController = require("../../controllers/api/UserController");
var router = express.Router();

// router.get("/detail", UserController.detail);
router.post("/update", UserController.update);
router.post("/change-password", UserController.changePassword);
// router.post("/upload-image", UserController.uploadImage)
router.post("/update-image", UserController.updateImage);

module.exports = router;