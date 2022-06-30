const team_playerModel = require("../../models/team_player");
const apiResponse = require("../../helpers/apiResponse");
const auth = require("../../middlewares/jwt");
const { validationResult, body} = require("express-validator");

exports.addplayer = [
    auth,
    body("team_id").isLength({ min: 1 }).trim().withMessage("team_id is required."),
    body("player_id").isLength({ min: 1 }).trim().withMessage("player_id is required."),
    async (req, res) => {
        console.log(req)
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
            }

                const user = await team_playerModel.findOne({where:{player_id:req.body.player_id}});
                console.log(user,"sdfiiifds")
              const player_info = {
                 team_id: req.body.team_id,
                 player_id: req.body.player_id,
       

            }       
            console.log(player_info,'sddddddddddddd')
            const team = await team_playerModel.create(player_info)
            return apiResponse.successResponseWithData(res, "player added by coach Sucessfully",team);

    }
        catch (err) {
            console.log(err);
            const errorInfo = {
                player_id: req.body,
            }
            return apiResponse.ErrorResponse(res, errorInfo);
        }

    }];




    









