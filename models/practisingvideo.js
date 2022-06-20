const Sequelize = require('sequelize');    
const sequelize = require('../config/db');    
    
const practisingvideo = sequelize.define('practisingvideos', {  
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
    // attributes    
    title: {
        type: Sequelize.STRING,
        allowNull: true
    },
    content: {
        type: Sequelize.STRING,
        allowNull: true
    },
    user_type: {
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
    
  module.exports =practisingvideo;    
