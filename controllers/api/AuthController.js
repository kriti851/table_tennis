const UserModel = require("../../models/user");
const moment = require("moment");
const Password = require("node-php-password");
// const Confirmpassword = require('node-php-password');
const { body, validationResult, check } = require("express-validator");
var path = require("path");
const apiResponse = require("../../helpers/apiResponse");
const utility = require("../../helpers/utility");
const jwt = require("jsonwebtoken");
const mailer = require("../../helpers/mailer");
const { constants } = require("../../helpers/constants");
const { Op } = require("sequelize");
require("dotenv").config();
exports.register = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Name is Required")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Must be only alphabetical chars"),
  check("username")
    .trim()
    .notEmpty()
    .withMessage("Username is Required")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Must be only alphabetical chars"),
  body("gender")
    .trim()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Gender is required."),
  body("dob").trim().isLength({ min: 1 }).withMessage("DOB is required."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is Required")
    .isLength({ min: 1 })
    .withMessage("Email must be specified.")
    .isEmail()
    .withMessage("Email must be a valid email address.")
    .custom(async (value) => {
      const user = await UserModel.findOne({ where: { email: value } });
      if (user) {
        return Promise.reject("E-mail already in use");
      }
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password should not be empty")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
    })
    .withMessage("password must be strong."),
  body("confirmpassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match with password");
    }
    return true;
  }),
  body("nationality")
    .trim()
    .isAlpha()
    .withMessage("Nationality Must be only alphabetical chars")
    .custom((value, { req }) => {
      if (req.body.user_type == "player" && !value)
        throw new Error("Nationality is required");
      if (req.body.user_type == "coach" && !value)
        throw new Error("Nationality is required");
      if (req.body.user_type == "user" && !value)
        throw new Error("Nationality is required");
      return true;
    }),
  body("achievements").trim(),
  // .custom((value, { req }) => {
  //   if (req.body.user_type == "player" && !value)
  //     throw new Error("achievements is required");
  //   if (req.body.user_type == "coach" && !value)
  //     throw new Error("achievements is required");
  //   return true;
  // }),
  body("career").trim(),
  // .custom((value, { req }) => {
  //   if (req.body.user_type == "player" && !value)
  //     throw new Error("career is required");
  //   if (req.body.user_type == "coach" && !value)
  //     throw new Error("career is required");
  //   return true;
  // }),
  body("phone")
    .trim()
    .isNumeric()
    .withMessage("Phone Number Must be Numeric")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone Number Must be at least 10 Number")
    .custom((value, { req }) => {
      if (req.body.user_type == "coach" && !value)
        throw new Error("phone is required");
      if (req.body.user_type == "player" && !value)
        throw new Error("phone is required");
      if (req.body.user_type == "user" && !value)
        throw new Error("phone is required");
      return true;
    }),
  body("hand")
    .trim()
    // .isAlpha("en-US", { ignore: " " })
    // .withMessage("hand Must be only alphabetical chars")
    .custom((value, { req }) => {
      if (req.body.user_type == "player" && !value)
        throw new Error("hand is required");
      if (req.body.user_type == "coach" && !value)
        throw new Error("hand is required");
      return true;
    }),
  body("playing_style")
    .trim()
    // .isAlpha("en-US", { ignore: " " })
    // .withMessage("Playing style Must be in alphabetical chars")
    .custom((value, { req }) => {
      if (req.body.user_type == "player" && !value)
        throw new Error("playing style is required");
      if (req.body.user_type == "coach" && !value)
        throw new Error("playing style is required");
      return true;
    }),
  body("grip")
    .trim()
    // .isAlpha("en-US", { ignore: " " })
    // .withMessage("Grip Must be only alphabetical chars")
    .custom((value, { req }) => {
      if (req.body.user_type == "player" && !value)
        throw new Error("grip is required");
      if (req.body.user_type == "coach" && !value)
        throw new Error("grip is required");
      return true;
    }),
  //   body("height")
  //      .trim(),
  // .isNumeric()
  // .withMessage("Height must be numeric")
  // .custom((value, { req }) => {
  //   if (req.body.user_type == "player")
  //     throw new Error("height is required");
  //   if (req.body.user_type == "coach")
  //     throw new Error("height is required");
  //   return true;
  // }),
  body("team")
    .trim(),
    // .isAlpha("en-US", { ignore: " " })
    // .withMessage("Team Must be only alphabetical chars"),
    // .custom((value, { req }) => {
    //   if (req.body.user_type == "player" && !value)
    //     throw new Error("team is required");
    //   if (req.body.user_type == "coach" && !value)
    //     throw new Error("team is required");
    //   return true;
    // }),
  body("club").trim(),
  // .isAlphanumeric("en-US", { ignore: " " })
  // .withMessage("Club Must be only alphanumeric"),
  // .custom((value, { req }) => {
  //   if (req.body.user_type == "player" && !value)
  //     throw new Error("club is required");
  //   if (req.body.user_type == "coach" && !value)
  //     throw new Error("club is required");
  //   return true;
  // })
  body("favorite_serve")
    .trim()
    // .isAlpha("en-US", { ignore: " " })
    // .withMessage("favourite Serve Must be only Char")
    .custom((value, { req }) => {
      if (req.body.user_type == "player" && !value)
        throw new Error("favorite_serve is required");
      if (req.body.user_type == "coach" && !value)
        throw new Error("favorite_serve is required");
      return true;
    }),
  body("awards")
    .trim(),
  // .isAlpha("en-US", { ignore: " " })
  // .withMessage("Award Must be only Char"),
  // .custom((value, { req }) => {
  //   if (req.body.user_type == "player" && !value)
  //     throw new Error("Award is required");
  //   if (req.body.user_type == "coach" && !value)
  //     throw new Error("Award  is required");
  //   return true;
  // }),
  body("tournament_played")
     .trim(),
  body("street_address1")
    .trim()
    .custom((value, { req }) => {
      if (!value) {
        throw new Error('street_address1 is required"');
      }
      if (req.body.user_type == "player" && !value)
        throw new Error("street_address1  is required");
      if (req.body.user_type == "coach" && !value)
        throw new Error("street_address1 is required");
      if (req.body.user_type == "user" && !value)
        throw new Error("street_address1 is required");
      return true;
    }),
  body("street_address2")
    .trim(),
  body("zip_code")
    .trim()
    .isNumeric()
    .withMessage("Zip Code Must be only Numeric")
    .isLength({ min: 4, max: 6 })
    .withMessage("Zip Code Must Contain 5 Digits")
    .custom((value, { req }) => {
      if (!value) {
        throw new Error("zip_code is required");
      }
      if (req.body.user_type == "player" && !value)
        throw new Error("zip code  is required");
      if (req.body.user_type == "coach" && !value)
        throw new Error("zip code is required");
      if (req.body.user_type == "user" && !value)
        throw new Error("zip code is required");
      return true;
    }),

  // Sanitize fields.
  body("user_type").escape(),
  body("username").escape(),
  body("gender").escape(),
  body("dob").escape(),
  body("phone").escape(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          errors.array({ onlyFirstError: false })[0].msg
        );
      } else {
        // if (req.body.password) {
        //   // req.body.password = await bcrypt.hash(req.body.password, 10);
        //   req.body.password = Password.hash(req.body.password)
        // }
        // console.log(req.body.password)
        //  if (req.body.confirmpassword) {
        //   req.body.confirmpassword = Password.hash(
        //     req.body.confirmpassword,
        //   );
        // }

        if (req.body.password) {
          req.body.password = Password.hash(req.body.password);
        }

        if (req.body.confirmpassword) {
          req.body.confirmpassword = Password.hash(req.body.confirmpassword);
        }

        const result = await UserModel.create(req.body);
        if (!result) {
          return apiResponse.ErrorResponse(res, "Something went wrong");
        }
        const { email } = req.body;
        const user = await UserModel.findOne({ where: { email: email } });
        if (!user) {
          return apiResponse.ErrorResponse(res, "Something went wrong");
        }
        if ("coach" == req.body.user_type) {
          startdate = new Date();
          let userData = {
            name: user.name,
            username: user.username,
            user_type: user.user_type,
            phone: user.phone,
            email: user.email,
            street_address1: user.street_address1,
            street_address2: user.street_address2,
            zip_code: user.zip_code,
            location: user.location,
            dob: user.dob,
            gender: user.gender,
            hand: user.hand,
            playing_style: user.playing_style,
            favorite_serve: user.favorite_serve,
            grip: user.grip,
            height: user.height,
            team: user.team,
            club: user.club,
            awards: user.awards,
            achievements: user.achievements,
            career: user.career,
            nationality: user.nationality,
            startdate: user.createdAt.toLocaleString(undefined, {
              timeZone: "Asia/Kolkata",
            }),
            enddate: moment(startdate)
              .add(21, "days")
              .format("YYYY-MM-DD hh:mm:ss A"),
          };
          const secretKey = process.env.JWT_SECRET || "";
          userData.token = jwt.sign({ id: user.id.toString() }, secretKey, {
            expiresIn: process.env.JWT_TIMEOUT_DURATION,
          });
          return apiResponse.successResponseWithData(
            res,
            "Coach Registered Successfully.",
            userData
          );
        } else if ("player" == req.body.user_type) {
          startdate = new Date();
          let playerInfo = {
            name: user.name,
            username: user.username,
            user_type: user.user_type,
            phone: user.phone,
            email: user.email,
            dob: user.dob,
            gender: user.gender,
            street_address1: user.street_address1,
            street_address2: user.street_address2,
            grip: user.grip,
            hand: user.hand,
            playing_style: user.playing_style,
            favorite_serve: user.favorite_serve,
            height: user.height,
            location: user.location,
            nationality: user.nationality,
            team: user.team,
            club: user.club,
            awards: user.awards,
            tournament_played:user.tournament_played,
            achievements: user.achievements,
            career: user.career,
            zip_code: user.zip_code,
            startdate:user.createdAt.toLocaleString(undefined, {timeZone: 'Asia/Kolkata'}),
            enddate: moment(startdate).add(21,'days').format('YYYY-MM-DD hh:mm:ss A')
          };
          const secretKey = process.env.JWT_SECRET || "";
          playerInfo.token = jwt.sign({ id: user.id.toString() }, secretKey, {
            expiresIn: process.env.JWT_TIMEOUT_DURATION,
          });
          return apiResponse.successResponseWithData(
            res,
            "Player Registered Successfully.",
            playerInfo
          );
        } else {
          startdate = new Date();
          let userInfo = {
            name: user.name,
            username: user.username,
            user_type: user.user_type,
            phone: user.phone,
            email: user.email,
            dob: user.dob,
            gender: user.gender,
            street_address1: user.street_address1,
            street_address2: user.street_address2,
            zip_code: user.zip_code,
            location: user.location,
            nationality: user.nationality,
            startdate: user.createdAt.toLocaleString(undefined, {
              timeZone: "Asia/Kolkata",
            }),
            enddate: moment(startdate)
              .add(6, "days")
              .format("YYYY-MM-DD HH:mm:ss A z"),
          };
          const secretKey = process.env.JWT_SECRET || "";
          userInfo.token = jwt.sign({ id: user.id.toString() }, secretKey, {
            expiresIn: process.env.JWT_TIMEOUT_DURATION,
          });
          return apiResponse.successResponseWithData(
            res,
            "User Registered Successfully.",
            userInfo
          );
        }
      }
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
/**
 * User login.
 *
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */


