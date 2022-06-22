const PromotionvideoModel = require("../../models/promotionvideo");
const auth = require("../../middlewares/jwt");
const { body, validationResult, check } = require("express-validator");
const sequelize = require("../../config/db");
const { Op } = require("sequelize");
const apiResponse = require("../../helpers/apiResponse");
require("dotenv").config();

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
        "Successfully retrieve information of promoption video uploded by admin",
        { user, count, next_page }
      );
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, err);
    }
  },
];





