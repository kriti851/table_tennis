const Sequelize = require('sequelize');    
const sequelize = require('../config/db');    
    
const training_manage = sequelize.define('training_manages', {  
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
    image: {
        type: Sequelize.STRING,
        allowNull: true    
    }, 
    video:{
        type: Sequelize.STRING,
        allowNull: true
    },
    added_by:{
        type: Sequelize.STRING,
        allowNull: true
    }     
},{ 
    timestamps: true,
 
 });    
    
  module.exports =training_manage;    