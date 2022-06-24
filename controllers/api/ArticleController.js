const ArticleModel = require("../../models/article");
const apiResponse = require("../../helpers/apiResponse");
const sequelize = require("../../config/db");
const { Op } = require("sequelize");
const auth = require("../../middlewares/jwt");

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


