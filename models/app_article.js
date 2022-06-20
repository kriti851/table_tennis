const Sequelize = require('sequelize');    
const sequelize = require('../config/db');    
    
const app_article = sequelize.define('app_articles', {  
id:{
type:Sequelize.NUMBER,    
allowNull:false,    
primaryKey:true,    
autoIncrement: true    
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
        allowNull: true,      
    },
     
},{ 
    timestamps: true,
 
 });    
    
  module.exports = app_article;    