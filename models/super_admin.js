const Sequelize = require('sequelize');    
const sequelize = require('../config/db');    
    
const super_admin = sequelize.define('super_admins', {  
    id:{
        type:Sequelize.NUMBER,    
        allowNull:false,    
        primaryKey:true,    
        autoIncrement: true    
    },    
    // attributes    
    email: {
        type: Sequelize.STRING,
        allowNull: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: true
    },
    otp: {
        type: Sequelize.STRING,
        allowNull: true
    },     
},{ 
    timestamps: true,
 
 });    
    
  module.exports = super_admin;   