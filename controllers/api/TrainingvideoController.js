const VideotrainingModel = require("../../models/trainingvideo")
const auth = require("../../middlewares/jwt");
const { body, validationResult } = require("express-validator")
const apiResponse = require("../../helpers/apiResponse");
const sequelize = require("../../config/db");
var path = require("path");
const fs = require("fs-extra");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
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
  limits: {
    fileSize: 250000000, // 10000000 Bytes = 10 MB
  },
  fileFilter: fileFilter,
});

exports.trainingvideo = [
    auth,
    videoUpload.single("video"),
    body("title").isLength({ min: 1 }).trim().withMessage("title  is required"),
    body("description").isLength({ min: 1 }).trim().withMessage("description  is required"),
    async(req,res) =>{
        var fileSize = 25000000;
        var  fileSize = parseInt(req.headers['content-length']);
        if(fileSize>25000000){
        return apiResponse.ErrorResponse(res," video lesss then 25mb")
        }
        try{
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
                   infoVideo.video =process.env.VIDEOURL + "public/uploads/" + uploadVideo.video;
                   return apiResponse.successResponseWithData(res,"Training video  uploaded Sucessfully",infoVideo);
                 }  else {
                  return apiResponse.ErrorResponse(res,"please upload only video not other files");
                }
         }catch (err) {
            console.log(err)

            return apiResponse.ErrorResponse(res, err);
          }
  
        
    }
]

exports.list = [
    auth,
    async (req, res) => {
      try {
        let getvideo = await VideotrainingModel.findAll({
          order: [["id", "DESC"]],
          attributes: [
            "id",
            "user_id",
            "title",
            "description",
            "createdat",
            "updatedat",
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
            "No video uploaded by this user"
          );
        }
        return apiResponse.successResponseWithData(
          res,
          "List of player",
          getvideo
        );
      } catch (err) {
        return apiResponse.ErrorResponse(res, err);
      }
    },
  ];


