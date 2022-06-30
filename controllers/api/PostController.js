const postModel = require("../../models/post");
const { body, validationResult } = require("express-validator");
const apiResponse = require("../../helpers/apiResponse");
const auth = require("../../middlewares/jwt");

//Add Post By Team Member
exports.addpost = [
    auth,
    body("title").trim(),
    //  .isLength({ min: 1 }),
    //  .withMessage("title is required"),
    body("sub_title").trim(),
    //  .isLength({ min: 1 }),
    //  .withMessage("sub_title is required"),
    body("description").trim(),
    //  .isLength({ min: 1 })
    //  .withMessage("description is required"),
    //body("image").trim(),
    //  .isLength({ min: 1 })
    //  .withMessage("image is required"),
    async (req, res) => {
      var errors = validationResult(req);
      if (errors.isEmpty()) {
        try {
            const post_info = {
            title: req.body.title,
            sub_title: req.body.sub_title,
            description: req.body.description,
          };
          const post = await postModel.create(post_info);
          return apiResponse.successResponseWithData(
            res,
            "Posted Successfully",
            post_info
          );
        } catch (err) {
          console.log("asdfff", err);
          const errorInfo = {
            title: req.body,
            //file: req.file,
          };
          return apiResponse.ErrorResponse(res, errorInfo);
        }
      } else {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      }
    },
  ];