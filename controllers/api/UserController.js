const UserModel = require("../../models/user");
const { body, validationResult, check } = require("express-validator");
const apiResponse = require("../../helpers/apiResponse");
const Password = require('node-php-password');
const auth = require("../../middlewares/jwt");
var path = require("path");
const fs = require("fs-extra");
var os = require("os");
const multer = require("multer");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let path = `./public/uploads/`;
    fs.mkdirsSync(path);
    callback(null, path);
  },
  filename: function (req, file, cb) {
    cb(
    null,
      "" + uuidv4() + "-" + Date.now() + path.extname(file.originalname)
    );
    //cb(null, 'avatar-' + Date.now() + path.extname(file.originalname));
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

const profileUpload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2,
    },
    fileFilter: fileFilter,
    });


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
          return apiResponse.successResponseWithData(res, "User Informsation reterive Sudcessfully", user);
        } catch (err) {
          return apiResponse.ErrorResponse(res, err);
        }
      },
    ];
    
  exports.update = [
    auth,
    body("name")
        .trim(),
        // .notEmpty()
        // .withMessage("Name is Required")
        // .isAlpha("en-US", { ignore: " " })
        // .withMessage("Must be only alphabetical chars"),
    body("username")
        .trim(),
        // .notEmpty()
        // .withMessage("Username is Required")
        // .isAlpha("en-US", { ignore: " " })
        // .withMessage("Must be only alphabetical chars"),
    body("gender")
        .trim(),
        // .notEmpty()
        // .isLength({ min: 1 })
        // .withMessage("Gender is required."),
    body("dob")
        .trim(),
    body("email")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Email must be specified.")
        .isEmail()
        .withMessage("Email must be a valid email address."),
    // .custom(async (value, { req }) => {
    //       const user = await UserModel.findOne({ where: { email: value } });
    //       if (user && user.id != req.user.id) {
    //         return Promise.reject("E-mail already in use");
    //       }
    //     }),
    body("nationality")
        .trim()
        .isAlpha()
        .withMessage("Nationality Must be only alphabetical chars"),
    body("achievements").trim(),
    body("career").trim(),
    body("phone")
        .trim()
        .isNumeric()
        .withMessage("Phone Number Must be Numeric")
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
       .trim()
       .isNumeric()
       .withMessage("Zip Code Must be only Numeric")
       .isLength({ min: 4, max: 6 })
       .withMessage("Zip Code Must Contain 5 Digits"),
    //  body("password").custom((value, { req }) => {
    //     if (value) {
    //       if (value.length < 6) {
    //         throw new Error("New Password must be 6 characters or greater.");
    //       }
    //       if (!req.body.old_password) {
    //         throw new Error(
    //           "Old  password is required and must be 6 characters or greater."
    //         );
    //       }
    //       if (req.body.confirm_password !== req.body.password) {
    //         throw new Error("Password confirmation does not match password");
    //       }
    //     }
    //     // Indicates the success of this synchronous custom validator
    //     return true;
    //   }),
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
  
    

//Update Profile

//Change Password
exports.changePassword = [
    auth,
    body("old_password")
        .trim()
        .notEmpty()
        .withMessage("old password must not be empty")
        .isLength({ min:8 ,max:10 }) 
        .withMessage("New  password must be 8 characters or greater."),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("password must not be empty")
        .isLength({ min:8 ,max:10 })
        .withMessage("Password must be 8 characters or greater."),
    body("confirm_password")
        .trim()
        .notEmpty()
        .withMessage("confirm password must not be empty")
        .custom((value, { req }) => {
        if (value !== req.body.password) {
        throw new Error("New Password and Confirm Password Doesn't Match");
        }
    return true;
  }),
    body("old_password").escape(),
    body("password").escape(),
    async (req, res) => {
    try {
         const errors = validationResult(req);
    if (!errors.isEmpty()) {
          return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
    } else {
         const { old_password, password } = req.body;
         const user = await UserModel.findOne({ where: { id: req.user.id } });
    if (user) {
        const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
           return apiResponse.ErrorResponse(res, "Incorrect old password!");
          }
    if (password) {
        const pass = await bcrypt.hash(password, 10);
        const result = await UserModel.update(
            { password: pass, otp: null },
            { where: { id: user.id } }
        );
    if (!result) {
            return apiResponse.unauthorizedResponse(
            res,
            "Something went wrong!"
         );
    }
            return apiResponse.successResponse(
            res,
            "Password changed successfully."
            );
          } else {
            return apiResponse.unauthorizedResponse(
            res,
            "Something went wrong!"
            );
          }
        } else {
            return apiResponse.unauthorizedResponse(
            res,
            "No authorization token was found."
          );
        }
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
//Image Update
exports.updateImage = [
    auth,
    profileUpload.single("image"),
    async (req, res) => {
    try {
         const errors = validationResult(req);
    if (!errors.isEmpty()) {
          return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
         const user = await UserModel.findOne({ where: { id: req.user.id } });
    if (user) {
          const oldPhoto = user.image;
    if (oldPhoto) {
          const oldPath = path.join(
            __dirname,
            "../../",
            "public/uploads/",
            oldPhoto
        );
    if (fs.existsSync(oldPath)) {
             fs.unlink(oldPath, async (err) => {
    if (err) {
          return apiResponse.ErrorResponse(res, err);
         }
          const result = await UserModel.update(
            { image: req.file.filename },
            { where: { id: user.id } }
        );
    if (!result) {
          return apiResponse.unauthorizedResponse(
          res,
          "Something went wrong!"
        );
     }
        return apiResponse.successResponse(
         res,
         "User profile updated successfully."
     );
  });
}
     } else {
         const result = await UserModel.update(
         { image: req.file.filename },
         { where: { id: user.id } }
    );
         console.log(result, "reddddddddddddddddddddg");
    if (!result) {
         return apiResponse.unauthorizedResponse(
         res,
         "Something went wrong!"
      );
    }
        return apiResponse.successResponse(
        res,
        "User profile updated successfully."
            );
          }
        } else {
          return apiResponse.unauthorizedResponse(res, "User not found.");
        }
      }
    } catch (err) {
      console.log(err, "sdeeeeeeeeeeeeef");
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
