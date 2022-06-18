const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const coachplayerrecentchat = sequelize.define("coachplayerrecentchats", {
  id: {
    type: Sequelize.NUMBER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },

  user_id: {
    type: Sequelize.NUMBER,
    allowNull: true,
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
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  playerUnreadCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
},{
    timestamps: true,
 
 }); 

module.exports = coachplayerrecentchat;
