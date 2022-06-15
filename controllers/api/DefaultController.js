
const CountryModel = require("../../models/country");

const apiResponse = require("../../helpers/apiResponse");
exports.GetCountry = [
    async (req, res) => {
        console.log(req)
        try {
            let countries = await CountryModel.findAll({
            });

            return apiResponse.successResponseWithData(res, "List of country", countries);
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }]
