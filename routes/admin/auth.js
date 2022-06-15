var express = require("express");
const AuthController = require("../../controllers/admin/AuthController");
var router = express.Router();

router.post("/login", AuthController.login);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/verify-otp", AuthController.verifyOtp);
router.post("/reset-password", AuthController.resetPassword);
// router.post("/list", AuthController.role_list);

module.exports = router;