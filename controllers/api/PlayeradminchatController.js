
const adminplayerchatModel = require("../../models/adminplayerchat");
const apiResponse = require("../../helpers/apiResponse");
const auth = require("../../middlewares/jwt");
const { body, validationResult } = require("express-validator");

exports.sendmessage = [
    auth,
    body("message").isLength({ min: 1 }).trim().withMessage("message is required"),
    body('type').isIn(['image','video','text']).withMessage('Please send valid message type.'),
    body("message").isLength({ min: 1 }).trim().withMessage("message is required"),
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
        const message= await adminplayerchatModel.create(message_info)
        return apiResponse.successResponseWithData(res, "plan added sucessfully",message);
        }
        catch (err) {
        return apiResponse.ErrorResponse(res, err);
        }
    }];