const languageModel = require("../../models/language");
const { body,validationResult,Check } = require("express-validator");
const sequelize = require("../../config/db");
const { Op } = require("sequelize");
const apiResponse = require("../../helpers/apiResponse");
const auth = require("../../middlewares/jwt");
const { ErrorResponse } = require("../../helpers/apiResponse");

//Add Language
exports.addlanguage = [
    auth,
    body("langcode")
       .trim()
       .notEmpty()
       .withMessage("Langcode must not be empty"),
    body("en_name")
        .trim()
        .notEmpty()
        .withMessage("En_name must not be empty"),
    body("nativename")
        .trim()
        .notEmpty()
        .withMessage("Nativename must not be empty"),
    body("code")
        .trim()
        .notEmpty()
        .withMessage("Code must not be empty"),
    body("translated_word")
        .trim()
        .notEmpty()
        .withMessage("Translated word must not be empty"),
    body("langcode").escape(),
    body("en_name").escape(),
    body("nativename").escape(),
    body("code").escape(),
    body("translated_word").escape(),
    async(req, res) => {
        try{
            const errors = validationResult(req);
            console.log(errors);
            if(!errors.isEmpty()){
                return apiResponse.validationErrorWithData(
                res,
                "validation error",
                errors.array()
                );
            }
            let sub_info={
                langcode:req.body.langcode,
                en_name:req.body.en_name,
                nativename:req.body.nativename,
                code:req.body.code,
                translated_word:req.body.translated_word,
            };
            console.log(sub_info);
            const lang = await languageModel.create(sub_info);
            return apiResponse.successResponseWithData(
                res,
                "Language added successfully",
                sub_info
            );

        }catch (err) {
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
          }
    },         
];

exports.languages = [
    auth,
    async (req, res) => {
      console.log(req);
      try {
        let languages = await languageModel.findAll({
          //order: [["id", "desc"]],
        });
        // if (!languages.length > 0) {
        //   return apiResponse.successResponseWithData(
        //     res,
        //     "No information found by this user"
        //   );
        // }
        return apiResponse.successResponseWithData(
          res,
          "List of Languages",
          languages
        );
      } catch (err) {
        return apiResponse.ErrorResponse(res, err);
      }
    },
  ];


