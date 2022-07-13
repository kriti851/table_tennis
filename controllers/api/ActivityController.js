const lactivityModel = require("../../models/activity");
const { body,validationResult,Check } = require("express-validator");
const sequelize = require("../../config/db");
const { Op } = require("sequelize");
const apiResponse = require("../../helpers/apiResponse");
const auth = require("../../middlewares/jwt");
const { ErrorResponse } = require("../../helpers/apiResponse");

//Add Language
exports.addactivity = [
    auth,
    body("activity_name")
       .trim()
       .notEmpty()
       .withMessage("Activity Name must not be empty"),
    body("duration")
        .trim()
        .notEmpty()
        .withMessage("Duration must not be empty"),
   
    body("activity_name").escape(),
    body("duration").escape(),
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
            let info={
                activity_name:req.body.activity_name,
                duration:req.body.duration,
            };
            console.log(info);
            const act = await activityModel.create(info);
            return apiResponse.successResponseWithData(
                res,
                "Activity added successfully",
                 info
            );

        }catch (err) {
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
          }
    },         
];