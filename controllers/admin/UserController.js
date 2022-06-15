const UserModel = require("../../models/user");
const sequelize = require("../../config/db");
const { body, validationResult, check } = require("express-validator");
const { Op } = require("sequelize");
const apiResponse = require("../../helpers/apiResponse");
const bcrypt = require("bcrypt");
const auth = require("../../middlewares/jwt");
require("dotenv").config();

// List of User/Coach/Player
exports.list = [
  auth,
  async (req, res) => {
    try {
      var limit = 5;
      var offest = 0;
      if (typeof req.query.page != "undefined" && req.query.page > 1) {
        offest = (req.query.page - 1) * limit;
      }
      var sort = "id";
      var sortDirection = "desc";
      if (typeof req.query.sort != "undefined" && req.query.sort != "") {
        sort = req.query.sort;
        sortDirection = req.query.sortDirection;
      }
      var search = {};
      if (typeof req.query.q != "undefined" && req.query.q != "") {
        var q = req.query.q;
        //q=q.replace(/'/g,"");
        search[Op.or] = {
          name: { [Op.substring]: q.trim() },
          email: { [Op.substring]: q.trim() },
        };
      }
      const { count, rows: user } = await UserModel.findAndCountAll({
        attributes: [
          "id",
          "name",
          "user_type",
          "username",
          "phone",
          "mobileNumber",
          "plying_style",
          "email",
          "gender",
          "dob",
          "career",
          "hand",
          "phone",
          "favorite_serve",
          "awards",
          "club",
          "location",
          "street_address1",
          "latitude",
          "nationality",
          "team",
          "latitude",
          "longitude",
          "expiry_month",
          "expiry_year",
          "createdat",
          "updatedat",
          [
            sequelize.literal(
              "IF(image!='',CONCAT('" +
                process.env.IMAGEURL +
                "public/uploads/" +
                "',image),'" +
                process.env.IMAGEURL +
                "public/uploads/default.png')"
            ),
            "image",
          ],
        ],
        where: {
          user_type: req.body.user_type,
          ...search,
        },
        limit: [offest, limit],
      });
      let next_page = false;
      if (offest + limit < count) {
        next_page = true;
      }
      var { user_type } = req.body;
      if ("coach" == user_type) {
        return apiResponse.successResponseWithData(
          res,
          "Successfully retrieve information of coach",
          { user, count, next_page }
        );
      } else if ("player" == user_type) {
        return apiResponse.successResponseWithData(
          res,
          "Successfully retrieve information of player",
          { user, count, next_page }
        );
      } else {
        return apiResponse.successResponseWithData(
          res,
          "Successfully retrieve information of user",
          { user, count, next_page }
        );
      }
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

//Data of Particluar Id
exports.list_data = [
  auth,
  async (req, res) => {
    try {
      const user = await UserModel.findAll({
        attributes: { exclude: ["password", "confirmpassword"] },
        attributes: [
          "id",
          "name",
          "user_type",
          "username",
          "phone",
          "mobileNumber",
          "plying_style",
          "email",
          "gender",
          "dob",
          "career",
          "hand",
          "phone",
          "favorite_serve",
          "awards",
          "club",
          "location",
          "street_address1",
          "latitude",
          "nationality",
          "team",
          "latitude",
          "longitude",
          "expiry_month",
          "expiry_year",
          "createdat",
          "updatedat",
          [
            sequelize.literal(
              "IF(image!='',CONCAT('" +
                process.env.IMAGEURL +
                "public/uploads/" +
                "',image),'" +
                process.env.IMAGEURL +
                "public/uploads/default.png')"
            ),
            "image",
          ],
        ],
        where: {
          [Op.and]: [{ user_type: req.body.user_type }, { id: req.body.id }],
        },
      });
      if (!user.length) {
        return apiResponse.ErrorResponse(res, "Something went wrong", user);
      }
      var { user_type } = req.body;
      if ("coach" == user_type) {
        // user.image=process.env.IMAGEURL+'public/uploads/'+user.image;
        return apiResponse.successResponseWithData(
          res,
          "Successfully retrieve information of coach",
          user
        );
      } else if ("player" == user_type) {
        return apiResponse.successResponseWithData(
          res,
          "Successfully retrieve information of player",
          user
        );
      } else {
        return apiResponse.successResponseWithData(
          res,
          "Successfully retrieve information of user",
          user
        );
      }
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

//Update Details
exports.update_user = [
  auth,
  // profileUpload.single('image'),
  body("id").isLength({ min: 1 }).trim().withMessage("id is required"),
  async (req, res) => {
    var body = req.body;
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiResponse.validationErrorWithData(
        res,
        "Validation Error.",
        errors.array()
      );
    }
    var set_data = {
      name: body.name,
      username: body.username,
      mobileNumber: body.mobileNumber,
      email: body.email,
      dob: body.dob,
      gender: req.body.gender,
      user_type: req.body.user_type,
      hand: body.hand,
      phone: body.phone,
      plying_style: body.plying_style,
      favorite_serve: body.favorite_serve,
      grip: body.grip,
      height: body.height,
      location: body.location,
      street_address1: body.street_address1,
      street_address2: body.street_address2,
      team: body.team,
      club: body.club,
      awards: body.awards,
      zip_code: body.zip_code,
      // "cvc_no": body.cvc_no,
      // "card_no": body.card_no,
      // "expiry_month": body.expiry_month,
      // "expiry_year": body.expiry_year
    };
    try {
      await UserModel.update(set_data, { where: { id: req.body.id } });
      var user = await UserModel.findOne({
        where: { id: req.body.id },
      });
      if (!user) {
        return apiResponse.ErrorResponse(
          res,
          "No information found by this user",
          user
        );
      }
      return apiResponse.successResponseWithData(
        res,
        "Information updated successfully",
        user
      );
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

exports.playerlist = [
  auth,
  async (req, res) => {
    try {
      const user = await UserModel.findAll({
        offset: 0,
        limit: 3,
        attributes: { exclude: ["password", "confirmpassword"] },
        where: { user_type: "player" },
      });
      if (!user.length) {
        return apiResponse.ErrorResponse(res, "Something went wrong");
      }
      return apiResponse.successResponseWithData(
        res,
        "Successfully retrieve information of player",
        user
      );
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
