const PromotionvideoModel = require("../../models/promotionvideo");
const auth = require("../../middlewares/jwt");
const { body, validationResult, check } = require("express-validator");
const sequelize = require("../../config/db");
const { Op } = require("sequelize");
const multer = require("multer");
var path = require("path");
const fs = require("fs-extra");
const { v4: uuidv4 } = require("uuid");
const apiResponse = require("../../helpers/apiResponse");
const jwt = require("jsonwebtoken");
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
  limits: {
    fileSize: 10000000, // 100000000 Bytes = 1MB
  },
  fileFilter: fileFilter,
});

exports.uploadvideo = [
  auth,
  videoUpload.single("video"),
  body("title").isLength({ min: 1 }).trim().withMessage("title  is required"),
  async (req, res, err) => {
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
          video: req.file.filename,
          title: req.body.title,
          description: req.body.description,
        };
        const uploadVideo = await PromotionvideoModel.create(infoVideo);
        infoVideo.video =
          process.env.VIDEOURL + "public/uploads/" + uploadVideo.video;
        return apiResponse.successResponseWithData(
          res,
          "Admin  uploaded video Sucessfully",
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
      const { count, rows: user } = await PromotionvideoModel.findAndCountAll({
        offset,
        limit,
        order: [["id", "DESC"]],
        attributes: { exclude: ["password", "confirmpassword"] },
        attributes: [
          "id",
          "title",
          "description",
          "createdat",
          "updatedat",
          [
            sequelize.literal(
              "CONCAT('" + process.env.VIDEOURL + "public/uploads/" + "',video)"
            ),
            "video",
          ],
        ],
        where: {
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
      const user = await PromotionvideoModel.findAll({
        attributes: { exclude: ["password", "confirmpassword"] },
        attributes: [
          "id",
          "description",
          "title",
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

exports.update = [
  auth,
  async (req, res) => {
    var body = req.body;
    try {
      var errors = validationResult(req);
      if (errors.isEmpty()) {
        var setdata = {
          title: body.title,
          content: body.content,
        };
        console.log(setdata);
        await PromotionvideoModel.update(setdata, {
          where: { id: req.body.id },
        });

        return apiResponse.successResponseWithData(
          res,
          " Information Updated Sucessfully"
        );
      } else {
        return apiResponse.ErrorResponse.json({
          status: "fail",
          message: errors.array({ onlyFirstError: true })[0].msg,
        });
      }
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
      const data = await PromotionvideoModel.destroy({
        where: { id: req.body.id },
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

