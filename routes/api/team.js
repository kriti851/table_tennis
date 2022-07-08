var express = require("express");

const TeamController = require("../../controllers/api/TeamController");

var router = express.Router();

router.post("/add", TeamController.add);
//router.get("/list", TeamController.playerlist);
router.get("/teamlist", TeamController.teamlist);
// router.get("/detail", TeamController.list);
// router.get("/mange_list", mange_traingController.trainig_list);
// router.post("/update", mange_traingController.update);
// router.delete("/delete",mange_traingController.delete);



module.exports = router;