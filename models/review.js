const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const review = sequelize.define(
  "reviews",
  {
    id: {
      type: Sequelize.NUMBER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id:{
      type:Sequelize.NUMBER, 
      allowNull:true,
  },


    rating: {
      type: Sequelize.NUMBER,
      allowNull: true,
    },

    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    player_id: {
      type: Sequelize.NUMBER,
      allowNull: true,
    },

   

 
  },
  {
    timestamps: true,
  }
);

module.exports = review;