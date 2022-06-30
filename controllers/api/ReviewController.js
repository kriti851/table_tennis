const reviewModel = require("../../models/review");
const coachreviewModel = require("../../models/coach_review");
const sequelize = require("../../config/db");
const apiResponse = require("../../helpers/apiResponse");
const { body, validationResult,check} = require("express-validator");
const auth = require("../../middlewares/jwt");

module.exports.review =  [
    auth,
    check("player_id")
    .trim()
    .notEmpty()
    .withMessage("player_id is Required")
    .isInt()
    .withMessage("Must be only Integer"),
    check("rating")
    .trim()
    .notEmpty()
    .withMessage("receiver_id  is Required")
    .isInt()
    .withMessage("Must be only Integer"),
    async (req, res) => {
    var errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            var body = req.body;
            var reviews = await reviewModel.findOne({ where: { user_id: req.user.id, player_id: body.player_id } });
            if (reviews) {
                reviews.rating = body.rating;
                reviews.description = body.description
                await reviews.save();

                var avg = await sequelize.query("SELECT description,player_id, AVG(rating) as ratingAvg,count(*) as totalReviewers from reviews INNER JOIN users ON users.id=reviews.user_id  WHERE player_id = " + body.player_id + " group by description","player_id", { type: sequelize.QueryTypes.SELECT })

                return apiResponse.successResponseWithData(
                    res,
                    "Review updated successfully",
                 avg[0]
                  );
            } else {
                await reviewModel.create({
                    user_id: req.user.id,
                    rating: body.rating,
                    player_id :body.player_id,
                    description: body.description 
          
                });
                var avg = await sequelize.query("SELECT description,player_id AVG(rating) as ratingAvg,count(*) as totalReviewers from reviews INNER JOIN users ON users.id=reviews.user_id  WHERE player_id = " + body.player_id + " group by description","player_id", { type: sequelize.QueryTypes.SELECT })

                return apiResponse.successResponseWithData(
                    res,
                    "'Review added successfully'",
                 avg[0]
                  );
            }
         } catch (err) {
                console.log(err, "dfffffffffffffffffffff");
                return apiResponse.ErrorResponse(res, err);
              }
    } else {
        return apiResponse.validationErrorWithData(
            res,
            "Validation Error.",
            errors.array({ onlyFirstError: false })[0].msg
          )
    }
}];


module.exports.GetPlayerReviews =[
    auth,
 async (req, res) => {
    try {
        var body = req.body;
        var totalRecords = await reviewModel.count({ where: { player_id: body.player_id } });
        var reviews = await reviewModel.findAll({
            attributes: ["id", "user_id", "player_id","rating", "description",
   
            ],
            where: { player_id: body.player_id }, order: [['id', 'DESC']],
           
        });
        if (reviews.length) {

            return apiResponse.successResponseWithData(
                res,
                "'Rating added successfully'",
             {reviews,count:totalRecords}
              );
        } else {

            return apiResponse.successResponseWithData(
                res,
                "'No information found'",
             {reviews,count:totalRecords}
              );
        }
       }catch (err) {
            console.log(err, "dfffffffffffffffffffff");
            return apiResponse.ErrorResponse(res, err);
          }
}]


module.exports.addcoach_review =  [
    auth,
    check("coach_id")
    .trim()
    .notEmpty()
    .withMessage("coach_id  is Required")
    .isInt()
    .withMessage("Must be only Integer"),
    check("rating")
    .trim()
    .notEmpty()
    .withMessage("receiver_id  is Required")
    .isInt()
    .withMessage("Must be only Integer"),
    async (req, res) => {
    var errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            var body = req.body;
            var reviews = await coachreviewModel.findOne({ where: { user_id: req.user.id, coach_id: body.coach_id } });
            if (reviews) {
                reviews.rating = body.rating;
                reviews.description = body.description
                await reviews.save();

                var avg = await sequelize.query("SELECT  AVG(rating) as ratingAvg,count(*) as totalReviewers from coach_reviews INNER JOIN users ON users.id=coach_reviews.user_id  WHERE coach_id = " + body.coach_id, { type: sequelize.QueryTypes.SELECT })

                return apiResponse.successResponseWithData(
                    res,
                    "Rating updated successfully",
                 avg[0]
                  );
            } else {
                await coachreviewModel.create({
                    user_id: req.user.id,
                    rating: body.rating,
                    coach_id :body.coach_id,
                    description: body.description 
          
                });
                var avg = await sequelize.query("SELECT  AVG(rating) as ratingAvg,count(*) as totalReviewers from coach_reviews INNER JOIN users ON users.id=coach_reviews.user_id  WHERE coach_id = " + body.coach_id,  { type: sequelize.QueryTypes.SELECT })
                return apiResponse.successResponseWithData(
                    res,
                    "'Review added successfully'",
                 avg[0]
                  );
            }
         } catch (err) {
                console.log(err, "dfffffffffffffffffffff");
                return apiResponse.ErrorResponse(res, err);
              }
    } else {
        return apiResponse.validationErrorWithData(
            res,
            "Validation Error.",
            errors.array({ onlyFirstError: false })[0].msg
          )
    }
}];


module.exports.GetcoachReviews =[
    auth,
 async (req, res) => {
    try {
        var body = req.body;
        var totalRecords = await coachreviewModel.count({ where: { coach_id: body.coach_id } });
        var reviews = await coachreviewModel.findAll({
            attributes: ["id", "user_id", "coach_id","rating", "description",
   
            ],
            where: { coach_id: body.coach_id }, order: [['id', 'DESC']],
           
        });
        if (reviews.length) {

            return apiResponse.successResponseWithData(
                res,
                "'Rating added successfully'",
             {reviews,count:totalRecords}
              );
        } else {

            return apiResponse.successResponseWithData(
                res,
                "'No information found'",
             {reviews,count:totalRecords}
              );
        }
       }catch (err) {
            console.log(err, "dfffffffffffffffffffff");
            return apiResponse.ErrorResponse(res, err);
          }
}]
