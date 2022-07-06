const postModel = require("../../models/post");
const { body, validationResult } = require("express-validator");
const apiResponse = require("../../helpers/apiResponse");
const auth = require("../../middlewares/jwt");
const multer = require("multer");
const fs = require("fs-extra");
var path = require("path");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let path = `./public/uploads/`;
    fs.mkdirsSync(path);
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      "post" + uuidv4() + "-" + Date.now() + path.extname(file.originalname)
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

//Add Post By Team Member
exports.addpost = [
    auth,
    fileUpload.single('image'),
    body("title").trim(),
    //  .isLength({ min: 1 }),
    //  .withMessage("title is required"),
    body("sub_title").trim(),
    //  .isLength({ min: 1 }),
    //  .withMessage("sub_title is required"),
    body("description").trim(),
    //  .isLength({ min: 1 })
    //  .withMessage("description is required"),
    body("image")
        .trim(),
    //  .isLength({ min: 1 })
    //  .withMessage("image is required"),
    async(req, res) => {
      try{
          const errors = validationResult(req);
          console.log(errors);
          if(!errors.isEmpty()){
              return apiResponse.validationErrorWithData(
              res,
              "validation error",
              errors.array()
              );
          }
          if (!req.file) {
            let sub_info = {
              title: req.body.title,
              sub_title: req.body.sub_title,
              description: req.body.description,
              image: 'ttimage.jpeg'
            }
            const file = await postModel.create(sub_info)    
            sub_info.image = file.image ? process.env.IMAGEURL + 'public/uploads/' + file.image : process.env.IMAGEURL + 'public/uploads/default.png';
            return apiResponse.successResponseWithData(res, "post Added  Sucessfully", sub_info);
          }else {
          let sub_info={
              title:req.body.title,
              sub_title:req.body.sub_title,
              description:req.body.description,
              image: req.file.filename
          };
          const file = await postModel.create(sub_info)
          sub_info.image = file.image ? process.env.IMAGEURL + 'public/uploads/' + file.image : process.env.IMAGEURL + 'public/uploads/default.png';
          return apiResponse.successResponseWithData(res, "post Added  Sucessfully", sub_info);
        }
          // console.log(sub_info);
          // const post = await postModel.create(sub_info);
          // return apiResponse.successResponseWithData(
          //     res,
          //     "Post added successfully",
          //     sub_info
          // );
      }
      catch (err) {
        const errorsub_info = {
          title: req.body,
          file: req.file
        }
        return apiResponse.ErrorResponse(res, errorsub_info);
      }
  }, 
  ];