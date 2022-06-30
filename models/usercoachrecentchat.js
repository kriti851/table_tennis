const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const usercoachrecentchat = sequelize.define("usercoachrecentchats", {
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
    type: Sequelize.ENUM(["coach", "user"]),
    defaultValue: "coach",
  },

  type: {
    type: Sequelize.ENUM(["text", "image", "video"]),
    defaultValue: "text",
  },
  userUnreadCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  coachUnreadCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
},{
    timestamps: true,
 
 }); 

module.exports = usercoachrecentchat;