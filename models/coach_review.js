const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const coach_review = sequelize.define(
  "coach_reviews",
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
    coach_id: {
      type: Sequelize.NUMBER,
      allowNull: true,
    },

   

 
  },
  {
    timestamps: true,
  }
);

module.exports = coach_review;