const manage_trainingModel = require("../../models/manage_training");
const { body, validationResult } = require("express-validator");
const apiResponse = require("../../helpers/apiResponse");
const auth = require("../../middlewares/jwt");
require("dotenv").config();

//Add manage traning
exports.manage_training = [
    auth,
    body("racket")
     .trim(),
    //  .isLength({ min: 1 }),
    //  .withMessage("racket is required"),
    body("ball")
     .trim(),
    //  .isLength({ min: 1 }),
    //  .withMessage("ball is required"),
    body("person_position")
     .trim(),
    //  .isLength({ min: 1 })
    //  .withMessage("Person position is required"),
    body("foot_position")
     .trim(),
    //  .isLength({ min: 1 })
    //  .withMessage("Foot position is required"),
    body("head_position")
     .trim(),
    //  .isLength({ min: 1 })
    //  .withMessage("Head position is required"),
    body("hand_position")
     .trim(),
    //  .isLength({ min: 1 })     
    //  .withMessage("Hand position is required"),
    body("arm_position")
     .trim(),
    //  .isLength({ min: 1 })    
    //  .withMessage("Arm Position is required"),
    body("wrist_movements")
     .trim(),
    //  .isLength({ min: 1 })    
    //  .withMessage("wrist movement is required"),
  async (req, res) => {
    var errors = validationResult(req);
    if (errors.isEmpty()) {
      try {
        const player_info = {
          racket: req.body.racket,
          ball: req.body.ball,
          person_position: req.body.person_position,
          foot_position: req.body.foot_position,
          head_position: req.body.head_position,
          arm_position: req.body.arm_position,
          hand_position: req.body.hand_position,
          wrist_movements: req.body.wrist_movements,
        };
        const training_Data = await manage_trainingModel.create(player_info);
        return apiResponse.successResponseWithData(
          res,
          "Added Traning Details Successfully"
        );
      } catch (err) {
        console.log("asdfff", err);
        const errorInfo = {
          title: req.body,
          file: req.file,
        };
        return apiResponse.ErrorResponse(res, errorInfo);
      }
    } else {
      return apiResponse.validationErrorWithData(
        res,
        "Validation Error.",
        errors.array()
      );
    }
  },
];
//Player Traning List
exports.trainig_list = [
  auth,
  async (req, res) => {
    console.log(req);
    try {
    let training_Data = await manage_trainingModel.findAll({
        order: [ 
          [ 'id', 'desc' ] 
         ],  
      });    
    if (!training_Data.length > 0) {
        return apiResponse.successResponseWithData(
          res,
          "No information found by this user"
        );
      }
        return apiResponse.successResponseWithData(
        res,
        "List of training",
        training_Data
      );
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

//Update Player Traning Data
exports.update = [
  auth,
  body("id")
    .trim()
    .isLength({ min: 1 })  
    .withMessage("id is required"),
  async (req, res) => {
  var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiResponse.validationErrorWithData(
        res,
        "Validation Error.",
        errors.array()
      );
    }
    var setdata = {
      racket: req.body.racket,
      ball: req.body.ball,
      person_position: req.body.person_position,
      foot_position: req.body.foot_position,
      head_position: req.body.head_position,
      arm_position: req.body.arm_position,
      hand_position: req.body.hand_position,
      wrist_movements: req.body.wrist_movements,
    };
    try {
      await manage_trainingModel.update(setdata, {
        where: { id: req.body.id },
      });
      var user = await manage_trainingModel.findOne({
        where: { id: req.body.id },
      });
      if (!user) {
        return apiResponse.ErrorResponse(
          res,
          "No information Found by this user",
          user
        );
      }
      return apiResponse.successResponseWithData(
        res,
        "Information updated sucessfully",
        user
      );
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

//Delete Player Manage Traning Detail
exports.delete = [
   auth,
   body("id")
     .trim()
     .isLength({ min: 1 })
     .withMessage("id is required"),
   async (req, res) => {
   try {
        const taining_data = await manage_trainingModel.destroy({
        where: { id: req.body.id },
      });
    if (!taining_data) {
        return apiResponse.successResponseWithData(res, "No information exist");
      }
      return apiResponse.successResponseWithData(
        res,
        "Training information deleted sucessfully"
      );
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
