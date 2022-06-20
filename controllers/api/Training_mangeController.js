const training_manageModel = require("../../models/training_manage");
const sequelize = require("../../config/db");
const fileUpload = require("express-fileupload");
const { body, validationResult } = require("express-validator");
const apiResponse = require("../../helpers/apiResponse");
const auth = require("../../middlewares/jwt");
require("dotenv").config();
var filemidlleware = fileUpload();

//Add Manage Details Traning Of Player
exports.manage_training = [
  auth,
  filemidlleware,
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
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
      }
      const file = req.files.image;
      console.log(file);
      const video = req.files.video;
      console.log(video);
      file.mv("public/uploads/" + file.name);
      video.mv("public/uploads/" + video.name);
      const info = {
        user_id: req.user.id,
        title: req.body.title,
        content: req.body.content,
        image: file.name,
        video: video.name,
        added_by: req.body.added_by,
      };
      console.log(info, "soijggggggg");
      const training_Data = await training_manageModel.create(info);
      training_Data.image =
        process.env.IMAGEURL + "public/uploads/" + training_Data.image;
      training_Data.video =
        process.env.VIDEOURL + "public/uploads/" + training_Data.video;
      return apiResponse.successResponseWithData(
        res,
        "Information  retrive sucessfuly",
        training_Data
      );
    } catch (err) {
      const errorInfo = {
        title: req.body,
        file: req.file,
      };
      return apiResponse.ErrorResponse(res, errorInfo);
    }
  },
];
//Player Traning List
exports.training_list = [
  auth,
  async (req, res) => {
    try {
      let training_list = await training_manageModel.findAll({
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
          [
            sequelize.literal(
              "CONCAT('" + process.env.VIDEOURL + "public/uploads/" + "',video)"
            ),
            "video",
          ],
        ],
        where: { added_by: req.body.added_by },
      });
      if (!training_list.length > 0) {
        return apiResponse.successResponseWithData(
          res,
          "No Information foud",
          training_list
        );
      }
      return apiResponse.successResponseWithData(
        res,
        "Training Information retrive sucessfully",
        training_list
      );
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
//Update Player Traning Data
exports.training_update = [
  auth,
  filemidlleware,
  body("id").isLength({ min: 1 }).trim().withMessage("id is required"),
  async (req, res) => {
    try {
      var errors = validationResult(req);
      if (errors.isEmpty()) {
        // if (!req.files || Object.keys(req.files).length === 0) {
        //   return res.status(400).send('No files were uploaded.');
        // }
        const file = req.files.image;
        console.log(file);
        const video = req.files.video;
        console.log(video);
        file.mv("public/uploads/" + file.name);
        video.mv("public/uploads/" + video.name);
        var setdata = {
          title: req.body.title,
          content: req.body.content,
          image: file.name ? file.image : null,
          video: video.name ? video.name : null,
        };
        console.log(setdata);
        const updateData = await training_manageModel.update(setdata, {
          where: { id: req.body.id },
        });
        setdata.image =
          process.env.IMAGEURL + "public/uploads/" + updateData.image;
        setdata.video =
          process.env.VIDEOURL + "public/uploads/" + updateData.video;
        return apiResponse.successResponseWithData(
          res,
          "Training manage  Info Updated Sucessfully",
          setdata
        );
      } else {
        return apiResponse.ErrorResponse.json({
          status: "fail",
          message: errors.array({ onlyFirstError: true })[0].msg,
        });
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

//Delete Manage Traning
exports.delete = [
  auth,
  body("id").isLength({ min: 1 }).trim().withMessage("id is required"),
  async (req, res) => {
    try {
      //  const articleImage = await ArticleModel.findOne({attributes:['image'],where:{id:req.body.id}});
      const training_List = await training_manageModel.destroy({
        where: { id: req.body.id },
      });
      // console.log(articleList,"jggggggggggggu")
      if (!training_List) {
        return apiResponse.successResponseWithData(
          res,
          "No Information found",
          training_List
        );
      }
      // try {
      //   await fs.unlink(process.env.IMAGEURL+'uploads/'+articleImage.image);
      // } catch (e) {
      //   console.log(e);
      // }
      return apiResponse.successResponseWithData(
        res,
        "Information deleted sucessfully",
        training_List
      );
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
