var express = require("express");
var authRouter = require("./auth");
var chatRouter = require("./chat")
var userRouter = require("./user");
var promotionrouter = require("./promotion");
var traingMangeRouter = require("./traingMange");
var trainingvideoRouter = require("./trainingvideo");
var mange_training = require("./mange_training");
var playervideoRouter = require("./playervideo");
var teamRouter = require("./team")
var defaultRouter = require("./default")
var team_playerRouter =require("./team_player")
var shortclipRouter =require("./shortclip")
var articlerouter = require("./article");
var languageRouter = require("./language");
var postRouter = require("./post");

var apiResponse = require("../../helpers/apiResponse");

const language = require("../../models/language");
var app = express();

// app.get("/", function(req, res) {
// 	res.render("index", { title: "Mimoji api" });
// });

app.use("/auth/", authRouter);
app.use("/chat/", chatRouter);
app.use("/user/", userRouter);
app.use("/trainingvideo/",trainingvideoRouter);
app.use("/training/",mange_training);
app.use("/mange/",traingMangeRouter);
app.use("/team/",teamRouter);
app.use("/player/",team_playerRouter);
app.use("/video/",playervideoRouter);
app.use("/default/",defaultRouter);
app.use("/clip/",shortclipRouter);
app.use("/article/", articlerouter);
app.use("/promotion/", promotionrouter);
app.use("post/" , postRouter);
app.use("/language/" , languageRouter);

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
