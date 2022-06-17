const UserModel = require("../../models/user");
const sequelize = require('../../config/db');
const { body, validationResult } = require("express-validator");
const { Op } = require("sequelize");
//helper file to prepare responses.
const apiResponse = require("../../helpers/apiResponse");
const bcrypt = require("bcrypt");
const auth = require("../../middlewares/jwt");
require("dotenv").config();

var path = require('path');
const fs = require('fs-extra');
var os = require("os");
const multer  = require('multer')
require("dotenv").config();
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		let path = `./public/uploads/`;
		fs.mkdirsSync(path);
		callback(null, path);
	  },
	filename: function (req, file, cb) {
	   cb(null, 'profile' +uuidv4() + '-' + Date.now() + path.extname(file.originalname));
	//cb(null, 'avatar-' + Date.now() + path.extname(file.originalname));
	},
  });


const fileFilter = (req, file, cb) => {
const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
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
            var search={};
        if(q){
           search[Op.or]={
               name : {[Op.substring]: q.trim()},
               email : {[Op.substring]: q.trim()},
               phone : {[Op.substring]: q.trim()},
               mobileNumber : {[Op.substring]: q.trim()},
           };
        }

            const {count,rows:user} = await UserModel.findAndCountAll({
                offset,limit,
               
                  attributes: [
                        'id', 'name', 'user_type', 'username', 'phone','mobileNumber', 'playing_style', 'email', 'gender', 'dob', 'career', 'hand', 'phone', 'favorite_serve', 'awards', 'club', 'location', 'street_address1', 'latitude', 'nationality', 'team', 'latitude', 'longitude', 'expiry_month', 'expiry_year', 'createdat', 'updatedat', [sequelize.literal("IF(image!='',CONCAT('" + process.env.IMAGEURL + 'public/uploads/' + "',image),'"+process.env.IMAGEURL+"public/uploads/default.png')"), 'image']
                    ],
    
                    where: { 
                        user_type: req.body.user_type, 
                         ...search,
                  },
                //   limit:[offest,limit]
    
                });


                let next_page=false
                if((offset+limit)<count){
                    next_page=true;
                    
                }

                var { user_type } = req.body;
                if ("coach" == user_type) {
                    return apiResponse.successResponseWithData(res, "Successfully retrieve information of coach", {user,count,next_page});
    
                } else if
                    ("player" == user_type) {
                    return apiResponse.successResponseWithData(res, "Successfully retrieve information of player", {user,count,next_page});
    
                } else {
                    return apiResponse.successResponseWithData(res, "Successfully retrieve information of user", {user,count,next_page});
                }
        } catch (err) {
            console.log(err)
        return apiResponse.ErrorResponse(res, err);
    }
}];

exports.list_data = [
    auth,
 
    async (req, res) => {
        try {

          
            const user = await UserModel.findAll({
             
                attributes: { exclude: ['password', 'confirmpassword'] },
                attributes: [
                    'id', 'name', 'user_type', 'username', 'phone','mobileNumber', 'playing_style', 'email', 'gender', 'dob', 'career', 'hand', 'phone', 'favorite_serve', 'awards', 'club', 'location', 'street_address1', 'latitude', 'nationality', 'team', 'latitude', 'longitude', 'expiry_month', 'expiry_year', 'createdat', 'updatedat', [sequelize.literal("IF(image!='',CONCAT('" + process.env.IMAGEURL + 'public/uploads/' + "',image),'"+process.env.IMAGEURL+"public/uploads/default.png')"), 'image']
                ],

                where: {
                    [Op.and]: [
                        { user_type: req.body.user_type },
                        { id: req.body.id }
                    ]
                }
            });
            if (!user.length) {
                return apiResponse.ErrorResponse(res, 'user does not exist', user);
            }
            var { user_type } = req.body;
            if ("coach" == user_type) {
                // user.image=process.env.IMAGEURL+'public/uploads/'+user.image;
                return apiResponse.successResponseWithData(res, "Successfully retrieve information of coach", user);

            } else if
                ("player" == user_type) {
                return apiResponse.successResponseWithData(res, "Successfully retrieve information of player", user);

            } else {
                return apiResponse.successResponseWithData(res, "Successfully retrieve information of user", user);
            }
        } catch (err) {
            console.log(err)
            return apiResponse.ErrorResponse(res, err);
        }
    }];

exports.update_user = [
    auth,
    profileUpload.single('image'),
    body("id").isLength({ min: 1 }).trim().withMessage("id is required"),
    async (req, res) => {
        var body = req.body;
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(res, errors.array({ onlyFirstError: false })[0].msg);
        }
     if(req.file){
        var set_data = {
            'name':body.name,
            'username': body.username,
            'mobileNumber': body.mobileNumber,
            'email': body.email,
            'dob': body.dob,
            'gender': req.body.gender,
            'user_type': req.body.user_type,
            'hand': body.hand,
            'phone': body.phone,
            'playing_style': body.playing_style,
            "favorite_serve": body.favorite_serve,
            "grip": body.grip,
            'height': body.height,
            'location': body.location,
            'street_address1': body.street_address1,
            'street_address2': body.street_address2,
            'latitude': body.latitude,
            "longitude": body.longitude,
            "team": body.team,
            "club": body.club,
            "awards": body.awards,
            "zip_code": body.zip_code,
            "cvc_no": body.cvc_no,
            "card_no": body.card_no,
            "expiry_month": body.expiry_month,
            'image':req.file.filename,
            "expiry_year": body.expiry_year
        }
        set_data.image = process.env.IMAGEURL+'public/uploads/'+ set_data.image 
    }else{
        var set_data = {
            'name':body.name,
            'username': body.username,
            'mobileNumber': body.mobileNumber,
            'email': body.email,
            'dob': body.dob,
            'gender': req.body.gender,
            'user_type': req.body.user_type,
            'hand': body.hand,
            'phone': body.phone,
            'playing_style': body.playing_style,
            "favorite_serve": body.favorite_serve,
            "grip": body.grip,
            'height': body.height,
            'location': body.location,
            'street_address1': body.street_address1,
            'street_address2': body.street_address2,
            'latitude': body.latitude,
            "longitude": body.longitude,
            "team": body.team,
            "club": body.club,
            "awards": body.awards,
            "zip_code": body.zip_code,
            "cvc_no": body.cvc_no,
            "card_no": body.card_no,
            "expiry_month": body.expiry_month,
            "expiry_year": body.expiry_year
        }

    }
        try {  
            await UserModel.update(set_data,{ where: { id: req.body.id } });
            var user = await UserModel.findOne({
                  attributes: { exclude: ['password', 'confirmpassword'] },
                where:{id:req.body.id}
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



