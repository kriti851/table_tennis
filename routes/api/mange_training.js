var express = require("express");

const mange_traingController = require("../../controllers/api/mange_traingController");
var router = express.Router();

router.post("/manage_training", mange_traingController.manage_training);
router.get("/mange_list", mange_traingController.trainig_list);
router.post("/update", mange_traingController.update);
router.delete("/delete",mange_traingController.delete);

module.exports = router;
