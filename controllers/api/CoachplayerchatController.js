const multer = require('multer');
var upload = multer();

const coachplayerchatModel = require("../../models/coachplayerchat");
 const recentchatModel = require("../../models/coachplayerrecentchat");
const apiResponse = require("../../helpers/apiResponse");
const auth = require("../../middlewares/jwt");
const { body, validationResult } = require("express-validator");

//player send message
exports.sendmessage = [
    auth,
    upload.array(),
    body("message").isLength({ min: 1 }).trim().withMessage("message is required"),
    body('type').isIn(['image','video','text']).withMessage('Please send valid message type.'),
    async (req, res) => {
    try {
       let message_info = {
        sender_id:req.user.id,
        receiver_id:req.body.receiver_id,
        message:req.body.message,
        type:req.body.type,
        messageFrom:"player"
    
    }
        // console.log(message_info);
        const message= await coachplayerchatModel.create(message_info)
        return apiResponse.successResponseWithData(res, "player send message sucessfully",message);
        }
        catch (err) {
        return apiResponse.ErrorResponse(res, err);
        }
    }];

//coach send message
    exports.coachsendmessage = [
        auth,
        upload.array(),
        body("message").isLength({ min: 1 }).trim().withMessage("message is required"),
        body('type').isIn(['image','video','text']).withMessage('Please send valid message type.'),
        
        async (req, res) => {
        try {
            const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(res, "Validation Error.",errors.array({ onlyFirstError: false })[0].msg);
        }
        
        let info = {
            sender_id:req.user.id,
            receiver_id : req.body.receiver_id,
            message: req.body.message,
            type: req.body.type,
            messageFrom:"coach"
        
        }
            console.log(info);
            const message= await coachplayerchatModel.create(info)
            return apiResponse.successResponseWithData(res, "coach send message sucessfully",message);
            }
            catch (err) {
                console.log(err,"dfffffffffffffffffffff")
            return apiResponse.ErrorResponse(res, err);
            }
        }];


//recentchatsavecount and uncount
        exports.recentChat = [
            auth,
         async (req, res) => {
          try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(res, "Validation Error.",errors.array({ onlyFirstError: false })[0].msg);
            }
            var body =req.body;
            var Chat = await recentchatModel.findOne({
                where:{
                    sender_id:req.user.id,
                }
            });
            if(Chat){
                Chat.message=body.message;
                Chat.type=body.type;
                Chat.receiver_id=body.receiver_id
                Chat.messageFrom='player';
                Chat.coachUnreadCount=(Chat.coachUnreadCount+1);
                await Chat.save();
            }else{
                await recentchatModel.create({
                    sender_id:req.user.id,
                    receiver_id:body.receiver_id,
                    message:body.message,
                    type:body.type,
                    messageFrom:'player',
                    userUnreadCount:1,
       
                });
            }
        }
        catch (err) {
            console.log(err,"dfffffffffffffffffffff")
        return apiResponse.ErrorResponse(res, err);
        }
    }];



