// const jwt = require("express-jwt");
// const secret = process.env.JWT_SECRET;

// const authenticate = jwt({
// 	secret: secret,
// 	algorithms: ['HS256']
// });

// module.exports = authenticate;

var jwt = require('jsonwebtoken');
 const apiResponse = require("../helpers/apiResponse");
const authenticate = async (req,res,next)=>{	
	var token = req.header('Authorization'); 
	    if(token !=undefined && token!=""){
	        try {
		const bearerToken = token.split(' ')[1];
	     var token_verify = jwt.verify(bearerToken, 'thisissecuritytoken');
	            req.user = token_verify;
	              next();
							   
	        } catch(err) {
				return apiResponse.successResponseWithData(
					res,
					"Invalid token",
					
				  );
	        }
	    }else{
			return apiResponse.successResponseWithData(
				res,
				"Invalid token",
				
			  );
	    }
	}
	
 module.exports = authenticate;