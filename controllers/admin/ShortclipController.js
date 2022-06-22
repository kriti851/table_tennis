const TrainingvideoModel = require("../../models/shortclip");
const auth = require("../../middlewares/jwt");
const { body, validationResult, check } = require("express-validator");
const sequelize = require("../../config/db");
const multer = require("multer");
var path = require("path");
const fs = require("fs-extra");
const { v4: uuidv4 } = require("uuid");
const apiResponse = require("../../helpers/apiResponse");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
require("dotenv").config();
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let path = `./public/uploads/`;
    fs.mkdirsSync(path);
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      "" + uuidv4() + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
function fileFilter(req, file, cb) {
  const extension = file.mimetype.split("/")[0];
  if (extension !== "video") {
    console.log(extension, "dssssssssssss");
    // return cb(new Error('Something went wrong'), false);
    return cb(console.log("Something went wrong"), false);
  }
  cb(null, true);
}
const videoUpload = multer({
  storage: videoStorage,
  // limits: {
  //   fileSize: 1000000, // 100000000 Bytes = 1MB
  // },
  fileFilter: fileFilter,
});

// const videoUpload = multer({
//   limits: {
//     fieldNameSize: 300,
//     fileSize: 1000000, // 10 Mb
//   },
//   fileFilter: (req, file, callback) => {
//     const fileSize = parseInt(req.headers['content-length']);
//     if (fileSize > 1000000) {
//       return callback(new Error('...'));
//     }

//     callback(null, true);
//   }
// })


exports.uploadvideo = [
  auth,
  videoUpload.single("video"),
  body("title").isLength({ min: 1 }).trim().withMessage("title  is required"),
  body("description")
    .isLength({ min: 1 })
    .trim()
    .withMessage("description  is required"),
  
  async (req, res) => {
    var fileSize = 2000000;
    var  fileSize = parseInt(req.headers['content-length']);
    if (fileSize > 2000000) {
     return apiResponse.ErrorResponse(
      res,
       "please upload video only less then 30 second"
      );
     }
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          errors.array({ onlyFirstError: false })[0].msg
        );
      }
      if (req.file) {
        let infoVideo = {
          user_id: req.user.id,
          video: req.file.filename,
          title: req.body.title,
          description: req.body.description,
          approve: "1",
        };
        const uploadVideo = await TrainingvideoModel.create(infoVideo);
        infoVideo.video =
          process.env.VIDEOURL + "public/uploads/" + uploadVideo.video;
        return apiResponse.successResponseWithData(
          res,
          "Training video  uploaded Sucessfully",
          infoVideo
        );
      } else {
        return apiResponse.ErrorResponse(
          res,
          "please upload only video not other files"
        );
      }
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, err);
    }
  
  },
];

