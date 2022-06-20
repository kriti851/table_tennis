const TrainingvideoModel = require("../../models/trainingvideo");
const auth = require("../../middlewares/jwt");
const { body, validationResult, check } = require("express-validator");
const multer = require("multer");
var path = require("path");
const fs = require("fs-extra");
const { v4: uuidv4 } = require("uuid");
const apiResponse = require("../../helpers/apiResponse");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
require("dotenv").config()

const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let path = `./public/uploads/`;
        fs.mkdirsSync(path);
        cb(null, path);
    },
    filename: function (req, file, cb) {
        cb(null, '' + uuidv4() + '-' + Date.now() + path.extname(file.originalname));
      
    },



});
function fileFilter(req, file, cb){
    const extension = file.mimetype.split('/')[0];
    if(extension !== 'video'){
        console.log(extension,"dssssssssssss")
    // return cb(new Error('Something went wrong'), false);
    return cb(console.log('Something went wrong'), false);
    }
    cb(null, true);
};

const videoUpload = multer({
    storage: videoStorage,
    limits: {
    fileSize: 10000000 // 10000000 Bytes = 10 MB
    },
    fileFilter:fileFilter,
})


exports.Trainingvideo = [
auth,
videoUpload.single('video'),
async (req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
        }
   
        if(req.file){
            let infoVideo = {
                user_id: req.user.id,
                video: req.file.filename,
            }
            const uploadVideo = await TrainingvideoModel.create(infoVideo)
            infoVideo.video = process.env.VIDEOURL + 'public/uploads/' + uploadVideo.video;
            return apiResponse.successResponseWithData(res, "Training video  upload Sucessfully", infoVideo);
        } else {
            return apiResponse.ErrorResponse(res,"please upload only video not other files");
        }
    }
    catch (err) {
        console.log(err)
        return apiResponse.ErrorResponse(res, err);

    }
}];



exports.deleteVideo = [
    auth,
    body("id").isLength({ min: 1 }).trim().withMessage("id is required"),
    async (req, res) => {

        console.log(req)
      try { 
          const data = await TrainingvideoModel.destroy({ where: {id: req.body.id,user_id:req.user.id}} )
  
          if(!data){
            return apiResponse.successResponseWithData(res, "No video found",data );
          }
          
          return apiResponse.successResponseWithData(res,"video deleted sucessfully", data );
      } catch (err) {
        return apiResponse.ErrorResponse(res, err);
      }
    }
  ];

