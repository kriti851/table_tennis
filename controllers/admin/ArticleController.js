const ArticleModel = require("../../models/article");
const apiResponse = require("../../helpers/apiResponse");
const auth = require("../../middlewares/jwt");
const { body, validationResult } = require("express-validator");
const sequelize = require('../../config/db');
var path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const article = require("../../models/article");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let path = `./public/uploads/`;
    fs.mkdirsSync(path);
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(null, 'articles' + uuidv4() + '-' + Date.now() + path.extname(file.originalname));
  },

});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

var fileUpload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 *1024 * 2,
  },
  fileFilter: fileFilter,
});

exports.add = [
   auth,
   fileUpload.single('image'),
  // body("title").isLength({ min: 1 }).trim().withMessage("title  is required"),
  // body("content").isLength({ min: 1 }).trim().withMessage("content  is required"),
   async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
      }
      const { filename: image } = req.file;
      let info = {
      title: req.body.title,
      content: req.body.content,      
      image: req.file.filename,
      }
      const articlefile = await ArticleModel.create(info)
      info.image = process.env.IMAGEURL+'public/uploads/'+ articlefile.image
      return apiResponse.successResponseWithData(res, "Article  Image upload Sucessfully",info);
    }
    catch (err) {
      const errorInfo = {
        title: req.body,
        file: req.file
      }
      return apiResponse.ErrorResponse(res, errorInfo);
    }
  }];

exports.list = [
  auth,
  async (req, res) => {
  try {
    const data = {
    image: req.query.image,
   }
    console.log(data.image)
    let getArticle = await ArticleModel.findAll({
        attributes: ['id', 'title', 'content', 'createdat', 'updatedat',
          [sequelize.literal("CONCAT('" + process.env.IMAGEURL + 'uploads/' + "',image)"), 'image']
        ],
        //  where:{user_id:req.user.id}
      });
      if (!getArticle.length > 0) {
         return apiResponse.successResponseWithData(res, "No Article uploaded by this id");
      }
         return apiResponse.successResponseWithData(res, "List of article", getArticle);
    } catch (err) {
         return apiResponse.ErrorResponse(res, err);
    }
  }]

exports.update = [
    auth,
    fileUpload.single('image'),
    body("id")
     .isLength({ min: 1 })
     .trim().withMessage("id is required"),
    async (req, res) => {
    var body = req.body;
    try {
    var errors = validationResult(req);
    if (errors.isEmpty()) {
        const { filename: image } = req.file;
        var setdata = {
        title: body.title,
        content:body.content,
        image: req.file.filename
    }
        console.log(setdata)
        const updateData = await ArticleModel.update(setdata, { where: { id: req.body.id } });
        setdata.image = process.env.IMAGEURL + 'uploads/' + setdata .image;
        return apiResponse.successResponseWithData(res, "Article Info Updated Sucessfully", setdata);
      } else {
        return apiResponse.ErrorResponse.json({ 'status': "fail", message: errors.array({ onlyFirstError: true })[0].msg });
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  }];

exports.delete = [
    auth,
    body("id").isLength({ min: 1 }).trim().withMessage("id is required"),
    async (req, res) => {
    try {
      //  const articleImage = await ArticleModel.findOne({attributes:['image'],where:{id:req.body.id}});
      const articleList = await ArticleModel.destroy({ where: { id: req.body.id } })
      if (!articleList) {
         return apiResponse.successResponseWithData(res, "No Article found", articleList);  
      }
        return apiResponse.successResponseWithData(res, "Article deleted sucessfully", articleList);
     }catch (err) {
        return apiResponse.ErrorResponse(res, err);
    }
  }
];