exports.list = [
  auth,
  async (req, res) => {
    try {
      const { pageNumber, pageSize, q } = req.body;
      if (pageNumber && pageSize) {
        limit = parseInt(pageSize);
        offset = limit * (pageNumber - 1);
      } else {
        limit = parseInt(10);
        offset = limit * (1 - 1);
      }
      if (q) {
        var search = {};
        search[Op.or] = {
          title: { [Op.substring]: q.trim() },
          //  content : {[Op.substring]: q.trim()},
        };
      }
      var approve = req.body.approve;
      if (0 == approve) {
        const { count, rows: user } = await TrainingvideoModel.findAndCountAll({
          offset,
          limit,
          order: [["id", "DESC"]],
          attributes: { exclude: ["password", "confirmpassword"] },
          attributes: [
            "id",
            "user_id",
            "approve",
            "title",
            "description",
            "createdat",
            "updatedat",
            [
              sequelize.literal(
                "CONCAT('" +
                  process.env.VIDEOURL +
                  "public/uploads/" +
                  "',video)"
              ),
              "video",
            ],
          ],
          where: {
            approve: "0",

            ...search,
          },
        });

        let next_page = false;
        if (offset + limit < count) {
          next_page = true;
        }

        if (!user) {
          return apiResponse.ErrorResponse(res, "Something went wrong", user);
        }
        return apiResponse.successResponseWithData(
          res,
          "Successfully retrieve information of uploaded video",
          { user, count, next_page }
        );
      } else {
        const { pageNumber, pageSize, q } = req.body;

        if (pageNumber && pageSize) {
          limit = parseInt(pageSize);
          offset = limit * (pageNumber - 1);
        } else {
          limit = parseInt(10);
          offset = limit * (1 - 1);
        }
        var approve = req.body.approve;
        if ("1" == approve) {
          const { count, rows: user } =
            await TrainingvideoModel.findAndCountAll({
              offset,
              limit,
              attributes: { exclude: ["password", "confirmpassword"] },
              attributes: [
                "id",
                "user_id",
                "approve",
                "title",
                "description",
                "createdat",
                "updatedat",
                [
                  sequelize.literal(
                    "CONCAT('" +
                      process.env.VIDEOURL +
                      "public/uploads/" +
                      "',video)"
                  ),
                  "video",
                ],
              ],
              where: { approve: "1" },
            });
          let next_page = false;
          if (offset + limit < count) {
            next_page = true;
          }
          if (!user.length) {
            return apiResponse.ErrorResponse(res, "Something went wrong", user);
          }
          return apiResponse.successResponseWithData(
            res,
            "Successfully retrieve information of uploaded video",
            { user, count, next_page }
          );
        }
      }
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
exports.list_history = [
  auth,
  async (req, res) => {
    try {
      const user = await TrainingvideoModel.findAll({
        attributes: [
          "id",
          "description",
          "title",
          "approve",
          "disable",
          "createdat",
          "updatedat",
          [
            sequelize.literal(
              "CONCAT('" + process.env.VIDEOURL + "public/uploads/" + "',video)"
            ),
            "video",
          ],
        ],

        where: { id: req.body.id },
      });
      if (!user.length) {
        return apiResponse.ErrorResponse(res, "Something went wrong", user);
      }
      return apiResponse.successResponseWithData(
        res,
        "Successfully retrieve information of Article",
        user
      );
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

exports.info_user = [
  auth,
  async (req, res) => {
    try {
      var user = await sequelize.query(
        "SELECT trainingvideos.user_id,users.username,users.email,users.user_type from trainingvideos INNER JOIN users ON trainingvideos.user_id= users.id;",
        // "SELECT team_players.team_id, team_players.player_id,users.username,users.mobileNumber,users.email,users.club from team_players  INNER JOIN users ON team_players.player_id= users.id;",
        { type: sequelize.QueryTypes.SELECT }
      );

      if (!user) {
        return apiResponse.successResponseWithData(
          res,
          "No information found ",
          user
        );
      }
      return apiResponse.successResponseWithData(
        res,
        "Information retrive sucessfully",
        user
      );
    } catch (err) {
      console.log(err);
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
      approve: req.body.approve,
    };
    try {
      await TrainingvideoModel.update(setdata, {
        where: { id: req.body.id },
      });
      var user = await TrainingvideoModel.findOne({
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
        "Approval request  updated by admin sucessfully"
      );
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

exports.Disable_update = [
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
      disable: req.body.disable,
    };
    try {
      await TrainingvideoModel.update(setdata, {
        where: { id: req.body.id },
      });
      var user = await TrainingvideoModel.findOne({
        where: { id: req.body.id },
      });
      if (!user) {
        return apiResponse.ErrorResponse(
          res,
          "No information  found by this user"
        );
      }
      return apiResponse.successResponseWithData(
        res,
        "Disable request  updated sucessfully"
      );
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

exports.deleteVideo = [
  auth,
  body("id").isLength({ min: 1 }).trim().withMessage("id is required"),
  async (req, res) => {
    console.log(req);
    try {
      const data = await TrainingvideoModel.destroy({
        where: { id: req.body.id, user_id: req.user.id },
      });

      if (!data) {
        return apiResponse.successResponseWithData(res, "No video found", data);
      }

      return apiResponse.successResponseWithData(
        res,
        "video deleted sucessfully",
        data
      );
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];


