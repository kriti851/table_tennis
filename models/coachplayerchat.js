const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const coachplayerchat = sequelize.define(
  "coachplayerchats",
  {
    id: {
      type: Sequelize.NUMBER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    sender_id: {
      type: Sequelize.NUMBER,
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
      type: Sequelize.ENUM(["player", "admin"]),
      defaultValue: "player",
    },

    type: {
      type: Sequelize.ENUM(["text", "image", "video"]),
      defaultValue: "text",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = coachplayerchat;
