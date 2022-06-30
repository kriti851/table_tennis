var express = require("express");
const LanguageController = require("../../controllers/api/LanguageController");

var router = express.Router();
router.post("/add", LanguageController.addlanguage);
router.get("/list", LanguageController.languages);

module.exports = router;