//Login API
exports.login = [
  body("email")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Email must be specified.")
    .isEmail()
    .withMessage("Email must be a valid email address."),
    body("password")
    .trim()
    .notEmpty()
    .withMessage("Password should not be empty")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
    }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          errors.array({ onlyFirstError: false })[0].msg
        );
      } else {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ where: { email: email } });
        if (!user) {
          return apiResponse.unauthorizedResponse(
            res,
            "Incorrect email address!"
          );
        }
        if (
          user.password &&
          Password.verify(req.body.password, user.password)
        ) {
         
          let userData = {
            name: user.name,
            username: user.username,
            phone: user.phone,
            email: user.email,
            dob: user.dob,
            gender: user.gender,
            user_type: user.user_type,
          };
          // user matched!
          const secretKey = process.env.JWT_SECRET || "";
          userData.token = jwt.sign({ id: user.id.toString() }, secretKey, {
            expiresIn: process.env.JWT_TIMEOUT_DURATION,
          });
          return apiResponse.successResponseWithData(
            res,
            "LoggedIn Successfully.",
            userData
          );
        } else {
          return apiResponse.ErrorResponse(res, "Incorrect password!");
        }
      }
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

//ForgotPassword
exports.forgotPassword = [
  body("email")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Email must be specified.")
    .isEmail()
    .withMessage("Email must be a valid email address."),
  body("email").escape(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        const { email } = req.body;
        const user = await UserModel.findOne({ where: { email: email } });
        if (user) {
          // Generate otp
          let otp = utility.randomNumber(6);
          // Html email body
          let html = "<p>Waldner Verification Code</p><p>OTP: " + otp + "</p>";
          // Send confirmation email
          mailer
            .send(
              `Walnder <${constants.confirmEmails.from}>`,
              req.body.email,
              "Waldner- OTP",
              html
            )
            .then(async function () {
              const result = await UserModel.update(
                { otp: otp },
                { where: { id: user.id } }
              );
              if (!result) {
                return apiResponse.unauthorizedResponse(
                  res,
                  "Something went wrong!"
                );
              }
              return apiResponse.successResponse(res, "OTP Sent Successfully");
            });
        } else {
          return apiResponse.unauthorizedResponse(
            res,
            "Specified Email not found."
          );
        }
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
//OTP Verification
exports.verifyOtp = [
  body("email")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Email must be specified.")
    .isEmail()
    .withMessage("Email must be a valid email address."),
  body("otp").trim().isLength({ min: 1 }).withMessage("OTP must be specified."),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        const { email, otp } = req.body;
        const user = await UserModel.findOne({
          where: { otp: otp, email: email },
        });
        if (user) {
          return apiResponse.successResponse(res, "OTP Verified Successfully.");
        } else {
          return apiResponse.unauthorizedResponse(
            res,
            "Specified OTP not found."
          );
        }
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
//Reset Password
exports.resetPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email Should not be Empty")
    .isLength({ min: 1 })
    .withMessage("Email must be specified.")
    .isEmail()
    .withMessage("Email must be a valid email address."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password Should not be Empty")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
    })
    .withMessage("password must be strong."),
  body("confirm-password").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Confirm Password Doesn't match to your Password");
    }
    return true;
  }),
  // body("email").escape(),
  body("password").escape(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        const { email, otp } = req.body;
        const user = await UserModel.findOne({ where: { email: email } });
        if (user) {
          // if (user.otp == otp) {
          if (req.body.password) {
   
            const pass= Password.hash(req.body.password);
            const result = await UserModel.update(
              { password: pass },
              { where: { id: user.id } }
            );
            if (!result) {
              return apiResponse.unauthorizedResponse(
                res,
                "Something went wrong!"
              );
            }
            return apiResponse.successResponse(
              res,
              "Password Reset Successfully."
            );
          } else {
            return apiResponse.unauthorizedResponse(
              res,
              "Something went wrong!"
            );
          }
        } else {
          return apiResponse.unauthorizedResponse(
            res,
            "Specified Email not found."
          );
        }
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
