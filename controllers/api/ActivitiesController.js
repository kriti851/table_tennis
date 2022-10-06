const activitiesModel = require("../../models/activity");
const auth = require("../../middlewares/jwt");
const { body, validationResult } = require("express-validator");
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

exports.addACtivity = [
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
        };
        const uploadVideo = await activitiesModel.create(infoVideo);
        infoVideo.video = process.env.VIDEOURL + "public/uploads/" + uploadVideo.video;
        return apiResponse.successResponseWithData(
          res,
          "Information added sucessfully",
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


exports.countActivity =[auth,async(req, res) => {
  try {
      let filterSort;
      const filterkey = req.query.filterkey;
      console.log("pashu",filterkey)
      if(filterkey == 'Shots'){
           filterSort = "Shots";
      }
      else if(filterkey == 'Balls'){
          filterSort = "Balls";
      }
      else if(filterkey == 'Table'){
        filterSort = "Table";
    }

    else if(filterkey == 'Serve'){
      filterSort = "Serve";
  }
      else{
          filterSort = "Swings";
      }
      const count = await activitiesModel.count({
        where: { title: filterkey },
      });

      if(count){
          res.status(200).json({'status':'true',count});
      }
      else{
          res.status(404).json({'status':'false','message':'Data not Found'});
      }
  } catch (error) {
      console.log('topTrackBydate Error',error);
      res.status(400).json(error);
  }
}]

exports.getactivies = [auth,async(req, res) => {
  try {
      
      const getActivities = await activitiesModel.findAndCountAll({
          attributes : [
              'id','title','video',
              [
                sequelize.literal(
                  "CONCAT('" + process.env.VIDEOURL + "public/uploads/" + "',video)"
                ),
                "video",
              ],
    
          ],
          where: {  
            title: "Shots"     
          },
          // order : [['trackTitle', 'ASC']]
      });
      if(getActivities){
          res.status(200).json({'status' : 'true',getActivities});
      }
    } catch (err) {
      console.log(err)
      return apiResponse.ErrorResponse(res, err);
    }
}]

exports.getactivies = [auth,async(req, res) => {
  try {
      
      const getActivities = await activitiesModel.findAndCountAll({
          attributes : [
              'id','title','video',
              [
                sequelize.literal(
                  "CONCAT('" + process.env.VIDEOURL + "public/uploads/" + "',video)"
                ),
                "video",
              ],
    
          ],
          where: {  
            title: "Shots"     
          },
          // order : [['trackTitle', 'ASC']]
      });
      if(getActivities){
          res.status(200).json({'status' : 'true',getActivities});
      }
    } catch (err) {
      console.log(err)
      return apiResponse.ErrorResponse(res, err);
    }
}]
