const Sequelize = require('sequelize');    
const sequelize = require('../config/db');    
    
const subscriptions= sequelize.define('subscriptions', {    
  id:{
    type:Sequelize.NUMBER,    
    allowNull:false,    
    primaryKey:true,    
    autoIncrement: true    
  },  
  title:{
    type:Sequelize.STRING,    
    allowNull:true   
  },
  duration:{
    type:Sequelize.STRING,    
    allowNull:true    
  }, 
  price:{
    type:Sequelize.STRING,    
    allowNull:true    
  }, 
  sub_startdate:{
    type: Sequelize.DATE,  
      allowNull:true    
  }, 
  price:{
      type: Sequelize.DECIMAL,
      allowNull: true 
  }, 
  sub_expirydate:{
    type: Sequelize.DATE,
      allowNull: true 
  },
},{ timestamps: true});    
    
  module.exports =subscriptions ;  
