const practisingvideoModel = require("../../models/practisingvideo");
const apiResponse = require("../../helpers/apiResponse");
const auth = require("../../middlewares/jwt");
const { body, validationResult } = require("express-validator");
const sequelize = require("../../config/db");
var path = require("path");
const fs = require("fs-extra");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
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
const videoUpload = multer({
  storage: videoStorage,
});

//Practicing Video uploaded by Player
exports.add = [
  auth,
  videoUpload.single("video"),
  body("title")
   .trim()
   .isLength({ min: 1 })
   .withMessage("title  is required"),
  body("content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("content  is required"),
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
      const { filename: video } = req.file;
      let info = {
        user_id: req.user.id,
        title: req.body.title,
        content: req.body.content,
        user_type:req.body.user_type,
        video: req.file.filename,
      };
      const data = await practisingvideoModel.create(
        info,
        (user_type = "player")
      );
      data.video = process.env.VIDEOURL + "public/uploads/" + data.video;
      return apiResponse.successResponseWithData(
        res,
        "practising video upload Sucessfully",
        data
      );
    } catch (err) {
      console.log(err);
      const errorInfo = {
        title: req.body,
        file: req.file,
      };
      return apiResponse.ErrorResponse(res, errorInfo);
    }
  },
];

exports.list = [
  auth,
  async (req, res) => {
    try {
      const data = {
        image: req.query.image,
      };
      console.log(data.image);
      let getArticle = await ArticleModel.findAll({
        attributes: [
          "id",
          "title",
          "content",
          "createdat",
          "updatedat",
          [
            sequelize.literal(
              "CONCAT('" + process.env.IMAGEURL + "public/uploads/" + "',image)"
            ),
            "image",
          ],
        ],
      });
      if (!getArticle.length > 0) {
        return apiResponse.successResponseWithData(
          res,
          "No Article uploaded by this id"
        );
      }
      return apiResponse.successResponseWithData(
        res,
        "List of article",
        getArticle
      );
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
