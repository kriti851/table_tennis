var express = require("express");
var authRouter = require("./auth");
var articlerouter = require("./article");
var userRouter = require("./user");
var  practisingrouter = require("./practising");
// var  practisingrouter = require("./video");
var  subscriptionrouter = require("./subscription");
var  videorouter = require("./video");
var apiResponse = require("../../helpers/apiResponse");
var app = express();

// app.get("/", function(req, res) {
// 	res.render("index", { title: "Mimoji api" });
// });

app.use("/auth/", authRouter);
app.use("/user/", userRouter);
app.use("/article/", articlerouter);
app.use("/practising/", practisingrouter);
app.use("/subscription/", subscriptionrouter);
app.use("/adminvideo/", videorouter);

// throw 404 if URL not found
app.all("*", function(req, res) {
	return apiResponse.notFoundResponse(res, "The server has not found anything matching the Request-URI");
});

app.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
	  return apiResponse.unauthorizedResponse(res, err.message);
	}
});

module.exports = app;