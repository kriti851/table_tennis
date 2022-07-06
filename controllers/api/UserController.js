const UserModel = require("../../models/user");
const { body, validationResult, check } = require("express-validator");
const apiResponse = require("../../helpers/apiResponse");
const Password = require('node-php-password');
const path = require("path");
const auth = require("../../middlewares/jwt");
const fileUpload = require("express-fileupload");
var filemidlleware = fileUpload();

require("dotenv").config();
const { v4: uuidv4 } = require("uuid");

//User Detail API
exports.detail = [
    auth,
    async (req, res) => {
      try {
        const user = await UserModel.findOne({
          attributes: { exclude: ["password", "confirmpassword", "otp"] },
          where: { id: req.user.id },
        }); 
        if (!user) {
          return apiResponse.ErrorResponse(res, "Something went wrong");
        }
          user.image = user.image ? process.env.IMAGEURL + 'public/uploads/' + user.image : process.env.IMAGEURL + 'public/uploads/default.png';
        return apiResponse.successResponseWithData(res, "User Information reterive Sudcessfully", user);
      } catch (err) {
        return apiResponse.ErrorResponse(res, err);
      }
    },
  ];

//User Update Profile API  
exports.update = [
    auth,
    body("name")
        .trim(),
    body("username")
        .trim(),
    body("gender")
        .trim(),
    body("dob")
        .trim(),
    body("email")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Email must be specified.")
        .isEmail()
        .withMessage("Email must be a valid email address."),
    body("nationality")
        .trim(),
    body("achievements").trim(),
    body("career").trim(),
    body("phone")
        .trim()
        .isLength({ min: 10, max: 10 })
        .withMessage("Phone Number Must be at least 10 Number"),
    body("hand")
        .trim(),
    body("playing_style")
        .trim(),
    body("grip")
        .trim(),
    body("team")
        .trim(),
    body("club").trim(),
    body("favorite_serve")
        .trim(),
    body("awards")
        .trim(),
    body("tournament_played")
        .trim(),
    body("street_address1")
        .trim(),
    body("street_address2")
       .trim(),
    body("zip_code")
       .trim(),
    body("name").escape(),
    body("username").escape(),
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(
              res,
              errors.array({ onlyFirstError: false })[0].msg
            );
        } else {
          const {
            name,
            username,
            email,
            phone,
            gender,
            street_address1,
            street_address2,
            playing_style,
            career,
            nationality,
            team,
            club,
            grip,
            hand,
            location,
            achievements,
          //   expiry_month,
          //   expiry_year,
          //   card_no,
            zip_code,
            awards,
            tournament_played,
            favorite_serve,
          } = req.body;
          const user = await UserModel.findOne({ where: { id: req.user.id } });
          if (user) {
            let userData = {
              name: name,
              email: email,
              username: username,
              phone: phone,
              gender:gender,
              street_address1:street_address1,
              street_address2:street_address2,
              playing_style: playing_style,
              team: team,
              club: club,
              career: career,
              grip: grip,
              nationality: nationality,
              hand: hand,
              location: location,
              achievements: achievements,
              tournament_played:tournament_played,
              // expiry_month: expiry_month,
              // expiry_year: expiry_year,
              // card_no: card_no,
              zip_code: zip_code,
              awards: awards,
              favorite_serve: favorite_serve,
            };  
            const result = await UserModel.update(userData, {
              where: { id: req.user.id },
            });
            if (!result) {
              return apiResponse.unauthorizedResponse(
                res,
                "Something went wrong!"
              );
            }
            return apiResponse.successResponseWithData(
                res,
              "Profile updated successfully.",
                userData
            );
          } else {
            return apiResponse.unauthorizedResponse(
              res,
              "No authorization token was found."
            );
          }
        }
      } catch (err) {
        console.log(err);
        return apiResponse.ErrorResponse(res, err);
      }
    },
  ];
//Chaage Password API
exports.changePassword = [
  auth,
  body("password")
  .trim()
  .notEmpty()
  .withMessage("Password should not be empty")
  .isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
  }),
    body('confirmpassword').custom((confirmpassword,{req})=>{
        var password =req.body.password;
        return new Promise(async (resolve,reject) =>{
            if(password!=confirmpassword){
                return reject('Password confirmation does not match with password');
            }else{
                return resolve(true);
            }
        }); 
    }),

  body("password").escape(),
  async (req, res) => {
  try {
    var errors =validationResult(req);
      if(errors.isEmpty()){
          var body =req.body;
          var user = await UserModel.findOne({where:{id:req.user.id}});
          user.password=Password.hash(body.password);
          await user.save();
          return apiResponse.successResponse(res,"Password changed successfully.");
      }else{
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array({ onlyFirstError: false })[0].msg
        );
      }
     } catch{

      }
    }];

//Update Profile Image API
module.exports.updateImage=[auth,  filemidlleware,async (req,res)=>{
  if(typeof req.files !='undefined'){
      var files = req.files;
      try{
          var image = files.image;
          if(image.mimetype.indexOf('image/') > -1){
              var filepath = 'public/uploads'+req.user.id+Date.now()+path.extname(image.name);
              await image.mv(filepath, image);
              await UserModel.update({image:filepath},{where:{id:req.user.id}});
              let data = {
                image: "http://localhost:3000/" + filepath
                
              };           
              return apiResponse.successResponseWithData(
                res,
                "Profile pic uploaded successfully.",
                data);
          }else{
            return apiResponse.unauthorizedResponse(res, "file must be image");
          }
         } catch (err) {
            console.log(err, "sdeeeeeeeeeeeeef");
            return apiResponse.ErrorResponse(res, err);
          }
  }else{
    return apiResponse.ErrorResponse(res, "file is required");
  }
}];


