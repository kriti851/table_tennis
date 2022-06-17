
const coachplayerchatModel = require("../../models/coachplayerchat");
const apiResponse = require("../../helpers/apiResponse");
const auth = require("../../middlewares/jwt");
const { body, validationResult } = require("express-validator");

exports.sendmessage = [
    auth,
    body("message").isLength({ min: 1 }).trim().withMessage("message is required"),
    body('type').isIn(['image','video','text']).withMessage('Please send valid message type.'),

    async (req, res) => {
    try {
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, "Validation Error.",errors.array({ onlyFirstError: false })[0].msg);
    }
    
    let message_info = {
        user_id: req.user.id,
        message: req.body.message,
        type: req.body.type,
        messageFrom:"player"
    
    }
        console.log(message_info);
        const message= await coachplayerchatModel.create(message_info)
        return apiResponse.successResponseWithData(res, "player send message sucessfully",message);
        }
        catch (err) {
        return apiResponse.ErrorResponse(res, err);
        }
    }];


    exports.coachsendmessage = [
        auth,
        body("message").isLength({ min: 1 }).trim().withMessage("message is required"),
        body('type').isIn(['image','video','text']).withMessage('Please send valid message type.'),
        
        async (req, res) => {
        try {
            const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(res, "Validation Error.",errors.array({ onlyFirstError: false })[0].msg);
        }
        
        let info = {
            user_id: req.user.id,
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