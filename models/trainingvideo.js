const Sequelize = require('sequelize');    
const sequelize = require('../config/db');    
    
const trainingvideo = sequelize.define('trainingvideos', {  
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
    
    video:{
        type: Sequelize.STRING,
        allowNull: true
    },   
    
    approve:Sequelize.ENUM(['1','0']),

},{ 
    timestamps: true,
 
 });    
    
  module.exports =trainingvideo;    
