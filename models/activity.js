const Sequelize = require('sequelize');    
const sequelize = require('../config/db');    
    
const activity = sequelize.define('activities', {  
 id:{
  type:Sequelize.NUMBER,    
 allowNull:false,    
 primaryKey:true,    
  autoIncrement: true    
  },    
 
    title: {
        type: Sequelize.STRING,
        allowNull: true
    },

    video:{
      type: Sequelize.STRING,
      allowNull: true
    },
   
},{ 
    timestamps: true,
 
 });    
    
  module.exports = activity; 