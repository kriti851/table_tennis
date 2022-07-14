const VideotrainingModel = require("../../models/trainingvideo");
const { body, validationResult } = require("express-validator");
const auth = require("../../middlewares/jwt");
const sequelize = require("../../config/db");
const apiResponse = require("../../helpers/apiResponse");
var path = require("path");
const fs = require("fs-extra");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const { Op } = require("sequelize");
require("dotenv").config();

//DiskStorage
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
//File Filter
function fileFilter(req, file, cb) {
  const extension = file.mimetype.split("/")[0];
  if (extension !== "video") {
    console.log(extension, "dssssssssssss");
    return cb(console.log("Something went wrong"), false);
  }
  cb(null, true);
}
//File Size 25MB
const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 250000000, // 10000000 Bytes = 10 MB
  },
  fileFilter: fileFilter,
});

//Upload video with content
exports.trainingvideo = [
  auth,
  videoUpload.single("video"),
  body("title").trim().isLength({ min: 1 }).withMessage("Title is required"),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Description is required"),
  async (req, res) => {
    var fileSize = 25000000;
    var fileSize = parseInt(req.headers["content-length"]);
    if (fileSize > 25000000) {
      return apiResponse.ErrorResponse(res, " video less then 25mb");
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
        };
        const uploadVideo = await VideotrainingModel.create(infoVideo);
        infoVideo.video =
          process.env.VIDEOURL + "public/uploads/" + uploadVideo.video;
        return apiResponse.successResponseWithData(
          res,
          "Training video uploaded Successfully",
          infoVideo
        );
      } else {
        return apiResponse.ErrorResponse(
          res,
          "Please upload only video not other files"
        );
      }
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
//List
exports.list = [
  auth,
  async (req, res) => {
    try {
      let getvideo = await VideotrainingModel.findAll({
        order: [["id", "DESC"]],
        attributes: [
          "user_id",
          "id",
          "title",
          "description",
          [
            sequelize.literal(
              "CONCAT('" + process.env.IMAGEURL + "public/uploads/" + "',video)"
            ),
            "video",
          ],
        ],
        where: { user_id: req.user.id },
      });
      if (!getvideo.length) {
        return apiResponse.successResponseWithData(
          res,
          "No video uploaded by you"
        );       
      }
      return apiResponse.successResponseWithData(
        res,
        "List of uploaded video",
        getvideo
      );
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

//Update Content
exports.update = [
  auth,
  body("id")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Id is required"),
  body("title")
    .trim(),
  body("description")
    .trim(),
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
    var setdata = {
      title: body.title,
      description: body.description,
    };
    try {
      await VideotrainingModel.update(setdata, {
        where: { id: req.body.id },
      });
      var user = await VideotrainingModel.findOne({
        attributes: { exclude: ["video", "user_type", "user_id","createdAt","updatedAt"] },
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

//Delete Video
exports.deleteVideo = [
  auth,
  body("id")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Id is required"),
  async (req, res) => {
    console.log(req);
    try {
      const data = await VideotrainingModel.destroy({
        where: { id: req.body.id, user_id: req.user.id },
      });
      if (!data) {
        return apiResponse.successResponseWithData(res, "No video found", data);
      }
      return apiResponse.successResponseWithData(
        res,
        "Video deleted successfully",
        data
      );
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
