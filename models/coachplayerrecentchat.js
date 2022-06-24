const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const coachplayerrecentchat = sequelize.define("coachplayerrecentchats", {
  id: {
    type: Sequelize.NUMBER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },

  message: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  messageFrom: {
    type: Sequelize.ENUM(["customer", "admin"]),
    defaultValue: "player",
  },

  type: {
    type: Sequelize.ENUM(["text", "image", "video"]),
    defaultValue: "text",
  },
  coachUnreadCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  playerUnreadCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
},{
    timestamps: true,
 
 }); 

module.exports = coachplayerrecentchat;
