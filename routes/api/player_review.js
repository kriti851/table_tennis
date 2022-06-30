var express = require("express");
const ReviewController = require("../../controllers/api/ReviewController");

var router = express.Router();
router.post("/addplayerreview", ReviewController.review);
router.post("/get-playerreview", ReviewController.GetPlayerReviews);
router.post("/addcoachreview", ReviewController.addcoach_review);
router.post("/get-coachreview", ReviewController.GetcoachReviews);

module.exports = router;