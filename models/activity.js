const Sequelize = require('sequelize');    
const sequelize = require('../config/db');    
    
const activity = sequelize.define('activity', {  
id:{
type:Sequelize.NUMBER,    
allowNull:false,    
primaryKey:true,    
autoIncrement: true    
  },    
    // attributes    
    activity_name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    duration: {
        type: Sequelize.STRING,
        allowNull: true
    },
},{ 
    timestamps: true,
 
 });    
    
 module.exports = activity;   