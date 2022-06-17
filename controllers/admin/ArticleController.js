const ArticleModel = require("../../models/article");
const apiResponse = require("../../helpers/apiResponse");
const { Op } = require("sequelize");

const auth = require("../../middlewares/jwt");
const { body, validationResult } = require("express-validator");
const sequelize = require('../../config/db');
var path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

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
    fileSize: 1024 * 1024 * 2,
  },
  fileFilter: fileFilter,
});

exports.add = [
  auth,

  fileUpload.single('image'),
  body("title").isLength({ min: 1 }).trim().withMessage("title  is required"),
  body("content").isLength({ min: 1 }).trim().withMessage("content  is required"),
  async (req, res) => {

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, errors.array({ onlyFirstError: false })[0].msg);
      }
      // const { filename: image } = req.file;
      if (!req.file) {
        let info = {
          title: req.body.title,
          content: req.body.content,
          image: 'default.png'

        }

        const articlefile = await ArticleModel.create(info)

        info.image = articlefile.image ? process.env.IMAGEURL + 'public/uploads/' + articlefile.image : process.env.IMAGEURL + 'public/uploads/default.png';
        return apiResponse.successResponseWithData(res, "Article Added  Sucessfully", info);

      } else {
        let info = {
          title: req.body.title,
          content: req.body.content,
          image: req.file.filename

        }

        const articlefile = await ArticleModel.create(info)
        info.image = articlefile.image ? process.env.IMAGEURL + 'public/uploads/' + articlefile.image : process.env.IMAGEURL + 'public/uploads/default.png';
        return apiResponse.successResponseWithData(res, "Article Added  Sucessfully", info);

      }
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
      const {  pageNumber , pageSize,q } = req.body;
      if(pageNumber && pageSize){
        limit = parseInt(pageSize);
        offset = limit * (pageNumber - 1);
    }else{
        limit = parseInt(10);
        offset = limit * (1 - 1);
    }  
    if(q){
          var search={};
           search[Op.or]={
               title : {[Op.substring]: q.trim()},
              //  content : {[Op.substring]: q.trim()},
           }
          }
      const {count,rows:user} = await ArticleModel.findAndCountAll({
        offset,limit,

        // offset,limit, ...search,
          attributes: ['id', 'title', 'content', 'createdat', 'updatedat',
          [sequelize.literal("CONCAT('" + process.env.IMAGEURL + 'public/uploads/' + "',image)"), 'image']
          ],

          where: { 
      
             ...search
      },

        });
     
 
       
  


        let next_page=false
        if((offset+limit)<count){
            next_page=true;
            
        }

`      // console.log(count,"sdddddddddddddddddd")
      // console.log(user,"sdddddddddddddddddd")`

      // if (!user.length > 0) {
      //   return apiResponse.successResponseWithData(res, "No Article uploaded by this id");
      // }
      return apiResponse.successResponseWithData(res, "List of article",{user,count,next_page});
    } catch (err) {
      console.log(err)
      return apiResponse.ErrorResponse(res, err);
    }
  }]



exports.update = [
  auth,
  fileUpload.single('image'),
  body("id").isLength({ min: 1 }).trim().withMessage("id is required"),
  async (req, res) => {
    var body = req.body;
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
    }
    if (req.file) {
      var set_data = {
        title: body.title,
        content: body.content,
        image: req.file.filename

      }
      set_data.image = process.env.IMAGEURL + 'public/uploads/' + set_data.image
    } else {
      var set_data = {
        title: body.title,
        content: body.content
      }

    }
    try {
      await ArticleModel.update(set_data, { where: { id: req.body.id } });
      var user = await ArticleModel.findOne({
        attributes: { exclude: ['password', 'confirmpassword'] },
        where: { id: req.body.id }
      });
      if (!user) {
        return apiResponse.ErrorResponse(res, "No information  found by this user", user);
      }
      return apiResponse.successResponseWithData(res, "information updated sucessfully", user);

    } catch (err) {
      console.log(err)
      return apiResponse.ErrorResponse(res, err);
    }
  }];

exports.delete = [
  auth,
  body("id").isLength({ min: 1 }).trim().withMessage("id is required"),
  async (req, res) => {
    try {
      const articleList = await ArticleModel.destroy({ where: { id: req.body.id } })
      if (!articleList) {
        return apiResponse.successResponseWithData(res, "No Article found", articleList);
      }
      return apiResponse.successResponseWithData(res, "Article deleted sucessfully", articleList);
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  }
];



exports.list_data = [
  auth,

  async (req, res) => {
    try {
      const user = await ArticleModel.findAll({
        attributes: { exclude: ["password", "confirmpassword"] },
        attributes: [
          "id",
          "content",
          "title",
          "createdat",
          "updatedat",
          [
            sequelize.literal(
              "IF(image!='',CONCAT('" +
                process.env.IMAGEURL +
                "public/uploads/" +
                "',image),'" +
                process.env.IMAGEURL +
                "public/uploads/default.png')"
            ),
            "image",
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
