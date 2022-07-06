const Sequelize = require('sequelize');    
const sequelize = require('../config/db');    
    
const country = sequelize.define('country', {  
id:{
type:Sequelize.NUMBER,    
allowNull:false,    
primaryKey:true,    
autoIncrement: true    
  },    
    // attributes    
    iso: {
        type: Sequelize.STRING,
        allowNull: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    iso3: {
        type: Sequelize.STRING,
        allowNull: true,
       
    },
    num_code: {
        type: Sequelize.STRING,
        allowNull: true,      
    },
    dial_code: {
        type: Sequelize.STRING,
        allowNull: true,      
    }
},{ 
    timestamps: true,
 
 });    
    
  module.exports = country;    