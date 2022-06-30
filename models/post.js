const Sequelize = require('sequelize');    
const sequelize = require('../config/db');    
    
const post = sequelize.define('post', {  
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
    sub_title: {
        type: Sequelize.STRING,
        allowNull: true
    },
    discription: {
        type: Sequelize.STRING,
        allowNull: true,
       
    },
    image: {
        type: Sequelize.STRING,
        allowNull: true,
       
    },
    created_at: {
        type: Sequelize.STRING,
        allowNull: true,
       
    },
    updated_at: {
        type: Sequelize.STRING,
        allowNull: true,
       
    },

},{ 
    timestamps: true,
 
 });    
    
  module.exports = post;    