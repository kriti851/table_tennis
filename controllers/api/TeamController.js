const teamModel = require("../../models/team");
const team_player = require("../../models/team_player");
const UserModel = require("../../models/user");
const sequelize = require("../../config/db");
const { QueryTypes, where } = require("sequelize");
const { Op } = require("sequelize");
const apiResponse = require("../../helpers/apiResponse");
const auth = require("../../middlewares/jwt");
const { body, validationResult, check } = require("express-validator");
var path = require("path");
const fs = require("fs-extra");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const team = require("../../models/team");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let path = `./public/uploads/`;
    fs.mkdirsSync(path);
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      "teams" + uuidv4() + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
var fileUpload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
  fileFilter: fileFilter,
});

//Create Team
exports.add = [
  auth,
  fileUpload.single("image"),
  body("team_name")
    .trim()
    .notEmpty()
    .withMessage("team_name is Required")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Must be only alphabetical chars"),
  body("location")
    .trim()
    .notEmpty()
    .withMessage("location is Required")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Must be only alphabetical chars"),
  body("team_activity")
    .trim(),
    // .notEmpty()
    // .withMessage("post is Required")
    // .isAlpha("en-US", { ignore: " " })
    // .withMessage("Must be only alphabetical chars"),
  body("who_can_post")
    .trim(),
  body("invite")
    .trim(),
  body("team_notification")
    .trim(),
//   body("post")
//     .trim()
//     .notEmpty()
//     .withMessage("post is Required")
//     .isAlpha("en-US", { ignore: " " })
//     .withMessage("Must be only alphabetical chars"),
  async (req, res) => {
    try {
      var errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      }
      if (!req.file) {
        let info = {
          created_by: req.user.id,
          team_name: req.body.team_name,
          location: req.body.location,
          team_activity:req.body.team_activity,
          who_can_post:req.body.who_can_post,
          invite:req.body.invite,
          team_notification:req.body.team_notification,
          image: "default.png",
        };
        const team = await teamModel.create(info, (user_type = "coach"));
        info.image = team.image
          ? process.env.IMAGEURL + "public/uploads/" + team.image
          : process.env.IMAGEURL + "public/uploads/default.png";
        return apiResponse.successResponseWithData(
          res,
          "Team created Sucessfully",
          info
        );
      } else {
        let info = {
          created_by: req.user.id,
          team_name: req.body.team_name,
          location: req.body.location,
          team_activity:req.body.team_activity,
          who_can_post:req.body.who_can_post,
          invite:req.body.invite,
          team_notification:req.body.team_notification,
          image: req.file.filename,
        };
        const team = await teamModel.create(info);
        info.image = team.image
          ? process.env.IMAGEURL + "public/uploads/" + team.image
          : process.env.IMAGEURL + "public/uploads/default.png";
        return apiResponse.successResponseWithData(
          res,
          "Team created Sucessfully",
          info
        );
      }
    } catch (err) {
      console.log(err);
      const errorInfo = {
        team_name: req.body,
        file: req.file,
      };
      return apiResponse.ErrorResponse(res, errorInfo);
    }
  },
];

//List
// exports.playerlist = [
//   auth,
//   async (req, res) => {
//     try {
//       var player_list = await teamModel.findAll({
//         where: { created_by: req.user.id },
//         attributes: { exclude: ["createdAt", "updatedAt"] },

//         attributes: [
//           "id",
//           "team_name",
//           "location",
//           [
//             sequelize.literal(
//               "CONCAT('" +
//                 process.env.IMAGEURL +
//                 "public/uploads/" +
//                 "',`image`)"
//             ),
//             "image",
//           ],
//         ],
//         include: [
//           {
//             model: team_player,
//             //   as: 'image',

//             attributes: [
//               "id",
//               "team_id",
//               "player_id",
//               "createdat",
//               "updatedat",
//               // [sequelize.literal("CONCAT('"+process.env.IMAGEURL+'public/uploads/'+"',`image`)"),'image']
//             ],
//           },
//         ],
//       });
//       if (!player_list) {
//         return apiResponse.successResponseWithData(
//           res,
//           "please add the player",
//           player_list
//         );
//       }
//       return apiResponse.successResponseWithData(
//         res,
//         "Sucessfully reterive the information of player detail",
//         player_list
//       );
//     } catch (err) {
//       console.log(err);
//       return apiResponse.ErrorResponse(res, err);
//     }
//   },
// ];

//
// exports.list = [
//   auth,
//   async (req, res) => {
//     try {
//       var user = await sequelize.query(
//         "SELECT team_players.team_id, team_players.player_id,users.username,users.mobileNumber,users.email,users.club,CONCAT('" +
//           process.env.IMAGEURL +
//           "public/uploads/" +
//           "',`users`.`image`) as image from team_players  INNER JOIN users ON team_players.player_id= users.id;",
//         // "SELECT team_players.team_id, team_players.player_id,users.username,users.mobileNumber,users.email,users.club from team_players  INNER JOIN users ON team_players.player_id= users.id;",
//         { type: sequelize.QueryTypes.SELECT }
//       );

//       if (!user) {
//         return apiResponse.successResponseWithData(
//           res,
//           "please add the player",
//           user
//         );
//       }
//       return apiResponse.successResponseWithData(
//         res,
//         "Your list of player which you added",
//         user
//       );
//     } catch (err) {
//       console.log(err);
//       return apiResponse.ErrorResponse(res, err);
//     }
//   },
// ];
