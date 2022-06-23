const Sequelize = require('sequelize');    
const sequelize = require('../config/db');   
const shortclip = sequelize.define('shortclips', {  
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
    


},{ 
    timestamps: true});
  module.exports =shortclip;  