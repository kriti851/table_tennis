const Sequelize = require('sequelize');    
const sequelize = require('../config/db');    
    
const adminplayerchat = sequelize.define('adminplayerchats', {  
id:{
type:Sequelize.NUMBER,    
allowNull:false,    
primaryKey:true,    
autoIncrement: true    
  },
  
  user_id:{
    type:Sequelize.NUMBER, 
    allowNull:true,
},   
    message: {
        type: Sequelize.STRING,
        allowNull: true
    },

    messageFrom:{
        type:Sequelize.ENUM(['customer','admin']),
        defaultValue:'player'
    },

    type:{
        type:Sequelize.ENUM(['text','image','video']),
        defaultValue:'text'
    },
 
     
},{ 
    timestamps: true,
 
 });    
    
  module.exports = adminplayerchat; 

