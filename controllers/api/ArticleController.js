const ArticleModel = require("../../models/article");
const apiResponse = require("../../helpers/apiResponse");
const { Op } = require("sequelize");
const auth = require("../../middlewares/jwt");
const { body, validationResult } = require("express-validator");
const sequelize = require("../../config/db");
var path = require("path");
const fs = require("fs-extra");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let path = `./public/uploads/`;
    fs.mkdirsSync(path);
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      "articles" + uuidv4() + "-" + Date.now() + path.extname(file.originalname)
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


exports.list = [
  auth,
  async (req, res) => {
    try {
      const { pageNumber, pageSize } = req.body;
      if (pageNumber && pageSize) {
        limit = parseInt(pageSize);
        offset = limit * (pageNumber - 1);
      } else {
        limit = parseInt(10);
        offset = limit * (1 - 1);
      }
      var search = {};
      var q = req.body.q;
      q = q.replace(/'/g, "");
      search[Op.or] = {
        title: { [Op.substring]: q.trim() },
        //  content : {[Op.substring]: q.trim()},
      };
      const { count, rows: user } = await ArticleModel.findAndCountAll({
        offset,
        limit,

        // offset,limit, ...search,
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

            where: {

               ...search,
        },
      });

      let next_page = false;
      if (offset + limit < count) {
        next_page = true;
      }

      `      // console.log(count,"sdddddddddddddddddd")
      // console.log(user,"sdddddddddddddddddd")`;

       if (!user) {
        return apiResponse.successResponseWithData(res, "No Article uploaded by this id");
      }
      return apiResponse.successResponseWithData(res, "List of article", {
        user,
        count,
        next_page,
      });
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, err);
    }
  },
];


