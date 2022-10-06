var express = require("express");
const ActivitiesController = require("../../controllers/api/ActivitiesController");

var router = express.Router();
router.post("/addActivities", ActivitiesController.addACtivity);

router.get("/countActivities", ActivitiesController.countActivity);
router.get("/getActivities", ActivitiesController.getactivies);


module.exports = router;