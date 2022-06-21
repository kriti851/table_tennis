const Sequelize = require('sequelize');    
const sequelize = require('../config/db');    
    
const promotionvideo = sequelize.define('promotionvideos', {  
    id:{
        type:Sequelize.NUMBER,    
        allowNull:false,    
        primaryKey:true,    
        autoIncrement: true    
    },     

    title:{
        type:Sequelize.STRING, 
        allowNull:true,   
    }, 
    description:{
        type:Sequelize.STRING, 
        allowNull:true,   

    },

    video:{
        type: Sequelize.STRING,
        allowNull: true
    },   
    
    approve:Sequelize.ENUM(['1','0']),
    disable:Sequelize.ENUM(['1','0']),

},{ 
    timestamps: true,
 
 });    
    
  module.exports =promotionvideo; 