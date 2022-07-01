const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const usercoachchat = sequelize.define(
  "usercoachchats",
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
      type: Sequelize.ENUM(["coach", "user"]),
      defaultValue: "coach",
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

module.exports = usercoachchat;