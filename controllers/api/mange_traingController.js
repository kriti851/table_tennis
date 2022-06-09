const manage_trainingModel = require("../../models/manage_training");
const { body, validationResult } = require("express-validator");
const apiResponse = require("../../helpers/apiResponse");
const auth = require("../../middlewares/jwt");
require("dotenv").config();

//Add manage traning
exports.manage_training = [
    auth,
    body("racket")
     .isLength({ min: 1 })
     .trim().withMessage("racket is required"),
    body("ball")
     .isLength({ min: 1 })
     .trim()
     .withMessage("ball is required"),
    body("person_position")
     .isLength({ min: 1 })
     .trim()
     .withMessage("Person position is required"),
    body("foot_position")
     .isLength({ min: 1 })
     .trim()
     .withMessage("Foot position is required"),
    body("head_position")
     .isLength({ min: 1 })
     .trim()
     .withMessage("Head position is required"),
    body("hand_position")
     .isLength({ min: 1 })
     .trim()
     .withMessage("Hand position is required"),
    body("arm_position")
     .isLength({ min: 1 })
     .trim()
     .withMessage("Arm Position is required"),
    body("wrist_movements")
     .isLength({ min: 1 })
     .trim()
     .withMessage("wrist movement is required"),
  async (req, res) => {
    var errors = validationResult(req);
    if (errors.isEmpty()) {
      try {
        const player_info = {
          user_id: req.user.id,
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
exports.trainig_list = [
  auth,
  async (req, res) => {
    console.log(req);
    try {
      let training_Data = await manage_trainingModel.findAll({});
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

exports.update = [
  auth,
  body("id").isLength({ min: 1 }).trim().withMessage("id is required"),
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
          "No information  found by this user",
          user
        );
      }
      return apiResponse.successResponseWithData(
        res,
        "information updated sucessfully",
        user
      );
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
exports.delete = [
  auth,
  body("id").isLength({ min: 1 }).trim().withMessage("id is required"),
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
        "Training information  deleted sucessfully"
      );
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
