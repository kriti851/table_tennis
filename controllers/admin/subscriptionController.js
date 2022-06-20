const subscriptionModel = require("../../models/subscription");
const { body, validationResult, check } = require("express-validator");
const apiResponse = require("../../helpers/apiResponse");
const auth = require("../../middlewares/jwt");
const { Op } = require("sequelize");
require("dotenv").config();

//Add Subscription Plans By admin
exports.subscription = [
  auth,
  check("title")
    .trim()
    .isAlpha()
    .withMessage("Must be only alphabetical chars"),
  body("duration")
    .trim()
    .isLength({ min: 1 })
    .withMessage("select one of the subscription plan"),
  check("price")
    .trim()
    .isNumeric()
    .isLength({ min: 0, max: 6 })
    .withMessage("price is required for subscription plan."),
  body("title").escape(),
  body("duration").escape(),
  body("price").escape(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      }
      let sub_info = {
        title: req.body.title,
        duration: req.body.duration,
        price: req.body.price,
        // sub_startdate: req.body.sub_startdate,
        // sub_expirydate: req.body.sub_expirydate,
        // sub_startdate: createdAt.toLocaleString(undefined, {timeZone: 'Asia/Kolkata'}),
        // sub_expirydate: moment(sub_startdate).add(30,'days').format('YYYY-MM-DD hh:mm:ss A')
      };
      console.log(sub_info);
      const subPlan = await subscriptionModel.create(sub_info);
      return apiResponse.successResponseWithData(
        res,
        "plan added sucessfully",
        subPlan
      );
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

exports.subscription_id = [
  auth,
  async (req, res) => {
    try {
      let sub_id = await subscriptionModel.findAll({
        where: { id: req.body.id },
      });
      if (!sub_id.length > 0) {
        return apiResponse.successResponseWithData(
          res,
          "user did not subscribe yet",
          sub_id
        );
      }
      return apiResponse.successResponseWithData(
        res,
        "Information retrive sucessfully",
        sub_id
      );
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

//Subscription List of All Plans
exports.subscription_list = [
  auth,
  async (req, res) => {
    try {
      let sub_list = await subscriptionModel.findAll({});
      if (!sub_list.length > 0) {
        return apiResponse.successResponseWithData(
          res,
          "user did not subscribe yet",
          sub_list
        );
      }
      return apiResponse.successResponseWithData(
        res,
        "Information retrive sucessfully",
        sub_list
      );
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

//Update Subscription Plans by Admin
exports.subscription_data = [
  auth,
  body("id").trim().isLength({ min: 1 }).withMessage("id is required"),
  async (req, res) => {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiResponse.validationErrorWithData(
        res,
        "Validation Error.",
        errors.array()
      );
    }
    var set_data = {
      price: req.body.price,
      duration: req.body.duration,
      title: req.body.title,
    };
    try {
      await subscriptionModel.update(set_data, { where: { id: req.body.id } });
      var user = await subscriptionModel.findOne({
        where: { id: req.body.id },
      });
      if (!user) {
        return apiResponse.ErrorResponse(
          res,
          "No Data found",
          user
        );
      }
      return apiResponse.successResponseWithData(
        res,
        "subscription plan updated sucessfully",
        user
      );
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

//Delete Subscription Plans By Admin
exports.delete = [
  auth,
  body("id").trim().isLength({ min: 1 }).withMessage("id is required"),
  async (req, res) => {
    try {
      //  const articleImage = await ArticleModel.findOne({attributes:['image'],where:{id:req.body.id}});
      const subscription = await subscriptionModel.destroy({
        where: { id: req.body.id },
      });
      if (!subscription) {
        return apiResponse.successResponseWithData(
          res,
          "No Data found",
          subscription
        );
      }
      return apiResponse.successResponseWithData(
        res,
        "Subscription plan  deleted sucessfully",
        subscription
      );
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
