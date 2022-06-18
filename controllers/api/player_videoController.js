const practisingvideoModel = require("../../models/practisingvideo");
const apiResponse = require("../../helpers/apiResponse");
const auth = require("../../middlewares/jwt");
const { body, validationResult } = require("express-validator");
const sequelize = require("../../config/db");
var path = require("path");
const fs = require("fs-extra");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const { title } = require("process");
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

exports.player_video = [
    auth,
    videoUpload.single("video"),
    body("title")
      .isLength({ min: 1 })
      .trim().withMessage("title  is required"),
    body("content")
      .isLength({ min: 1 })
      .trim()
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
    if("player" == req.body.user_type) {
        let info = {
        user_id: req.user.id,
        title: req.body.title,
        content: req.body.content,
        video: req.file.filename,
        user_type: req.body.user_type,
        };
        const data = await practisingvideoModel.create(info);
        //console.log(data, "sdfffffff");
        data.video = process.env.VIDEOURL + "public/uploads/" + data.video;
        return apiResponse.successResponseWithData(
          res,
          "practising video upload Sucessfully by Player",
          data
        );
    }else {
        return apiResponse.ErrorResponse(res, "you are not player");
      }
    } catch (err) {
      console.log(err);
      const errorInfo = {
        title: req.body,
        file: req.file,
      };
    }
  },
];

exports.plyer_wholelist = [
    auth,
    async (req, res) => {
    try {
      let getvideo = await practisingvideoModel.findAll({
      attributes: [
      "id",
      "user_id",
      "title",
      "content",
      "user_type",
      "createdat",
      "updatedat",
    [
    sequelize.literal(
      "CONCAT('" + process.env.VIDEOURL + "public/uploads/" + "',video)"
    ),
      "video",
         ],
        ],
      });
    if (!getvideo.length > 0) {
        return apiResponse.successResponseWithData(
          res,
          "Information not found"
        );
      }
        return apiResponse.successResponseWithData(
        res,
        "List of video uploaded by player",
        getvideo
      );
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

exports.plyerlist = [
    auth,
    async (req, res) => {
    try {
      let getvideo = await practisingvideoModel.findAll({
      attributes: [
      "id",
      "user_id",
      "title",
      "content",
      "user_type",
      "createdat",
      "updatedat",
    [
    sequelize.literal(
      "CONCAT('" + process.env.VIDEOURL + "public/uploads/" + "',video)"
    ),
      "video",
          ],
        ],
    where: { user_id: req.user.id },
    });
    if (!getvideo.length > 0) {
        return apiResponse.successResponseWithData(
        res,
        "No Article uploaded by this id"
        );
      }
        return apiResponse.successResponseWithData(
        res,
        "List of Video",
        getvideo
      );
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    }
  },
];

exports.update = [
    auth,
    body("id")
      .isLength({ min: 1 })
      .trim().withMessage("id is required"),
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
        content: body.content,
    };
    try {
        await practisingvideoModel.update(setdata, {
        where: { id: req.body.id },
    });
    var user = await practisingvideoModel.findOne({
        attributes: { exclude: ["video", "user_type", "user_id"] },
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
        const practise_video = await practisingvideoModel.destroy({
        where: { id: req.body.id },
    });
    if (!practise_video) {
        return apiResponse.successResponseWithData(
        res,
        "No information  found",
          practise_video
        );
      }
        return apiResponse.successResponseWithData(
        res,
        "Practising video information  deleted sucessfully",
        practise_video
      );
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    }
  },
];
