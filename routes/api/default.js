var express = require("express");
const DefaultController = require("../../controllers/api/DefaultController");

var router = express.Router();


router.get('/countries',DefaultController.GetCountry);

module.exports = router;