const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const userplayerrecentchat = sequelize.define("userplayerrecentchats", {
  id: {
    type: Sequelize.NUMBER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  sender_id:{
    type: Sequelize.STRING,
    allowNull: true,

  },

  receiver_id: {
    type: Sequelize.NUMBER,
    allowNull: true,
  },

  message: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  messageFrom: {
    type: Sequelize.ENUM(["player", "user"]),
    defaultValue: "user",
  },

  type: {
    type: Sequelize.ENUM(["text", "image", "video"]),
    defaultValue: "text",
  },
  userUnreadCount: {
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

module.exports = userplayerrecentchat;